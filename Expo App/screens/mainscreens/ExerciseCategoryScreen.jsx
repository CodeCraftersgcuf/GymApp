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

// JSON data for exercises - will be replaced with API data later
// This is example data for "Chest Exercises"
const EXERCISES_DATA = [
  {
    id: 1,
    title: 'Bench Press | PakFit',
    exerciseType: 'CHEST EXERCISE',
    episode: 'EPISODE 01',
    duration: '10 Minutes',
    videoUrl: 'https://www.youtube.com/watch?v=j7rKKpwdXNE',
    thumbnailUrl: null,
  },
  {
    id: 2,
    title: 'Push-Ups | PakFit',
    exerciseType: 'CHEST EXERCISE',
    episode: 'EPISODE 02',
    duration: '8 Minutes',
    videoUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
    thumbnailUrl: null,
  },
  {
    id: 3,
    title: 'Incline Dumbbell Press | PakFit',
    exerciseType: 'CHEST EXERCISE',
    episode: 'EPISODE 03',
    duration: '12 Minutes',
    videoUrl: 'https://www.youtube.com/watch?v=UItWltVZZmE',
    thumbnailUrl: null,
  },
  {
    id: 4,
    title: 'Cable Flyes | PakFit',
    exerciseType: 'CHEST EXERCISE',
    episode: 'EPISODE 04',
    duration: '10 Minutes',
    videoUrl: 'https://www.youtube.com/watch?v=8KpYp3RqDGI',
    thumbnailUrl: null,
  },
  {
    id: 5,
    title: 'Dips | PakFit',
    exerciseType: 'CHEST EXERCISE',
    episode: 'EPISODE 05',
    duration: '9 Minutes',
    videoUrl: 'https://www.youtube.com/watch?v=ynP2nmO5fH8',
    thumbnailUrl: null,
  },
  {
    id: 6,
    title: 'Dumbbell Pullover | PakFit',
    exerciseType: 'CHEST EXERCISE',
    episode: 'EPISODE 06',
    duration: '8 Minutes',
    videoUrl: 'https://www.youtube.com/watch?v=ZXsQAXx_ao0',
    thumbnailUrl: null,
  },
];

const ExerciseCategoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [thumbnailErrors, setThumbnailErrors] = useState({});

  // Get category title from route params or use default
  const { categoryTitle = 'Chest Exercises', exercises: routeExercises } = route.params || {};
  const exercises = routeExercises ?? EXERCISES_DATA;

  const handleExercisePress = async (exercise) => {
    // Navigate to ExerciseDetailScreen instead of opening YouTube directly
    navigation.navigate('ExerciseDetail', {
      exercise: exercise,
      exerciseTitle: exercise.title,
      videoUrl: exercise.videoUrl,
      exerciseType: exercise.exerciseType,
      episode: exercise.episode,
      duration: exercise.duration,
    });
  };

  // Filter exercises based on search query
  const filteredExercises = exercises.filter((exercise) =>
    exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.exerciseType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get thumbnail URL for an exercise
  const getThumbnailUrl = (exercise) => {
    if (exercise.thumbnailUrl) {
      return exercise.thumbnailUrl;
    }
    return getYouTubeThumbnail(exercise.videoUrl);
  };

  // Handle thumbnail load error
  const handleThumbnailError = (exerciseId) => {
    setThumbnailErrors((prev) => ({
      ...prev,
      [exerciseId]: true,
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

      {/* Main Content - Exercises List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredExercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.exerciseCard}
            onPress={() => handleExercisePress(exercise)}
            activeOpacity={0.7}
          >
            {/* Left Side - Thumbnail with Overlay */}
            <View style={styles.thumbnailContainer}>
              {thumbnailErrors[exercise.id] ? (
                <View style={styles.thumbnailPlaceholder}>
                  <Ionicons name="barbell" size={48} color="#555" />
                </View>
              ) : (
                <Image
                  source={{ uri: getThumbnailUrl(exercise) }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                  onError={() => handleThumbnailError(exercise.id)}
                />
              )}
              {/* Red Overlay with Exercise Type and Episode */}
              <View style={styles.thumbnailOverlay}>
                <ThemedText style={styles.exerciseTypeText} font="manrope" weight="bold">
                  {exercise.exerciseType}
                </ThemedText>
                <ThemedText style={styles.episodeText} font="manrope" weight="regular">
                  {exercise.episode}
                </ThemedText>
              </View>
            </View>

            {/* Right Side - Details */}
            <View style={styles.exerciseDetails}>
              <ThemedText style={styles.exerciseTitle} font="manrope" weight="regular" numberOfLines={2}>
                {exercise.title}
              </ThemedText>
              <ThemedText style={styles.durationText} font="manrope" weight="medium">
                Duration: {exercise.duration}
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
  exerciseCard: {
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
  exerciseTypeText: {
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
  exerciseDetails: {
    flex: 1,
    paddingLeft: 16,
    paddingVertical: 12,
  },
  exerciseTitle: {
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

export default ExerciseCategoryScreen;
