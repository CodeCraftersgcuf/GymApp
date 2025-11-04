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
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/mainscreens/HomeScreen";
import MyPlanScreen from "../screens/mainscreens/MyPlanScreen";
import PlanDetailScreen from "../screens/mainscreens/PlanDetailScreen";
import VideoLibraryScreen from "../screens/mainscreens/VideoLibraryScreen";
import WorkoutVideosScreen from "../screens/mainscreens/WorkoutVideosScreen";
import VideoDetailScreen from "../screens/mainscreens/VideoDetailScreen";
import AchievementsScreen from "../screens/mainscreens/AchievementsScreen";
import ProfileScreen from "../screens/mainscreens/ProfileScreen";
import EditProfileScreen from "../screens/mainscreens/EditProfileScreen";
import NotificationsScreen from "../screens/mainscreens/NotificationsScreen";
import CommunityScreen from "../screens/mainscreens/CommunityScreen";
import CustomerSupportScreen from "../screens/mainscreens/CustomerSupportScreen";
import MyExercisesScreen from "../screens/mainscreens/MyExercisesScreen";
import ExerciseCategoryScreen from "../screens/mainscreens/ExerciseCategoryScreen";
import ExerciseDetailScreen from "../screens/mainscreens/ExerciseDetailScreen";
import PackagesScreen from "../screens/mainscreens/PackagesScreen";
import PackageDetailScreen from "../screens/mainscreens/PackageDetailScreen";
import ReviewsScreen from "../screens/mainscreens/ReviewsScreen";
import FAQsScreen from "../screens/mainscreens/FAQsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack Navigator - contains HomeScreen, MyPlanScreen, PlanDetailScreen, VideoLibraryScreen, WorkoutVideosScreen, VideoDetailScreen, AchievementsScreen, ProfileScreen, CommunityScreen, CustomerSupportScreen, MyExercisesScreen, ExerciseCategoryScreen, and ExerciseDetailScreen
function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="MyPlan" component={MyPlanScreen} />
      <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
      <Stack.Screen name="VideoLibrary" component={VideoLibraryScreen} />
      <Stack.Screen name="WorkoutVideos" component={WorkoutVideosScreen} />
      <Stack.Screen name="VideoDetail" component={VideoDetailScreen} />
      <Stack.Screen name="MyExercises" component={MyExercisesScreen} />
      <Stack.Screen name="ExerciseCategory" component={ExerciseCategoryScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Community" component={CommunityScreen} />
      <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} />
    </Stack.Navigator>
  );
}

// Packages Stack Navigator - contains PackagesScreen and PackageDetailScreen
function PackagesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PackagesMain" component={PackagesScreen} />
      <Stack.Screen name="PackageDetail" component={PackageDetailScreen} />
    </Stack.Navigator>
  );
}

/* --------- tab icon names for Ionicons --------- */
const TAB_ICONS = {
  Home: "home-outline",
  Packages: "cube-outline",
  Reviews: "chatbubble-outline",
  FAQs: "help-circle-outline",
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
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const color = isFocused ? COLOR.active : COLOR.inactive;

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
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Reviews" component={ReviewsScreen} />
      <Tab.Screen name="Packages" component={PackagesStackNavigator} />
      <Tab.Screen name="FAQs" component={FAQsScreen} />
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
  label: { fontSize: 11, fontWeight: "400" },
});
