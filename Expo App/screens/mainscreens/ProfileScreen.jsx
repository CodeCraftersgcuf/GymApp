import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import ThemedText from '../../components/ThemedText';

// Dummy JSON data for other options - will be replaced with API data later
const OTHER_OPTIONS = [
  { id: 1, title: 'Privacy Policy', icon: 'shield-outline' },
  { id: 2, title: 'Terms & Conditions', icon: 'document-text-outline' },
  { id: 3, title: 'Check your Ideal Weight', icon: 'scale-outline' },
  { id: 4, title: 'Delete my account', icon: 'trash-outline' },
  { id: 5, title: 'Free Promo Code', icon: 'pricetag-outline' },
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleOptionPress = (option) => {
    // TODO: Handle navigation or action for each option
    Alert.alert('Feature', `${option.title} feature coming soon`);
  };

  const handleEditPress = () => {
    navigation.navigate('EditProfile');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // Navigation will be handled by RootNavigator based on auth state
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.headerTitle} font="manrope" weight="bold">
            Profile
          </ThemedText>
        </View>
        <View style={styles.rightSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Information Card */}
        <View style={styles.userInfoCard}>
          {/* Profile Picture */}
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageCircle}>
              <Ionicons name="person" size={32} color="#FFFFFF" />
            </View>
          </View>

          {/* User Name and Type */}
          <View style={styles.userInfoContent}>
            <ThemedText style={styles.userName} font="manrope" weight="bold">
              User
            </ThemedText>
            <ThemedText style={styles.userType} font="manrope" weight="regular">
              Free User
            </ThemedText>
          </View>

          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditPress}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.editButtonText} font="manrope" weight="medium">
              Edit
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Notification Section */}
        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle} font="manrope" weight="regular">
            Notification
          </ThemedText>
          
          <View style={styles.notificationRow}>
            <View style={styles.notificationContent}>
              <Ionicons name="notifications" size={20} color="#E53E3E" style={styles.notificationIcon} />
              <ThemedText style={styles.notificationText} font="manrope" weight="regular">
                Pop-up Notification
              </ThemedText>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#E53E3E' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#767577"
            />
          </View>
        </View>

        {/* Other Options Section */}
        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle} font="manrope" weight="regular">
            Other
          </ThemedText>
          
          {OTHER_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionRow,
                index !== OTHER_OPTIONS.length - 1 && styles.optionRowBorder,
              ]}
              onPress={() => handleOptionPress(option)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Ionicons name={option.icon} size={20} color="#E53E3E" style={styles.optionIcon} />
                <ThemedText style={styles.optionText} font="manrope" weight="regular">
                  {option.title}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.signOutButtonText} font="manrope" weight="bold">
            Sign Out
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  rightSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120, // Space for bottom navigation
  },
  // User Info Card Styles
  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImageCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoContent: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    color: '#999',
  },
  editButton: {
    backgroundColor: '#E53E3E',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  editButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  // Section Card Styles
  sectionCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  // Notification Styles
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  // Option Styles
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  optionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  // Sign Out Button Styles
  signOutButton: {
    backgroundColor: '#E53E3E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  signOutButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default ProfileScreen;
