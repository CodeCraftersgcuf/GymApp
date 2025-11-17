import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Dimensions,
  Linking,
  Alert,
  Image,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeProvider';
import ThemedText from '../../components/ThemedText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper function to extract YouTube video ID and generate thumbnail URL
const getYouTubeThumbnail = (videoUrl) => {
  if (!videoUrl) return null;
  
  const match = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  }
  return null;
};

// JSON data for workout videos - will be replaced with API data later
// This is example data for "Beginner's Gym Workout"
const WORKOUT_VIDEOS_DATA = [
  {
    id: 1,
    title: 'Chest Workout for Beginners | PakFit',
    workoutType: 'CHEST WORKOUT',
    episode: 'EPISODE 01',
    duration: '10 Minutes',
    videoUrl: 'https://www.youtube.com/watch?v=j7rKKpwdXNE',
    thumbnailUrl: null,
  },
  {
    id: 2,
    title: 'Biceps Workout for Beginners | PakFit',
    workoutType: 'BICEPS WORKOUT',
    episode: 'EPISODE 02',
    duration: '10 Minutes',
    videoUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
    thumbnailUrl: null,
  },
  {
    id: 3,
    title: 'Shoulder Workout for Beginners | PakFit',
    workoutType: 'SHOULDER WORKOUT',
    episode: 'EPISODE 03',
    duration: '10 Minutes',
    videoUrl: 'https://www.youtube.com/watch?v=UItWltVZZmE',
    thumbnailUrl: null,
  },
  {
    id: 4,
    title: 'Triceps Workout for Beginners | PakFit',
    workoutType: 'TRICEPS WORKOUT',
    episode: 'EPISODE 04',
    duration: '10 Minutes',
    videoUrl: 'https://www.youtube.com/watch?v=8KpYp3RqDGI',
    thumbnailUrl: null,
  },
  {
    id: 5,
    title: 'Back Workout for Beginners | PakFit',
    workoutType: 'BACK WORKOUT',
    episode: 'EPISODE 05',
    duration: '10 Minutes',
    videoUrl: 'https://www.youtube.com/watch?v=ynP2nmO5fH8',
    thumbnailUrl: null,
  },
  {
    id: 6,
    title: 'Leg Workout for Beginners | PakFit',
    workoutType: 'LEG WORKOUT',
    episode: 'EPISODE 06',
    duration: '10 Minutes',
    videoUrl: 'https://www.youtube.com/watch?v=ZXsQAXx_ao0',
    thumbnailUrl: null,
  },
];

const WorkoutVideosScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { theme, mode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [thumbnailErrors, setThumbnailErrors] = useState({});
  
  // Get category title from route params or use default
  const { categoryTitle = "Beginner's Gym Workout", videos: routeVideos } = route.params || {};
  const videos = routeVideos ?? WORKOUT_VIDEOS_DATA;
  
  // Animation for video cards
  const cardAnimations = useRef(
    videos.map(() => ({
      translateX: new Animated.Value(50),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.95),
      pressAnim: new Animated.Value(1),
    }))
  ).current;
  
  useEffect(() => {
    // Staggered animation for cards
    Animated.stagger(60,
      cardAnimations.map(anim =>
        Animated.parallel([
          Animated.spring(anim.translateX, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(anim.scale, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ])
      )
    ).start();
  }, []);

  const handleVideoPress = async (video, index) => {
    // Press animation
    const anim = cardAnimations[index];
    if (anim) {
      Animated.sequence([
        Animated.timing(anim.pressAnim, {
          toValue: 0.96,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(anim.pressAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    // Navigate to VideoDetailScreen instead of opening YouTube directly
    navigation.navigate('VideoDetail', {
      video: video,
      videoTitle: video.title,
      videoUrl: video.videoUrl,
      workoutType: video.workoutType,
      episode: video.episode,
      duration: video.duration,
    });
  };

  // Filter videos based on search query
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.workoutType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get thumbnail URL for a video
  const getThumbnailUrl = (video) => {
    if (video.thumbnailUrl) {
      return video.thumbnailUrl;
    }
    return getYouTubeThumbnail(video.videoUrl);
  };

  // Handle thumbnail load error
  const handleThumbnailError = (videoId) => {
    setThumbnailErrors((prev) => ({
      ...prev,
      [videoId]: true,
    }));
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={mode === 'dark' ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            borderBottomColor: theme.colors.border,
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <ThemedText style={[styles.headerTitle, { color: theme.colors.text }]} font="manrope" weight="bold">
            {categoryTitle}
          </ThemedText>
        </View>
        <View style={styles.rightSpacer} />
      </Animated.View>

      {/* Search Bar */}
      <Animated.View 
        style={[
          styles.searchContainer,
          {
            opacity: cardAnimations[0]?.opacity || 1,
          }
        ]}
      >
        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Ionicons name="search" size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search"
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </Animated.View>

      {/* Main Content - Workout Videos List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredVideos.map((video, index) => {
          const anim = cardAnimations[index] || cardAnimations[0];
          return (
            <Animated.View
              key={video.id}
              style={[
                {
                  opacity: anim.opacity,
                  transform: [
                    { translateX: anim.translateX },
                    { scale: Animated.multiply(anim.scale, anim.pressAnim) },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.videoCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => handleVideoPress(video, index)}
                activeOpacity={1}
              >
                {/* Left Side - Thumbnail with Overlay */}
                <View style={[styles.thumbnailContainer, { backgroundColor: theme.colors.background }]}>
                  {thumbnailErrors[video.id] ? (
                    <View style={[styles.thumbnailPlaceholder, { backgroundColor: theme.colors.surface }]}>
                      <Ionicons name="play-circle" size={48} color={theme.colors.textMuted} />
                    </View>
                  ) : (
                    <Image
                      source={{ uri: getThumbnailUrl(video) }}
                      style={styles.thumbnail}
                      resizeMode="cover"
                      onError={() => handleThumbnailError(video.id)}
                    />
                  )}
                  {/* Red Overlay with Workout Type and Episode */}
                  <Animated.View 
                    style={[
                      styles.thumbnailOverlay,
                      {
                        backgroundColor: theme.colors.primary + 'CC', // 80% opacity
                      }
                    ]}
                  >
                    <ThemedText style={[styles.workoutTypeText, { color: theme.colors.onPrimary }]} font="manrope" weight="bold">
                      {video.workoutType}
                    </ThemedText>
                    <ThemedText style={[styles.episodeText, { color: theme.colors.onPrimary }]} font="manrope" weight="regular">
                      {video.episode}
                    </ThemedText>
                  </Animated.View>
                </View>

                {/* Right Side - Details */}
                <View style={styles.videoDetails}>
                  <ThemedText style={[styles.videoTitle, { color: theme.colors.text }]} font="manrope" weight="regular" numberOfLines={2}>
                    {video.title}
                  </ThemedText>
                  <ThemedText style={[styles.durationText, { color: theme.colors.primary }]} font="manrope" weight="medium">
                    Duration: {video.duration}
                  </ThemedText>
                </View>

                {/* Right Chevron */}
                <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
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
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Space for bottom navigation
  },
  videoCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    alignItems: 'center',
    paddingRight: 16,
    borderWidth: 1,
  },
  thumbnailContainer: {
    width: 120,
    height: 90,
    position: 'relative',
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  workoutTypeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  episodeText: {
    fontSize: 12,
    textAlign: 'center',
  },
  videoDetails: {
    flex: 1,
    paddingLeft: 16,
    paddingVertical: 12,
  },
  videoTitle: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  durationText: {
    fontSize: 12,
  },
});

export default WorkoutVideosScreen;
