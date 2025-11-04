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
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import ThemedText from "../../components/ThemedText";

// Dummy user data - will be replaced with actual user data from API/context later
const DUMMY_USER_DATA = {
  name: "User",
  email: "user@example.com",
  gender: "Male",
  weight: "70",
  location: "Lahore",
  profileImage: null,
};

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(DUMMY_USER_DATA.name);
  const [email, setEmail] = useState(DUMMY_USER_DATA.email);
  const [gender, setGender] = useState(DUMMY_USER_DATA.gender);
  const [weight, setWeight] = useState(DUMMY_USER_DATA.weight);
  const [location, setLocation] = useState(DUMMY_USER_DATA.location);
  const [profileImage, setProfileImage] = useState(DUMMY_USER_DATA.profileImage);
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

  const handleSave = () => {
    if (!name.trim() || !email.trim() || !gender || !weight.trim() || !location) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // TODO: Replace with actual API call to update profile
    const updatedProfile = {
      name: name.trim(),
      email: email.trim(),
      gender,
      weight: weight.trim(),
      location,
      profileImage,
    };

    console.log("Updated profile:", updatedProfile);
    Alert.alert("Success", "Profile updated successfully!", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.headerTitle} font="manrope" weight="bold">
              Edit Profile
            </ThemedText>
          </View>
          <View style={styles.rightSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Main Content */}
          <View style={styles.content}>
            {/* Profile Picture */}
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

            {/* Email Field */}
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
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

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              style={[
                styles.saveButton,
                (!name.trim() || !email.trim() || !gender || !weight.trim() || !location) && styles.saveButtonDisabled,
              ]}
              disabled={!name.trim() || !email.trim() || !gender || !weight.trim() || !location}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.saveButtonText} font="manrope" weight="bold">
                SAVE
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
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  rightSpacer: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
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
    borderColor: "#1A1A1A",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
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
  saveButton: {
    backgroundColor: "#E53E3E",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  saveButtonDisabled: {
    backgroundColor: "#666",
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    textTransform: "uppercase",
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

export default EditProfileScreen;
