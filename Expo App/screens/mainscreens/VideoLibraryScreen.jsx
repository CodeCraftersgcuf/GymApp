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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 12) / 2; // 24px padding each side + 12px gap

// Helper function to extract YouTube video ID and generate thumbnail URL
const getYouTubeThumbnail = (videoUrl) => {
  if (!videoUrl) return null;
  
  // Extract video ID from various YouTube URL formats
  let videoId = null;
  
  // Format: https://www.youtube.com/watch?v=VIDEO_ID
  // Format: https://youtu.be/VIDEO_ID
  // Format: https://www.youtube.com/embed/VIDEO_ID
  const match = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (match && match[1]) {
    videoId = match[1];
  }
  
  if (!videoId) return null;
  
  // Return high-quality thumbnail URL
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// JSON data for video library - will be replaced with API data later
// Each item can have a YouTube video URL or direct thumbnail URL
const VIDEO_LIBRARY_DATA = [
  {
    id: 1,
    title: "Beginner's Gym Workout",
    videoUrl: 'https://www.youtube.com/watch?v=j7rKKpwdXNE', // Example fitness video
    thumbnailUrl: null, // Will be generated from videoUrl
  },
  {
    id: 2,
    title: "Intermediate Gym Workout",
    videoUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI', // Example workout video
    thumbnailUrl: null,
  },
  {
    id: 3,
    title: "Beginner's Home Workout",
    videoUrl: 'https://www.youtube.com/watch?v=UItWltVZZmE', // Example home workout
    thumbnailUrl: null,
  },
  {
    id: 4,
    title: '1st Time Gym Guide',
    videoUrl: 'https://www.youtube.com/watch?v=8KpYp3RqDGI', // Example gym guide
    thumbnailUrl: null,
  },
  {
    id: 5,
    title: 'Fitness Lessons',
    videoUrl: 'https://www.youtube.com/watch?v=ynP2nmO5fH8', // Example fitness lesson
    thumbnailUrl: null,
  },
  {
    id: 6,
    title: 'Motivational Videos',
    videoUrl: 'https://www.youtube.com/watch?v=ZXsQAXx_ao0', // Example motivational video
    thumbnailUrl: null,
  },
  {
    id: 7,
    title: 'PakFit Kitchen',
    videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0', // Example cooking video
    thumbnailUrl: null,
  },
  {
    id: 8,
    title: 'Frequently Asked Questions',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Example FAQ video
    thumbnailUrl: null,
  },
];

const VideoLibraryScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [thumbnailErrors, setThumbnailErrors] = useState({});

  const handleVideoPress = async (video) => {
    // Navigate to WorkoutVideosScreen instead of opening YouTube directly
    // Pass the video category title and videos list (will be replaced with API call later)
    navigation.navigate('WorkoutVideos', {
      categoryTitle: video.title,
      videos: null, // Will be fetched from API based on category
    });
  };

  // Filter videos based on search query
  const filteredVideos = VIDEO_LIBRARY_DATA.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get thumbnail URL for a video
  const getThumbnailUrl = (video) => {
    // If direct thumbnail URL is provided, use it
    if (video.thumbnailUrl) {
      return video.thumbnailUrl;
    }
    // Otherwise, generate from YouTube URL
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
            Video Library
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

      {/* Main Content - Video Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.videoGrid}>
          {filteredVideos.map((video, index) => (
            <TouchableOpacity
              key={video.id}
              style={[
                styles.videoCard,
                index % 2 === 0 && styles.videoCardLeft,
              ]}
              onPress={() => handleVideoPress(video)}
              activeOpacity={0.7}
            >
              {/* Thumbnail */}
              <View style={styles.thumbnailContainer}>
                {thumbnailErrors[video.id] ? (
                  // Fallback placeholder if thumbnail fails to load
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
                {/* Play button overlay */}
                <View style={styles.playButtonOverlay}>
                  <View style={styles.playButtonIcon}>
                    <Ionicons name="play" size={24} color="#FFFFFF" />
                  </View>
                </View>
              </View>

              {/* Title */}
              <ThemedText style={styles.videoTitle} font="manrope" weight="regular" numberOfLines={2}>
                {video.title}
              </ThemedText>
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
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  videoCard: {
    width: CARD_WIDTH,
    marginBottom: 20,
  },
  videoCardLeft: {
    marginRight: 12,
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#2A2A2A',
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
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(229, 62, 62, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4, // Slight offset for play icon
  },
  videoTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
});

export default VideoLibraryScreen;
