// navigators/AuthNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/authscreens/LoginScreen";
import RegisterScreen from "../screens/authscreens/RegisterScreen";
import ProfileCompletionScreen from "../screens/authscreens/ProfileCompletionScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ProfileCompletion" component={ProfileCompletionScreen} />
    </Stack.Navigator>
  );
}
