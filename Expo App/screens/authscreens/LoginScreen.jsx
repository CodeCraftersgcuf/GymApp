import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import ThemedText from "../../components/ThemedText";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, isAuthenticated, isLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Redirect to MainApp if user is already authenticated (after loading completes)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Navigate to MainApp in the parent navigator (RootNavigator)
      navigation.getParent()?.navigate('MainApp');
    }
  }, [isAuthenticated, isLoading, navigation]);

  // Check if form is valid
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  // Basic placeholder login (no API yet)
  const handleLogin = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    // Set a dummy token and minimal user; replace with real API later
    await login("dummy-token", { email: email.trim() });
    Alert.alert("Success", "Logged in (placeholder)");
  };

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Google login functionality coming soon");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E53E3E" />
      
      {/* Red Header Band with PAKFIT Logo */}
      <View style={styles.header}>
        <ThemedText style={styles.logoText} font="oleo" zs>
          PAKFIT
        </ThemedText>
      </View>

      {/* Dark Grey Main Content Area */}
      <View style={styles.content}>
        {/* Title and Subtitle */}
        <View style={styles.titleSection}>
          <ThemedText style={styles.title} variant="h1">
            Sign in
          </ThemedText>
          <View style={styles.subtitleContainer}>
            <ThemedText style={styles.subtitle}>
              Enter your credentials to continue
            </ThemedText>
            <View style={styles.underline} />
          </View>
        </View>

        {/* Email/Phone Field */}
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#FFFFFF" style={styles.inputIcon} />
          <TextInput
            placeholder="Email /Phone"
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
            placeholder="Enter 4 Digit Password"
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

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          style={[
            styles.loginButton,
            !isFormValid && styles.loginButtonDisabled,
          ]}
          disabled={!isFormValid}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.loginText} font="manrope" weight="bold">
            Login
          </ThemedText>
        </TouchableOpacity>

        {/* Forgot Password Link */}
        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <ThemedText style={styles.forgotPasswordText}>
            Forgot your password?
          </ThemedText>
        </TouchableOpacity>

        {/* OR Separator */}
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <ThemedText style={styles.separatorText}>OR</ThemedText>
          <View style={styles.separatorLine} />
        </View>

        {/* Google Login Button */}
        <TouchableOpacity
          onPress={handleGoogleLogin}
          style={styles.googleButton}
          activeOpacity={0.8}
        >
          <View style={styles.googleIconContainer}>
            <ThemedText style={styles.googleIcon} font="manrope" weight="bold">
              G
            </ThemedText>
          </View>
          <ThemedText style={styles.googleButtonText} font="manrope" weight="semibold">
            Continue With Google
          </ThemedText>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <ThemedText style={styles.signUpText}>
            Sign up with email{" "}
          </ThemedText>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <ThemedText style={styles.signUpLink}>
              click here
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    flex: 1,
    backgroundColor: "#22222",
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
  },
  subtitleContainer: {
    alignItems: "center",
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
  loginButton: {
    backgroundColor: "#E53E3E",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  loginButtonDisabled: {
    backgroundColor: "#666",
    opacity: 0.6,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#999",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#444",
  },
  separatorText: {
    fontSize: 14,
    color: "#999",
    marginHorizontal: 16,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  googleIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  googleIcon: {
    fontSize: 18,
    color: "#4285F4",
    lineHeight: 18,
  },
  googleButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  signUpText: {
    fontSize: 14,
    color: "#999",
  },
  signUpLink: {
    fontSize: 14,
    color: "#E53E3E",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
