// navigation/MainNavigator.jsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/mainscreens/HomeScreen";
import PackagesScreen from "../screens/mainscreens/PackagesScreen";
import ExercisesScreen from "../screens/mainscreens/ExercisesScreen";
import SettingsScreen from "../screens/mainscreens/settingsscreens/SettingsScreen";

const Tab = createBottomTabNavigator();

/* --------- tab icon names for Ionicons --------- */
const TAB_ICONS = {
  Home: "home-outline",
  Packages: "albums-outline",
  Exercises: "barbell-outline",
  Settings: "settings-outline",
};

const COLOR = {
  active: "#E53E3E",
  inactive: "#FFFFFF",
  barBg: "#0B0B0B",
  surface: "#FFFFFF",
};

/* ----------------- Custom tab bar ----------------- */
function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  const onPress = (route, isFocused, index) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const onLongPress = (route) => {
    navigation.emit({ type: "tabLongPress", target: route.key });
  };

  // Middle index (Home in your order)
  const middleIndex = 0; // We won't elevate a middle tab; simple bar

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <View style={styles.bar}>
        {/* Simple bar; no notch */}

        {/* Render tabs */}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const color = isFocused ? COLOR.active : COLOR.inactive;

          // Regular tabs
          return (
            <View key={route.key} style={styles.slot}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={() => onPress(route, isFocused, index)}
                onLongPress={() => onLongPress(route)}
                style={styles.tabBtn}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={TAB_ICONS[route.name]}
                  size={24}
                  color={color}
                />
                <Text style={[styles.label, { color }]} numberOfLines={1}>
                  {route.name}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ----------------- Navigator ----------------- */
export default function MainNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home" // always start on Home (even if it's in the middle)
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Packages" component={PackagesScreen} />
      <Tab.Screen name="Exercises" component={ExercisesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

/* ----------------- Styles ----------------- */
const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    marginHorizontal: 12,
    backgroundColor: COLOR.barBg,
    borderRadius: 18,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingTop: 10,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 14 },
    }),
  },

  // Notch removed

  slot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 8,
  },

  tabBtn: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  icon: { width: 22, height: 22, resizeMode: "contain" },
  label: { fontSize: 11, fontWeight: "400" },

  // Raised Home removed
});
