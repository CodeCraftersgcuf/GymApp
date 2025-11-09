import React, { useState, useEffect, useRef } from "react";
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
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../components/ThemeProvider";
import ThemedText from "../../components/ThemedText";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { login } = useAuth();
  const { theme, mode } = useTheme();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={mode === 'dark' ? "light-content" : "dark-content"} backgroundColor={theme.colors.primary} />
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
          <Animated.View 
            style={[
              styles.header,
              {
                backgroundColor: theme.colors.primary,
                opacity: fadeAnim,
              }
            ]}
          >
            <ThemedText style={[styles.logoText, { color: theme.colors.onPrimary }]} font="oleo" weight="bold">
              PAKFIT
            </ThemedText>
          </Animated.View>

          {/* Main Content Area */}
          <Animated.View 
            style={[
              styles.content,
              {
                backgroundColor: theme.colors.surface,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              }
            ]}
          >
            {/* Title and Subtitle */}
            <View style={styles.titleSection}>
              <ThemedText style={[styles.title, { color: theme.colors.text }]} variant="h1">
                CREATE ACCOUNT
              </ThemedText>
              <TouchableOpacity 
                onPress={handleNavigateToProfile}
                style={styles.subtitleContainer}
                activeOpacity={0.7}
              >
                <ThemedText style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  Enter your personal information
                </ThemedText>
                <View style={[styles.underline, { backgroundColor: theme.colors.border }]} />
              </TouchableOpacity>
              {profileData.name && (
                <Animated.View 
                  style={styles.profileStatusContainer}
                  entering={Animated.spring}
                >
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                  <ThemedText style={[styles.profileStatusText, { color: theme.colors.success }]}>
                    Profile completed
                  </ThemedText>
                </Animated.View>
              )}
            </View>

            {/* Email/Phone Field */}
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
                placeholder="Email / Phone"
                placeholderTextColor={theme.colors.textMuted}
                style={[styles.input, { color: theme.colors.text }]}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Animated.View>

            {/* Password Field */}
            <Animated.View 
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.colors.surfaceAlt,
                  borderColor: theme.colors.border,
                }
              ]}
            >
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.text} style={styles.inputIcon} />
              <TextInput
                placeholder="Set 4 Digit Password"
                placeholderTextColor={theme.colors.textMuted}
                style={[styles.input, { color: theme.colors.text }]}
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
                  color={theme.colors.text} 
                />
              </TouchableOpacity>
            </Animated.View>

            {/* Terms and Conditions Checkbox */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                style={[
                  styles.checkbox,
                  {
                    borderColor: acceptedTerms ? theme.colors.primary : theme.colors.border,
                    backgroundColor: acceptedTerms ? theme.colors.primary : 'transparent',
                  }
                ]}
                activeOpacity={0.7}
              >
                {acceptedTerms && (
                  <Animated.View
                    entering={Animated.spring}
                  >
                    <Ionicons name="checkmark" size={16} color={theme.colors.onPrimary} />
                  </Animated.View>
                )}
              </TouchableOpacity>
              <View style={styles.termsTextContainer}>
                <ThemedText style={[styles.termsText, { color: theme.colors.textSecondary }]}>
                  By continuing you accept our{" "}
                </ThemedText>
                <TouchableOpacity>
                  <ThemedText style={[styles.termsLink, { color: theme.colors.primary }]}>Privacy Policy</ThemedText>
                </TouchableOpacity>
                <ThemedText style={[styles.termsText, { color: theme.colors.textSecondary }]}> and </ThemedText>
                <TouchableOpacity>
                  <ThemedText style={[styles.termsLink, { color: theme.colors.primary }]}>Terms of Use</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              style={[
                styles.registerButton,
                {
                  backgroundColor: isFormValid ? theme.colors.primary : theme.colors.border,
                  opacity: isFormValid ? 1 : 0.6,
                }
              ]}
              disabled={!isFormValid}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.registerText, { color: theme.colors.onPrimary }]} font="manrope" weight="bold">
                REGISTER
              </ThemedText>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <ThemedText style={[styles.loginText, { color: theme.colors.textSecondary }]}>
                Already have an account?{" "}
              </ThemedText>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <ThemedText style={[styles.loginLink, { color: theme.colors.primary }]}>
                  Login
                </ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 28,
    letterSpacing: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
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
    marginBottom: 8,
    textTransform: "uppercase",
  },
  subtitleContainer: {
    alignItems: "center",
    width: "100%",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  underline: {
    width: "100%",
    height: 1,
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
    borderRadius: 4,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
  },
  termsLink: {
    fontSize: 12,
    textDecorationLine: "underline",
    lineHeight: 18,
  },
  registerButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  registerText: {
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
  },
  loginLink: {
    fontSize: 14,
  },
});

export default RegisterScreen;