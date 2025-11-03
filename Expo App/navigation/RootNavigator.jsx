// navigators/RootNavigator.js
import React from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";

// Error Boundary Component
class NavigationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Navigation Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Navigation Error
          </Text>
          <Text style={{ textAlign: 'center', color: '#666' }}>
            Something went wrong with navigation. Please restart the app.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, isLoading, token, user, role, logout } = useAuth();

  console.log('RootNavigator render:', { isAuthenticated, isLoading, hasToken: !!token, hasUser: !!user, role });

  // No custom loading screen; keep it simple
  if (isLoading) return null;

  // Additional check: if no token or user, force authentication
  const shouldShowAuth = !isAuthenticated || !token || !user;

  // We use a single main tab navigator for all roles in this skeleton

  return (
    <NavigationErrorBoundary>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!shouldShowAuth ? (
          <Stack.Screen name="MainApp" component={MainNavigator} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationErrorBoundary>
  );
}
