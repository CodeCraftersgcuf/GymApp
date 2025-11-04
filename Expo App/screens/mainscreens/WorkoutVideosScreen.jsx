import React, { useState } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [thumbnailErrors, setThumbnailErrors] = useState({});

  // Get category title from route params or use default
  const { categoryTitle = "Beginner's Gym Workout", videos: routeVideos } = route.params || {};
  const videos = routeVideos ?? WORKOUT_VIDEOS_DATA;

  const handleVideoPress = async (video) => {
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
            {categoryTitle}
          </ThemedText>
        </View>
        <View style={styles.rightSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Main Content - Workout Videos List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredVideos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            onPress={() => handleVideoPress(video)}
            activeOpacity={0.7}
          >
            {/* Left Side - Thumbnail with Overlay */}
            <View style={styles.thumbnailContainer}>
              {thumbnailErrors[video.id] ? (
                <View style={styles.thumbnailPlaceholder}>
                  <Ionicons name="play-circle" size={48} color="#555" />
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
              <View style={styles.thumbnailOverlay}>
                <ThemedText style={styles.workoutTypeText} font="manrope" weight="bold">
                  {video.workoutType}
                </ThemedText>
                <ThemedText style={styles.episodeText} font="manrope" weight="regular">
                  {video.episode}
                </ThemedText>
              </View>
            </View>

            {/* Right Side - Details */}
            <View style={styles.videoDetails}>
              <ThemedText style={styles.videoTitle} font="manrope" weight="regular" numberOfLines={2}>
                {video.title}
              </ThemedText>
              <ThemedText style={styles.durationText} font="manrope" weight="medium">
                Duration: {video.duration}
              </ThemedText>
            </View>

            {/* Right Chevron */}
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ))}
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
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
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
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    alignItems: 'center',
    paddingRight: 16,
  },
  thumbnailContainer: {
    width: 120,
    height: 90,
    position: 'relative',
    backgroundColor: '#1A1A1A',
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(229, 62, 62, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  workoutTypeText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  episodeText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  videoDetails: {
    flex: 1,
    paddingLeft: 16,
    paddingVertical: 12,
  },
  videoTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 20,
  },
  durationText: {
    fontSize: 12,
    color: '#E53E3E',
  },
});

export default WorkoutVideosScreen;
