import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../components/ThemeProvider";
import ThemedText from "../../components/ThemedText";
import { useLogin } from "../../api/hooks";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login: authLogin, isAuthenticated, isLoading: authLoading } = useAuth();
  const { theme, mode } = useTheme();
  const loginMutation = useLogin();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
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
    ]).start();
  }, []);

  // Redirect to MainApp if user is already authenticated (after loading completes)
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      // Navigate to MainApp in the parent navigator (RootNavigator)
      navigation.getParent()?.navigate('MainApp');
    }
  }, [isAuthenticated, authLoading, navigation]);

  // Check if form is valid
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  // Handle login with API
  const handleLogin = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginMutation.mutateAsync({
        email: email.trim(),
        password: password.trim(),
      });

      if (result?.token && result?.data) {
        // Login hook already handles storing token and user data
        Alert.alert("Success", "Logged in successfully");
        // Navigation will happen automatically via useEffect when isAuthenticated changes
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error?.data?.message || error?.message || 'Login failed. Please try again.';
      Alert.alert("Login Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Google login functionality coming soon");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={mode === 'dark' ? "light-content" : "dark-content"} backgroundColor={theme.colors.primary} />
      
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
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Title and Subtitle */}
        <View style={styles.titleSection}>
          <ThemedText style={[styles.title, { color: theme.colors.text }]} variant="h1">
            Sign in
          </ThemedText>
          <View style={styles.subtitleContainer}>
            <ThemedText style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Enter your credentials to continue
            </ThemedText>
            <View style={[styles.underline, { backgroundColor: theme.colors.border }]} />
          </View>
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
            placeholder="Email /Phone"
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
            placeholder="Enter 4 Digit Password"
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

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isSubmitting || !isFormValid}
          style={[
            styles.loginButton,
            {
              backgroundColor: isFormValid ? theme.colors.primary : theme.colors.border,
              opacity: (isSubmitting || !isFormValid) ? 0.6 : 1,
            }
          ]}
          activeOpacity={0.8}
        >
          <ThemedText style={[styles.loginText, { color: theme.colors.onPrimary }]} font="manrope" weight="bold">
            {isSubmitting ? 'Logging in...' : 'Login'}
          </ThemedText>
        </TouchableOpacity>

        {/* Forgot Password Link */}
        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <ThemedText style={[styles.forgotPasswordText, { color: theme.colors.textSecondary }]}>
            Forgot your password?
          </ThemedText>
        </TouchableOpacity>

        {/* OR Separator */}
        <View style={styles.separator}>
          <View style={[styles.separatorLine, { backgroundColor: theme.colors.border }]} />
          <ThemedText style={[styles.separatorText, { color: theme.colors.textSecondary }]}>OR</ThemedText>
          <View style={[styles.separatorLine, { backgroundColor: theme.colors.border }]} />
        </View>

        {/* Google Login Button */}
        <TouchableOpacity
          onPress={handleGoogleLogin}
          style={[
            styles.googleButton,
            {
              backgroundColor: theme.colors.surfaceAlt,
              borderColor: theme.colors.border,
            }
          ]}
          activeOpacity={0.8}
        >
          <View style={[styles.googleIconContainer, { backgroundColor: theme.colors.onPrimary }]}>
            <ThemedText style={[styles.googleIcon, { color: theme.colors.primary }]} font="manrope" weight="bold">
              G
            </ThemedText>
          </View>
          <ThemedText style={[styles.googleButtonText, { color: theme.colors.text }]} font="manrope" weight="semibold">
            Continue With Google
          </ThemedText>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <ThemedText style={[styles.signUpText, { color: theme.colors.textSecondary }]}>
            Sign up with email{" "}
          </ThemedText>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <ThemedText style={[styles.signUpLink, { color: theme.colors.primary }]}>
              click here
            </ThemedText>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
  },
  subtitleContainer: {
    alignItems: "center",
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
  loginButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  loginText: {
    fontSize: 18,
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    fontSize: 14,
    marginHorizontal: 16,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  googleIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  googleIcon: {
    fontSize: 18,
    lineHeight: 18,
  },
  googleButtonText: {
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
  },
  signUpLink: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
