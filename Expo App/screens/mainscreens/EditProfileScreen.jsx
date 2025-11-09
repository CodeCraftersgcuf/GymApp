import React, { useState, useRef, useEffect } from "react";
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
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../components/ThemeProvider";
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
  const { theme, mode } = useTheme();

  const [name, setName] = useState(DUMMY_USER_DATA.name);
  const [email, setEmail] = useState(DUMMY_USER_DATA.email);
  const [gender, setGender] = useState(DUMMY_USER_DATA.gender);
  const [weight, setWeight] = useState(DUMMY_USER_DATA.weight);
  const [location, setLocation] = useState(DUMMY_USER_DATA.location);
  const [profileImage, setProfileImage] = useState(DUMMY_USER_DATA.profileImage);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={mode === 'dark' ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <ThemedText style={[styles.headerTitle, { color: theme.colors.text }]} font="manrope" weight="bold">
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
          <Animated.View 
            style={[
              styles.content,
              {
                backgroundColor: theme.colors.surface,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Profile Picture */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale: fadeAnim }],
              }}
            >
              <TouchableOpacity 
                style={styles.profilePictureContainer}
                onPress={handleImagePicker}
                activeOpacity={0.8}
              >
                <View style={[styles.profilePicture, { backgroundColor: theme.colors.primary, borderColor: theme.colors.onPrimary }]}>
                  {profileImage ? (
                    <Image 
                      source={{ uri: profileImage }} 
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <ThemedText style={[styles.profileInitial, { color: theme.colors.onPrimary }]}>{profileInitial}</ThemedText>
                  )}
                </View>
                <View style={[styles.cameraIconContainer, { backgroundColor: theme.colors.primary, borderColor: theme.colors.surface }]}>
                  <Ionicons name="camera" size={20} color={theme.colors.onPrimary} />
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Name Field */}
            <Animated.View 
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.colors.surfaceAlt,
                  borderColor: theme.colors.border,
                }
              ]}
            >
              <Ionicons name="person-outline" size={20} color={theme.colors.text} style={styles.inputIcon} />
              <TextInput
                placeholder="Name"
                placeholderTextColor={theme.colors.textMuted}
                style={[styles.input, { color: theme.colors.text }]}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </Animated.View>

            {/* Email Field */}
            <Animated.View 
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.colors.surfaceAlt,
                  borderColor: theme.colors.border,
                }
              ]}
            >
              <Ionicons name="mail-outline" size={20} color={theme.colors.text} style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor={theme.colors.textMuted}
                style={[styles.input, { color: theme.colors.text }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Animated.View>

            {/* Gender Field */}
            <TouchableOpacity
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.colors.surfaceAlt,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={() => setShowGenderModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="people-outline" size={20} color={theme.colors.text} style={styles.inputIcon} />
              <TextInput
                placeholder="Gender"
                placeholderTextColor={gender ? theme.colors.text : theme.colors.textMuted}
                style={[styles.input, { color: theme.colors.text }]}
                value={gender}
                editable={false}
              />
              <Ionicons name="chevron-down" size={20} color={theme.colors.textMuted} />
            </TouchableOpacity>

            {/* Weight Field */}
            <Animated.View 
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.colors.surfaceAlt,
                  borderColor: theme.colors.border,
                }
              ]}
            >
              <Ionicons name="scale-outline" size={20} color={theme.colors.text} style={styles.inputIcon} />
              <TextInput
                placeholder="Weight"
                placeholderTextColor={theme.colors.textMuted}
                style={[styles.input, { color: theme.colors.text }]}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
              <TouchableOpacity style={[styles.unitButton, { backgroundColor: theme.colors.primary }]}>
                <ThemedText style={[styles.unitButtonText, { color: theme.colors.onPrimary }]}>KG</ThemedText>
              </TouchableOpacity>
            </Animated.View>

            {/* Location Field */}
            <TouchableOpacity
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.colors.surfaceAlt,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={() => setShowLocationModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="location-outline" size={20} color={theme.colors.text} style={styles.inputIcon} />
              <TextInput
                placeholder="Location"
                placeholderTextColor={location ? theme.colors.text : theme.colors.textMuted}
                style={[styles.input, { color: theme.colors.text }]}
                value={location}
                editable={false}
              />
              <Ionicons name="chevron-down" size={20} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
              <TouchableOpacity style={[styles.unitButton, { backgroundColor: theme.colors.primary }]}>
                <ThemedText style={[styles.unitButtonText, { color: theme.colors.onPrimary }]}>PK</ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              style={[
                styles.saveButton,
                {
                  backgroundColor: (!name.trim() || !email.trim() || !gender || !weight.trim() || !location)
                    ? theme.colors.border
                    : theme.colors.primary,
                  opacity: (!name.trim() || !email.trim() || !gender || !weight.trim() || !location) ? 0.6 : 1,
                }
              ]}
              disabled={!name.trim() || !email.trim() || !gender || !weight.trim() || !location}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.saveButtonText, { color: theme.colors.onPrimary }]} font="manrope" weight="bold">
                SAVE
              </ThemedText>
            </TouchableOpacity>
          </Animated.View>
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
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <ThemedText style={[styles.modalTitle, { color: theme.colors.text }]}>Select Gender</ThemedText>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.modalOption, { borderBottomColor: theme.colors.border }]}
                onPress={() => handleSelectGender(option)}
                activeOpacity={0.7}
              >
                <ThemedText style={[styles.modalOptionText, { color: theme.colors.text }]}>{option}</ThemedText>
                {gender === option && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
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
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <ThemedText style={[styles.modalTitle, { color: theme.colors.text }]}>Select Location</ThemedText>
            {locationOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.modalOption, { borderBottomColor: theme.colors.border }]}
                onPress={() => handleSelectLocation(option)}
                activeOpacity={0.7}
              >
                <ThemedText style={[styles.modalOptionText, { color: theme.colors.text }]}>{option}</ThemedText>
                {location === option && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  profileInitial: {
    fontSize: 48,
    fontWeight: "bold",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    borderRadius: 15,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  unitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  unitButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  saveButtonText: {
    fontSize: 18,
    textTransform: "uppercase",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "600",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
  },
});

export default EditProfileScreen;
