// navigators/SettingsNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Add your settings-related screens here */}
    </Stack.Navigator>
  );
}
