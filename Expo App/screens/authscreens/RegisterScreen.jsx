import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import ThemedText from "../../components/ThemedText";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: "",
    gender: "",
    weight: "",
    location: "",
    profileImage: null,
  });

  // Listen for when screen comes into focus (when returning from ProfileCompletionScreen)
  useFocusEffect(
    React.useCallback(() => {
      // Check if we have profile data from navigation params
      if (route.params?.profileData) {
        setProfileData(route.params.profileData);
        // Clear params to avoid stale data
        navigation.setParams({ profileData: undefined });
      }
    }, [route.params, navigation])
  );

  // Check if form is valid
  const isFormValid = 
    email.trim() !== "" && 
    password.trim() !== "" && 
    acceptedTerms &&
    profileData.name.trim() !== "" &&
    profileData.gender !== "" &&
    profileData.weight.trim() !== "" &&
    profileData.location !== "";

  // Navigate to Profile Completion Screen
  const handleNavigateToProfile = () => {
    navigation.navigate("ProfileCompletion", {
      registrationData: {
        email,
        password,
        ...profileData,
      },
      onComplete: (data) => {
        setProfileData(data);
      },
    });
  };

  // Basic placeholder register (no API yet)
  const handleRegister = async () => {
    if (!isFormValid) {
      if (!acceptedTerms) {
        Alert.alert("Error", "Please accept the Terms of Use and Privacy Policy");
      } else if (!email.trim() || !password.trim()) {
        Alert.alert("Error", "Please fill in email and password");
      } else {
        Alert.alert("Error", "Please complete your profile information");
        handleNavigateToProfile();
      }
      return;
    }
    
    // Combine all registration data
    const registrationPayload = {
      email: email.trim(),
      password: password.trim(),
      name: profileData.name.trim(),
      gender: profileData.gender,
      weight: profileData.weight.trim(),
      location: profileData.location,
      profileImage: profileData.profileImage,
    };

    // TODO: Replace with actual API call
    console.log("Registration payload:", registrationPayload);
    
    await login("dummy-token", { 
      email: email.trim(),
      name: profileData.name.trim(),
      ...profileData 
    });
    Alert.alert("Success", "Account created successfully!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E53E3E" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Red Header Band with PAKFIT Logo */}
          <View style={styles.header}>
            <ThemedText style={styles.logoText} font="oleo" weight="bold">
              PAKFIT
            </ThemedText>
          </View>

          {/* Dark Grey Main Content Area */}
          <View style={styles.content}>
            {/* Title and Subtitle */}
            <View style={styles.titleSection}>
              <ThemedText style={styles.title} variant="h1">
                CREATE ACCOUNT
              </ThemedText>
              <TouchableOpacity 
                onPress={handleNavigateToProfile}
                style={styles.subtitleContainer}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.subtitle}>
                  Enter your personal information
                </ThemedText>
                <View style={styles.underline} />
              </TouchableOpacity>
              {profileData.name && (
                <View style={styles.profileStatusContainer}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <ThemedText style={styles.profileStatusText}>
                    Profile completed
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Email/Phone Field */}
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
              <TextInput
                placeholder="Email / Phone"
                placeholderTextColor="#999"
                style={styles.input}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Field */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
              <TextInput
                placeholder="Set 4 Digit Password"
                placeholderTextColor="#999"
                style={styles.input}
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={4}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={passwordVisible ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
            </View>

            {/* Terms and Conditions Checkbox */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxChecked
                ]}
              >
                {acceptedTerms && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
              <View style={styles.termsTextContainer}>
                <ThemedText style={styles.termsText}>
                  By continuing you accept our{" "}
                </ThemedText>
                <TouchableOpacity>
                  <ThemedText style={styles.termsLink}>Privacy Policy</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.termsText}> and </ThemedText>
                <TouchableOpacity>
                  <ThemedText style={styles.termsLink}>Terms of Use</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              style={[
                styles.registerButton,
                !isFormValid && styles.registerButtonDisabled,
              ]}
              disabled={!isFormValid}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.registerText} font="manrope" weight="bold">
                REGISTER
              </ThemedText>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <ThemedText style={styles.loginText}>
                Already have an account?{" "}
              </ThemedText>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <ThemedText style={styles.loginLink}>
                  Login
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    backgroundColor: "#E53E3E",
    paddingVertical: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 28,
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    color: "#FFFFFF",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  subtitleContainer: {
    alignItems: "center",
    width: "100%",
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  underline: {
    width: "100%",
    height: 1,
    backgroundColor: "#999",
    marginTop: 4,
  },
  profileStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  profileStatusText: {
    fontSize: 12,
    color: "#10B981",
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
  eyeIcon: {
    padding: 4,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#555",
    borderRadius: 4,
    backgroundColor: "transparent",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#E53E3E",
    borderColor: "#E53E3E",
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  termsLink: {
    fontSize: 12,
    color: "#666",
    textDecorationLine: "underline",
    lineHeight: 18,
  },
  registerButton: {
    backgroundColor: "#E53E3E",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  registerButtonDisabled: {
    backgroundColor: "#666",
    opacity: 0.6,
  },
  registerText: {
    color: "#FFFFFF",
    fontSize: 18,
    textTransform: "uppercase",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  loginText: {
    fontSize: 14,
    color: "#999",
  },
  loginLink: {
    fontSize: 14,
    color: "#E53E3E",
  },
});

export default RegisterScreen;