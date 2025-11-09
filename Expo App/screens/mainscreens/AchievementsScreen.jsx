import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import { useTheme } from '../../components/ThemeProvider';

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
  const { theme, mode } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnimations = useRef(
    ACHIEVEMENTS_DATA.map(() => ({
      translateY: new Animated.Value(30),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.stagger(100,
      cardAnimations.map(anim =>
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(anim.translateY, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ])
      )
    ).start();
  }, []);

  const handleAchievementPress = (achievement) => {
    // TODO: Navigate to achievement detail screen or handle press
    console.log('Achievement pressed:', achievement);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      
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
        <Animated.View
          style={[
            styles.profileSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Name */}
          <ThemedText style={[styles.profileName, { color: theme.colors.text }]} font="manrope" weight="bold">
            {PROFILE_DATA.name}
          </ThemedText>

          {/* Profile Picture and Biography */}
          <View style={styles.profileContent}>
            {/* Profile Picture */}
            <View style={styles.profileImageContainer}>
              <View style={[styles.profileImageCircle, { backgroundColor: theme.colors.primary, borderColor: theme.colors.onPrimary }]}>
                {PROFILE_DATA.profileImageUrl ? (
                  <Image
                    source={{ uri: PROFILE_DATA.profileImageUrl }}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <ThemedText style={[styles.profileInitial, { color: theme.colors.onPrimary }]} font="manrope" weight="bold">
                      O
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>

            {/* Biography */}
            <View style={styles.biographyContainer}>
              <ThemedText style={[styles.biographyText, { color: theme.colors.text }]} font="manrope" weight="regular">
                {PROFILE_DATA.biography}
              </ThemedText>
            </View>
          </View>
        </Animated.View>

        {/* Achievements List */}
        <View style={styles.achievementsList}>
          {ACHIEVEMENTS_DATA.map((achievement, index) => (
            <Animated.View
              key={achievement.id}
              style={{
                opacity: cardAnimations[index].opacity,
                transform: [{ translateY: cardAnimations[index].translateY }],
              }}
            >
              <TouchableOpacity
                style={[styles.achievementCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                onPress={() => handleAchievementPress(achievement)}
                activeOpacity={0.7}
              >
                {/* Left Side - Thumbnail with Overlay */}
                <View style={[styles.thumbnailContainer, { backgroundColor: theme.colors.background }]}>
                  {achievement.thumbnailUrl ? (
                    <Image
                      source={{ uri: achievement.thumbnailUrl }}
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.thumbnailPlaceholder, { backgroundColor: theme.colors.surface }]}>
                      <Ionicons name="image-outline" size={32} color={theme.colors.textMuted} />
                    </View>
                  )}
                  {/* Red Overlay with Text */}
                  <View style={[styles.thumbnailOverlay, { backgroundColor: `${theme.colors.primary}D9` }]}>
                    <ThemedText style={[styles.overlayText, { color: theme.colors.onPrimary }]} font="manrope" weight="bold">
                      {achievement.overlayText}
                    </ThemedText>
                  </View>
                </View>

                {/* Middle - Title */}
                <View style={styles.achievementTitleContainer}>
                  <ThemedText style={[styles.achievementTitle, { color: theme.colors.text }]} font="manrope" weight="regular">
                    {achievement.title}
                  </ThemedText>
                </View>

                {/* Right Side - Chevron */}
                <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
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
  // Profile Section Styles
  profileSection: {
    marginBottom: 32,
  },
  profileName: {
    fontSize: 24,
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
    borderWidth: 3,
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
  },
  biographyContainer: {
    flex: 1,
  },
  biographyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  // Achievements List Styles
  achievementsList: {
    gap: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  thumbnailContainer: {
    width: 100,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 12,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 10,
    textAlign: 'center',
  },
  achievementTitleContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
  },
});

export default AchievementsScreen;
