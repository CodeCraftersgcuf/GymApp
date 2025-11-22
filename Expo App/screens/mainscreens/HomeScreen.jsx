import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../components/ThemeProvider';
import ThemedText from '../../components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Linking, Image } from 'react-native';
import { useBanners } from '../../api/hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Feature grid items - using outline icons to match the photo
const FEATURE_ITEMS = [
  { id: 1, icon: 'list-outline', title: 'My Plan', locked: false },
  { id: 2, icon: 'barbell-outline', title: 'My Exercises', locked: false },
  { id: 3, icon: 'play-circle-outline', title: 'Video Library', locked: false },
  { id: 4, icon: 'chatbubbles-outline', title: 'Chat with OB', locked: false },
  { id: 5, icon: 'people-outline', title: 'Community', locked: false },
  { id: 6, icon: 'trophy-outline', title: 'Achievements', locked: false },
];

const HomeScreen = () => {
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { theme, mode } = useTheme();
  
  // Fetch banners from API
  const { data: bannersData, isLoading: isLoadingBanners } = useBanners({ per_page: 10 });
  const banners = bannersData?.data || [];
  
  // Animation for cards
  const cardAnimations = useRef(
    FEATURE_ITEMS.map(() => new Animated.Value(0))
  ).current;
  
  React.useEffect(() => {
    Animated.stagger(50, 
      cardAnimations.map(anim => 
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  const handleCarouselScroll = (event) => {
    const slideSize = SCREEN_WIDTH - 48;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / slideSize);
    setActiveCarouselIndex(index);
  };

  const handleFeaturePress = (item) => {
    if (item.locked) {
      // Item is locked, don't navigate
      return;
    }

    // Navigate based on feature
    if (item.title === 'My Plan') {
      navigation.navigate('MyPlan');
    } else if (item.title === 'My Exercises') {
      navigation.navigate('MyExercises');
    } else if (item.title === 'Video Library') {
      navigation.navigate('VideoLibrary');
    } else if (item.title === 'Achievements') {
      navigation.navigate('Achievements');
    } else if (item.title === 'Community') {
      navigation.navigate('Community');
    } else if (item.title === 'Chat with OB') {
      navigation.navigate('CustomerSupport');
    }
    // Add other feature navigation handlers here when needed
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          {/* Left - User Icon */}
          <TouchableOpacity
            style={styles.userIconContainer}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <View style={[styles.userIconCircle, { backgroundColor: theme.colors.primary }]}>
              <ThemedText style={[styles.userIconText, { color: theme.colors.onPrimary }]} font="manrope" weight="bold">
                H
              </ThemedText>
            </View>
          </TouchableOpacity>

          {/* Center - PAKFIT Logo */}
          <View style={styles.logoContainer}>
            <ThemedText style={[styles.headerLogoText, { color: theme.colors.text }]} font="oleo" weight="bold">
              PAKFIT
            </ThemedText>
          </View>

          {/* Right - Notification Bell */}
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <ThemedText style={[styles.greetingText, { color: theme.colors.text }]} font="manrope" weight="medium">
            Hello Hafiz,
          </ThemedText>
        </View>

        {/* User Stats Card */}
        <Animated.View 
          style={[
            styles.statsCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
        >
          {/* Left Side */}
          <View style={styles.statsLeft}>
            <View style={styles.freeUserBadge}>
              <ThemedText style={styles.freeUserText} font="manrope" weight="medium">
                Free user
              </ThemedText>
            </View>
            <ThemedText style={styles.weightText} font="manrope" weight="bold">
              110 KG's
            </ThemedText>
            <ThemedText style={styles.weightLabel} font="manrope" weight="regular">
              Your Current Weight
            </ThemedText>
          </View>

          {/* Right Side */}
          <View style={styles.statsRight}>
            <View style={styles.statsLogoCircle}>
              <ThemedText style={styles.statsLogoText} font="manrope" weight="bold">
                F
              </ThemedText>
            </View>
            <ThemedText style={styles.timeText} font="manrope" weight="bold">
              a few seconds
            </ThemedText>
            <ThemedText style={[styles.timeLabel, { color: theme.colors.textSecondary }]} font="manrope" weight="regular">
              since you're here
            </ThemedText>
          </View>
        </Animated.View>

        {/* Consultation Plan Banner */}
        <TouchableOpacity style={styles.consultationBanner}>
          <ThemedText style={styles.consultationText} font="manrope" weight="medium">
            Join our Consultation Plan
          </ThemedText>
          <View style={styles.watchVideoButton}>
            <ThemedText style={styles.watchVideoText} font="manrope" weight="bold">
              Watch Video
            </ThemedText>
          </View>
        </TouchableOpacity>

        {/* Feature Grid */}
        <View style={styles.featureGrid}>
          {FEATURE_ITEMS.map((item, index) => (
            <Animated.View
              key={item.id}
              style={[
                {
                  opacity: cardAnimations[index],
                  transform: [
                    {
                      scale: cardAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                  (index + 1) % 3 !== 0 && styles.featureCardMarginRight,
                ]}
                disabled={item.locked}
                activeOpacity={0.7}
                onPress={() => handleFeaturePress(item)}
              >
                {item.locked && (
                  <View style={styles.lockIconContainer}>
                    <Ionicons name="lock-closed" size={16} color={theme.colors.primary} />
                  </View>
                )}
                <Ionicons name={item.icon} size={36} color={theme.colors.primary} />
                <ThemedText style={[styles.featureTitle, { color: theme.colors.text }]} font="manrope" weight="medium">
                  {item.title}
                </ThemedText>
                {item.locked && (
                  <ThemedText style={[styles.lockedText, { color: theme.colors.textSecondary }]} font="manrope" weight="regular">
                    Locked
                  </ThemedText>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Bottom Carousel Banner */}
        <View style={styles.carouselContainer}>
          {isLoadingBanners ? (
            <View style={styles.carouselLoadingContainer}>
              <ThemedText style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                Loading banners...
              </ThemedText>
            </View>
          ) : banners.length > 0 ? (
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleCarouselScroll}
              style={styles.carousel}
              contentContainerStyle={styles.carouselContent}
            >
              {banners.map((banner) => (
              <TouchableOpacity 
                key={banner.id} 
                style={styles.carouselItem}
                onPress={() => {
                  if (banner.link_url) {
                    Linking.openURL(banner.link_url).catch(console.error);
                  }
                }}
                activeOpacity={0.8}
              >
                {banner.image_url ? (
                  <Image 
                    source={{ uri: banner.image_url }} 
                    style={styles.bannerImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.carouselBanner}>
                    {/* Left Side - PAKFIT Branding */}
                    <View style={styles.bannerLeft}>
                      <View style={styles.bannerLogoCircle}>
                        <ThemedText style={styles.bannerLogoText} font="manrope" weight="bold">
                          F
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.bannerBrandText} font="oleo" weight="bold">
                        PAKFIT
                      </ThemedText>
                      <ThemedText style={styles.bannerTaglineText} font="manrope" weight="regular">
                        {banner.description || "Pakistan's 1st Fitness App"}
                      </ThemedText>
                      <View style={styles.badgesContainer}>
                        <View style={styles.badgePlaceholder}>
                          <ThemedText style={styles.badgeText} font="manrope" weight="medium">
                            Google Play
                          </ThemedText>
                        </View>
                        <View style={styles.badgePlaceholder}>
                          <ThemedText style={styles.badgeText} font="manrope" weight="medium">
                            App Store
                          </ThemedText>
                        </View>
                      </View>
                    </View>

                    {/* Right Side - Fitness Person Image */}
                    <View style={styles.bannerRight}>
                      <View style={styles.fitnessImagePlaceholder}>
                        <TouchableOpacity style={styles.learnMoreButton}>
                          <ThemedText style={styles.learnMoreText} font="manrope" weight="bold">
                            LEARN MORE
                          </ThemedText>
                        </TouchableOpacity>
                        <Ionicons name="fitness" size={80} color="#FFFFFF" />
                      </View>
                    </View>
                  </View>
                )}
                {banner.title && (
                  <View style={styles.bannerTitleOverlay}>
                    <ThemedText style={styles.bannerTitleText} font="manrope" weight="bold">
                      {banner.title}
                    </ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          ) : null}

          {/* Carousel Pagination Dots */}
          {banners.length > 0 && (
            <View style={styles.paginationContainer}>
              {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeCarouselIndex === index && styles.paginationDotActive,
                ]}
              />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for bottom navigation
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  userIconContainer: {
    width: 48,
  },
  userIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIconText: {
    fontSize: 20,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerLogoText: {
    fontSize: 24,
    letterSpacing: 2,
  },
  notificationButton: {
    width: 48,
    alignItems: 'flex-end',
  },
  // Greeting Styles
  greetingContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 18,
  },
  // Stats Card Styles
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  statsLeft: {
    flex: 1,
  },
  statsRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  freeUserBadge: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  freeUserText: {
    fontSize: 12,
  },
  weightText: {
    fontSize: 32,
    marginBottom: 4,
  },
  weightLabel: {
    fontSize: 12,
  },
  statsLogoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statsLogoText: {
    fontSize: 28,
  },
  timeText: {
    fontSize: 24,
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 12,
  },
  // Consultation Banner Styles
  consultationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A2A2A',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  consultationText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  watchVideoButton: {
    backgroundColor: '#E53E3E',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  watchVideoText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  // Feature Grid Styles
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  featureCard: {
    width: (SCREEN_WIDTH - 72) / 3, // 3 columns: 24px padding each side + 2 gaps of 12px
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 12,
    position: 'relative',
    borderWidth: 1,
  },
  featureCardMarginRight: {
    marginRight: 12,
  },
  lockIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  featureTitle: {
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
  lockedText: {
    fontSize: 10,
    marginTop: 4,
  },
  // Carousel Styles
  carouselContainer: {
    marginBottom: 20,
  },
  carousel: {
    height: 180,
  },
  carouselContent: {
    paddingRight: 24,
  },
  carouselItem: {
    width: SCREEN_WIDTH - 48,
    marginLeft: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  bannerTitleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
  },
  bannerTitleText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  carouselLoadingContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  carouselBanner: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    height: 180,
  },
  bannerLeft: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  bannerLogoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bannerLogoText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  bannerBrandText: {
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bannerTaglineText: {
    fontSize: 10,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'column',
    gap: 6,
    marginTop: 4,
  },
  badgePlaceholder: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 8,
    color: '#FFFFFF',
  },
  bannerRight: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    position: 'relative',
  },
  fitnessImagePlaceholder: {
    width: 100,
    height: 160,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnMoreButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#E53E3E',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    zIndex: 1,
  },
  learnMoreText: {
    fontSize: 8,
    color: '#FFFFFF',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#555',
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
});

export default HomeScreen;

