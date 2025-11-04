import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import ThemedText from "../../components/ThemedText";

const ProfileCompletionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { registrationData, onComplete } = route.params || {};

  const [name, setName] = useState(registrationData?.name || "");
  const [gender, setGender] = useState(registrationData?.gender || "");
  const [weight, setWeight] = useState(registrationData?.weight || "");
  const [location, setLocation] = useState(registrationData?.location || "");
  const [profileImage, setProfileImage] = useState(registrationData?.profileImage || null);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Get first letter of name for profile placeholder
  const profileInitial = name.trim() ? name.trim().charAt(0).toUpperCase() : "?";

  // Sample data - replace with actual data source
  const genderOptions = ["Male", "Female", "Other"];
  const locationOptions = ["Faisalabad", "Lahore", "Karachi", "Islamabad", "Rawalpindi"];

  // Request image picker permissions
  const requestImagePickerPermission = async (useCamera = false) => {
    if (Platform.OS !== "web") {
      if (useCamera) {
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Sorry, we need camera permissions to take a photo!"
          );
          return false;
        }
      } else {
        const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (libraryStatus.status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Sorry, we need photo library permissions to select an image!"
          );
          return false;
        }
      }
    }
    return true;
  };

  // Handle profile image selection
  const handleImagePicker = async () => {
    Alert.alert(
      "Select Profile Picture",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: async () => {
            const hasPermission = await requestImagePickerPermission(true);
            if (!hasPermission) return;

            try {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });

              if (!result.canceled && result.assets && result.assets[0]) {
                setProfileImage(result.assets[0].uri);
              }
            } catch (error) {
              Alert.alert("Error", "Failed to open camera. Please try again.");
            }
          },
        },
        {
          text: "Photo Library",
          onPress: async () => {
            const hasPermission = await requestImagePickerPermission(false);
            if (!hasPermission) return;

            try {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });

              if (!result.canceled && result.assets && result.assets[0]) {
                setProfileImage(result.assets[0].uri);
              }
            } catch (error) {
              Alert.alert("Error", "Failed to open photo library. Please try again.");
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleSelectGender = (selectedGender) => {
    setGender(selectedGender);
    setShowGenderModal(false);
  };

  const handleSelectLocation = (selectedLocation) => {
    setLocation(selectedLocation);
    setShowLocationModal(false);
  };

  const handleNext = () => {
    if (!name.trim() || !gender || !weight.trim() || !location) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const profileData = {
      name: name.trim(),
      gender,
      weight: weight.trim(),
      location,
      profileImage,
    };

    // Call the callback if provided
    if (onComplete) {
      onComplete(profileData);
    }

    // Navigate back to RegisterScreen with updated data via params
    navigation.navigate("Register", { profileData });
  };

  const handleBackToHome = () => {
    navigation.getParent()?.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A2A2A" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Dark Grey Main Content Area */}
          <View style={styles.content}>
            {/* Title */}
            <ThemedText style={styles.title}>Let's Complete Your Profile</ThemedText>

            {/* Profile Picture Placeholder */}
            <TouchableOpacity 
              style={styles.profilePictureContainer}
              onPress={handleImagePicker}
              activeOpacity={0.8}
            >
              <View style={styles.profilePicture}>
                {profileImage ? (
                  <Image 
                    source={{ uri: profileImage }} 
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <ThemedText style={styles.profileInitial}>{profileInitial}</ThemedText>
                )}
              </View>
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* Name Field */}
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
              <TextInput
                placeholder="Name"
                placeholderTextColor="#999"
                style={styles.input}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {/* Gender Field */}
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowGenderModal(true)}
            >
              <Ionicons name="people-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
              <TextInput
                placeholder="Gender"
                placeholderTextColor={gender ? "#FFFFFF" : "#999"}
                style={styles.input}
                value={gender}
                editable={false}
              />
              <Ionicons name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>

            {/* Weight Field */}
            <View style={styles.inputWrapper}>
              <Ionicons name="scale-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
              <TextInput
                placeholder="Weight"
                placeholderTextColor="#999"
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.unitButton}>
                <ThemedText style={styles.unitButtonText}>KG</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Location Field */}
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowLocationModal(true)}
            >
              <Ionicons name="location-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
              <TextInput
                placeholder="Location"
                placeholderTextColor={location ? "#FFFFFF" : "#999"}
                style={styles.input}
                value={location}
                editable={false}
              />
              <Ionicons name="chevron-down" size={20} color="#999" style={{ marginRight: 8 }} />
              <TouchableOpacity style={styles.unitButton}>
                <ThemedText style={styles.unitButtonText}>PK</ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Next Button */}
            <TouchableOpacity
              onPress={handleNext}
              style={[
                styles.nextButton,
                (!name.trim() || !gender || !weight.trim() || !location) && styles.nextButtonDisabled,
              ]}
              disabled={!name.trim() || !gender || !weight.trim() || !location}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.nextButtonText} font="manrope" weight="bold">
                NEXT
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gender Modal */}
      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowGenderModal(false)}
        >
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Select Gender</ThemedText>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => handleSelectGender(option)}
              >
                <ThemedText style={styles.modalOptionText}>{option}</ThemedText>
                {gender === option && (
                  <Ionicons name="checkmark" size={20} color="#E53E3E" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Location Modal */}
      <Modal
        visible={showLocationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowLocationModal(false)}
        >
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Select Location</ThemedText>
            {locationOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => handleSelectLocation(option)}
              >
                <ThemedText style={styles.modalOptionText}>{option}</ThemedText>
                {location === option && (
                  <Ionicons name="checkmark" size={20} color="#E53E3E" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2A2A2A",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 32,
    fontWeight: "600",
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 32,
    position: "relative",
    alignSelf: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E53E3E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  profileInitial: {
    fontSize: 48,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#E53E3E",
    borderRadius: 15,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#2A2A2A",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  unitButton: {
    backgroundColor: "#E53E3E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  unitButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#E53E3E",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  nextButtonDisabled: {
    backgroundColor: "#666",
    opacity: 0.6,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    textTransform: "uppercase",
  },
  backToHomeContainer: {
    alignItems: "center",
  },
  backToHomeText: {
    fontSize: 14,
    color: "#E53E3E",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#2A2A2A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 20,
    fontWeight: "600",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default ProfileCompletionScreen;
