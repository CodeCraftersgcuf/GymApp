import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../components/ThemeProvider';
import ThemedText from '../../components/ThemedText';
import { useLogout } from '../../api/hooks';

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
  const { logout: authLogout } = useAuth();
  const { theme, mode, toggleMode } = useTheme();
  const logoutMutation = useLogout();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Animation for theme toggle
  const themeToggleAnim = useRef(new Animated.Value(mode === 'dark' ? 1 : 0)).current;
  
  useEffect(() => {
    Animated.spring(themeToggleAnim, {
      toValue: mode === 'dark' ? 1 : 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [mode]);

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
            try {
              await logoutMutation.mutateAsync();
              // Logout hook already handles clearing auth data and navigation
            } catch (error) {
              console.error('Logout error:', error);
              // Even if API call fails, clear local auth
              authLogout();
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleThemeToggle = () => {
    toggleMode();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={mode === 'dark' ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <ThemedText style={[styles.headerTitle, { color: theme.colors.text }]} font="manrope" weight="bold">
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
        <Animated.View 
          style={[
            styles.userInfoCard, 
            { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
        >
          {/* Profile Picture */}
          <View style={styles.profileImageContainer}>
            <Animated.View 
              style={[
                styles.profileImageCircle,
                { backgroundColor: theme.colors.primary }
              ]}
            >
              <Ionicons name="person" size={32} color={theme.colors.onPrimary} />
            </Animated.View>
          </View>

          {/* User Name and Type */}
          <View style={styles.userInfoContent}>
            <ThemedText style={[styles.userName, { color: theme.colors.text }]} font="manrope" weight="bold">
              User
            </ThemedText>
            <ThemedText style={[styles.userType, { color: theme.colors.textSecondary }]} font="manrope" weight="regular">
              Free User
            </ThemedText>
          </View>

          {/* Edit Button */}
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleEditPress}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.editButtonText, { color: theme.colors.onPrimary }]} font="manrope" weight="medium">
              Edit
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>

        {/* Notification Section */}
        <Animated.View 
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
        >
          <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]} font="manrope" weight="regular">
            Notification
          </ThemedText>
          
          <View style={styles.notificationRow}>
            <View style={styles.notificationContent}>
              <Ionicons name="notifications" size={20} color={theme.colors.primary} style={styles.notificationIcon} />
              <ThemedText style={[styles.notificationText, { color: theme.colors.text }]} font="manrope" weight="regular">
                Pop-up Notification
              </ThemedText>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.onPrimary}
              ios_backgroundColor={theme.colors.border}
            />
          </View>
        </Animated.View>

        {/* Theme Toggle Section */}
        <Animated.View 
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
        >
          <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]} font="manrope" weight="regular">
            Appearance
          </ThemedText>
          
          <View style={styles.themeRow}>
            <View style={styles.themeContent}>
              <Animated.View
                style={[
                  styles.themeIconContainer,
                  {
                    backgroundColor: themeToggleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['#FFD700', '#1A1A1A'],
                    }),
                  }
                ]}
              >
                <Ionicons 
                  name={mode === 'dark' ? 'moon' : 'sunny'} 
                  size={20} 
                  color={mode === 'dark' ? '#FFFFFF' : '#1A1A1A'} 
                  style={styles.themeIcon} 
                />
              </Animated.View>
              <View style={styles.themeTextContainer}>
                <ThemedText style={[styles.themeText, { color: theme.colors.text }]} font="manrope" weight="regular">
                  {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </ThemedText>
                <ThemedText style={[styles.themeSubtext, { color: theme.colors.textSecondary }]} font="manrope" weight="regular">
                  {mode === 'dark' ? 'Easier on the eyes' : 'Bright and clear'}
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleThemeToggle}
              style={[
                styles.themeToggleButton,
                {
                  backgroundColor: theme.colors.primary,
                }
              ]}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.themeToggleThumb,
                  {
                    transform: [
                      {
                        translateX: themeToggleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [2, 22],
                        }),
                      },
                    ],
                    backgroundColor: theme.colors.onPrimary,
                  }
                ]}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Other Options Section */}
        <Animated.View 
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
        >
          <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]} font="manrope" weight="regular">
            Other
          </ThemedText>
          
          {OTHER_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionRow,
                index !== OTHER_OPTIONS.length - 1 && { borderBottomColor: theme.colors.border },
              ]}
              onPress={() => handleOptionPress(option)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <Ionicons name={option.icon} size={20} color={theme.colors.primary} style={styles.optionIcon} />
                <ThemedText style={[styles.optionText, { color: theme.colors.text }]} font="manrope" weight="regular">
                  {option.title}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <ThemedText style={[styles.signOutButtonText, { color: theme.colors.onPrimary }]} font="manrope" weight="bold">
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImageCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoContent: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
  },
  editButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  editButtonText: {
    fontSize: 14,
  },
  // Section Card Styles
  sectionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
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
  },
  // Theme Toggle Styles
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  themeIcon: {
    // Icon color handled inline
  },
  themeTextContainer: {
    flex: 1,
  },
  themeText: {
    fontSize: 14,
    marginBottom: 2,
  },
  themeSubtext: {
    fontSize: 12,
  },
  themeToggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  themeToggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  // Option Styles
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
  },
  // Sign Out Button Styles
  signOutButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  signOutButtonText: {
    fontSize: 16,
  },
});

export default ProfileScreen;
