import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import { useTheme } from '../../components/ThemeProvider';

// JSON data for protocols - will be replaced with API data later
// Each item can have a YouTube video URL
const PROTOCOLS_DATA = [
  {
    id: 1,
    text: 'Important Rules and Instructions to be followed.',
    videoUrl: null, // YouTube URL will be added here
  },
  {
    id: 2,
    text: 'Avoid food made of White Flour (Maida), for e.g Bakery items, Pizza, Pasta, Bun, White Bread, White Naan (Roti), Biscuits, etc.',
    videoUrl: null,
  },
  {
    id: 3,
    text: 'Avoid food containing sugar, such as Canned Juices, Cold drinks, Cakes, Chocolates etc.',
    videoUrl: null,
  },
  {
    id: 4,
    text: 'Drink enough water, so your Urine is clear—approximately 8 to 12 glasses.',
    videoUrl: null,
  },
  {
    id: 5,
    text: 'Oil intake should not exceed (3-5 tablespoon) per day (Olive oil and Desi ghee) is recommended.',
    videoUrl: null,
  },
  {
    id: 6,
    text: 'This plan is approx (1500 to 1800) Calories, designed especially according to your ideal body weight.',
    videoUrl: null,
  },
  {
    id: 7,
    text: 'Breakfast, Lunch and Dinner.',
    videoUrl: null,
  },
];

const PlanDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { theme, mode } = useTheme();
  const cardAnimations = useRef(
    PROTOCOLS_DATA.map(() => ({
      translateY: new Animated.Value(30),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.95),
    }))
  ).current;

  // Get the plan type and title from route params
  // Handle null explicitly since default parameter only works for undefined
  const { planType, title = 'Protocols', items: routeItems } = route.params || {};
  const items = routeItems ?? PROTOCOLS_DATA;

  useEffect(() => {
    const animations = items.map((_, index) =>
      Animated.parallel([
        Animated.timing(cardAnimations[index].translateY, {
          toValue: 0,
          duration: 400,
          delay: index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnimations[index].opacity, {
          toValue: 1,
          duration: 400,
          delay: index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnimations[index].scale, {
          toValue: 1,
          duration: 400,
          delay: index * 50,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(50, animations).start();
  }, []);

  const handlePlayPress = async (item) => {
    if (item.videoUrl) {
      // If there's a YouTube URL, open it
      try {
        const supported = await Linking.canOpenURL(item.videoUrl);
        if (supported) {
          await Linking.openURL(item.videoUrl);
        } else {
          Alert.alert('Error', 'Unable to open video URL');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to open video');
      }
    } else {
      // TODO: Handle video playback when API provides YouTube URLs
      Alert.alert('Video', `Play video for: ${item.text.substring(0, 50)}...`);
    }
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
            {title.toUpperCase()}
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
        {/* Protocol Items List */}
        <View style={styles.listContainer}>
          {items.map((item, index) => {
            const animIndex = index < cardAnimations.length ? index : cardAnimations.length - 1;
            return (
              <Animated.View
                key={item.id || index}
                style={[
                  styles.protocolCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    opacity: cardAnimations[animIndex].opacity,
                    transform: [
                      { translateY: cardAnimations[animIndex].translateY },
                      { scale: cardAnimations[animIndex].scale },
                    ],
                  },
                ]}
              >
                {/* Left Side - Red Bullet Point and Text */}
                <View style={styles.leftContent}>
                  <View style={[styles.bulletPoint, { backgroundColor: theme.colors.primary }]} />
                  <ThemedText style={[styles.protocolText, { color: theme.colors.text }]} font="manrope" weight="regular">
                    {item.text}
                  </ThemedText>
                </View>

                {/* Right Side - Play Button */}
                <TouchableOpacity
                  style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => handlePlayPress(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="play" size={18} color={theme.colors.onPrimary} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
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
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  listContainer: {
    gap: 12,
  },
  protocolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  protocolText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2, // Offset play icon slightly right for better visual alignment
  },
});

export default PlanDetailScreen;
