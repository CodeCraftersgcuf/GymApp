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
  const { theme, mode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [thumbnailErrors, setThumbnailErrors] = useState({});

  // Get category title from route params or use default
  const { categoryTitle = 'Chest Exercises', exercises: routeExercises } = route.params || {};
  const exercises = routeExercises ?? EXERCISES_DATA;
  
  // Animation for exercise cards
  const cardAnimations = useRef(
    exercises.map(() => ({
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

  const handleExercisePress = async (exercise, index) => {
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
    
    // Navigate to ExerciseDetailScreen
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
            {categoryTitle}
          </ThemedText>
        </View>
        <View style={styles.rightSpacer} />
      </View>

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

      {/* Main Content - Exercises List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredExercises.map((exercise, index) => {
          const anim = cardAnimations[index] || cardAnimations[0];
          return (
            <Animated.View
              key={exercise.id}
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
                  styles.exerciseCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => handleExercisePress(exercise, index)}
                activeOpacity={1}
              >
                {/* Left Side - Thumbnail with Overlay */}
                <View style={[styles.thumbnailContainer, { backgroundColor: theme.colors.surfaceAlt }]}>
                  {thumbnailErrors[exercise.id] ? (
                    <View style={[styles.thumbnailPlaceholder, { backgroundColor: theme.colors.surface }]}>
                      <Ionicons name="barbell" size={48} color={theme.colors.textMuted} />
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
                  <Animated.View 
                    style={[
                      styles.thumbnailOverlay,
                      {
                        backgroundColor: theme.colors.primary + 'CC', // 80% opacity
                      }
                    ]}
                  >
                    <ThemedText style={[styles.exerciseTypeText, { color: theme.colors.onPrimary }]} font="manrope" weight="bold">
                      {exercise.exerciseType}
                    </ThemedText>
                    <ThemedText style={[styles.episodeText, { color: theme.colors.onPrimary }]} font="manrope" weight="regular">
                      {exercise.episode}
                    </ThemedText>
                  </Animated.View>
                </View>

                {/* Right Side - Details */}
                <View style={styles.exerciseDetails}>
                  <ThemedText style={[styles.exerciseTitle, { color: theme.colors.text }]} font="manrope" weight="regular" numberOfLines={2}>
                    {exercise.title}
                  </ThemedText>
                  <ThemedText style={[styles.durationText, { color: theme.colors.primary }]} font="manrope" weight="medium">
                    Duration: {exercise.duration}
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
  exerciseCard: {
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
  exerciseTypeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  episodeText: {
    fontSize: 12,
    textAlign: 'center',
  },
  exerciseDetails: {
    flex: 1,
    paddingLeft: 16,
    paddingVertical: 12,
  },
  exerciseTitle: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  durationText: {
    fontSize: 12,
  },
});

export default ExerciseCategoryScreen;
