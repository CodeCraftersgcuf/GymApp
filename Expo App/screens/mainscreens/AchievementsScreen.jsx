import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';

// Dummy JSON data for achievements - will be replaced with API data later
const ACHIEVEMENTS_DATA = [
  {
    id: 1,
    title: 'Interviews on TV',
    overlayText: 'AS A FITNESS CELEBRITY',
    thumbnailUrl: null, // Will be replaced with actual image URL
  },
  {
    id: 2,
    title: 'As an Entrepreneur',
    overlayText: 'AS AN ENTREPRENEUR',
    thumbnailUrl: null,
  },
  {
    id: 3,
    title: 'As a TV Model',
    overlayText: 'AS A FITNESS MODEL',
    thumbnailUrl: null,
  },
  {
    id: 4,
    title: 'As a Speaker',
    overlayText: 'AS A SPEAKER',
    thumbnailUrl: null,
  },
];

const PROFILE_DATA = {
  name: 'Omar Bilal Ahmed',
  biography: "Omar Bilal Ahmad is acknowledged as Pakistan's 1st Fitness Consultant who has successfully consulted more than 30,000 Clients since 2018. He is a Certified Fitness Professional from California, USA. Also a successful Entrepreneur and a Motivational Speaker.",
  profileImageUrl: null, // Will be replaced with actual image URL
};

const AchievementsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleAchievementPress = (achievement) => {
    // TODO: Navigate to achievement detail screen or handle press
    console.log('Achievement pressed:', achievement);
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
            Achievements
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
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Name */}
          <ThemedText style={styles.profileName} font="manrope" weight="bold">
            {PROFILE_DATA.name}
          </ThemedText>

          {/* Profile Picture and Biography */}
          <View style={styles.profileContent}>
            {/* Profile Picture */}
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImageCircle}>
                {PROFILE_DATA.profileImageUrl ? (
                  <Image
                    source={{ uri: PROFILE_DATA.profileImageUrl }}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <ThemedText style={styles.profileInitial} font="manrope" weight="bold">
                      O
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>

            {/* Biography */}
            <View style={styles.biographyContainer}>
              <ThemedText style={styles.biographyText} font="manrope" weight="regular">
                {PROFILE_DATA.biography}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Achievements List */}
        <View style={styles.achievementsList}>
          {ACHIEVEMENTS_DATA.map((achievement) => (
            <TouchableOpacity
              key={achievement.id}
              style={styles.achievementCard}
              onPress={() => handleAchievementPress(achievement)}
              activeOpacity={0.7}
            >
              {/* Left Side - Thumbnail with Overlay */}
              <View style={styles.thumbnailContainer}>
                {achievement.thumbnailUrl ? (
                  <Image
                    source={{ uri: achievement.thumbnailUrl }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.thumbnailPlaceholder}>
                    <Ionicons name="image-outline" size={32} color="#555" />
                  </View>
                )}
                {/* Red Overlay with Text */}
                <View style={styles.thumbnailOverlay}>
                  <ThemedText style={styles.overlayText} font="manrope" weight="bold">
                    {achievement.overlayText}
                  </ThemedText>
                </View>
              </View>

              {/* Middle - Title */}
              <View style={styles.achievementTitleContainer}>
                <ThemedText style={styles.achievementTitle} font="manrope" weight="regular">
                  {achievement.title}
                </ThemedText>
              </View>

              {/* Right Side - Chevron */}
              <Ionicons name="chevron-forward" size={24} color="#E53E3E" />
            </TouchableOpacity>
          ))}
        </View>
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
  // Profile Section Styles
  profileSection: {
    marginBottom: 32,
  },
  profileName: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImageCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E53E3E',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  biographyContainer: {
    flex: 1,
  },
  biographyText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  // Achievements List Styles
  achievementsList: {
    gap: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  thumbnailContainer: {
    width: 100,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1A1A1A',
    marginRight: 12,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(229, 62, 62, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  achievementTitleContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default AchievementsScreen;
