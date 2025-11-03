// navigators/ChatNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function ChatNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Add your chat-related screens here */}
    </Stack.Navigator>
  );
}
