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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeProvider';
import ThemedText from '../../components/ThemedText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 12) / 2; // 24px padding each side + 12px gap

// Helper function to extract YouTube video ID and generate thumbnail URL
const getYouTubeThumbnail = (videoUrl) => {
  if (!videoUrl) return null;
  
  const match = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  }
  return null;
};

// JSON data for exercise categories - will be replaced with API data later
const EXERCISE_CATEGORIES_DATA = [
  {
    id: 1,
    title: 'Chest Exercises',
    videoUrl: 'https://www.youtube.com/watch?v=j7rKKpwdXNE',
    thumbnailUrl: null,
  },
  {
    id: 2,
    title: 'Back Exercises',
    videoUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
    thumbnailUrl: null,
  },
  {
    id: 3,
    title: 'Shoulder Exercises',
    videoUrl: 'https://www.youtube.com/watch?v=UItWltVZZmE',
    thumbnailUrl: null,
  },
  {
    id: 4,
    title: 'Biceps Exercises',
    videoUrl: 'https://www.youtube.com/watch?v=8KpYp3RqDGI',
    thumbnailUrl: null,
  },
  {
    id: 5,
    title: 'Triceps Exercises',
    videoUrl: 'https://www.youtube.com/watch?v=ynP2nmO5fH8',
    thumbnailUrl: null,
  },
  {
    id: 6,
    title: 'Leg Exercises',
    videoUrl: 'https://www.youtube.com/watch?v=ZXsQAXx_ao0',
    thumbnailUrl: null,
  },
  {
    id: 7,
    title: 'Abs Exercises',
    videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    thumbnailUrl: null,
  },
  {
    id: 8,
    title: 'Cardio Exercises',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: null,
  },
];

const MyExercisesScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme, mode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [thumbnailErrors, setThumbnailErrors] = useState({});
  const [pressedCard, setPressedCard] = useState(null);
  
  // Animation for cards - staggered entrance
  const cardAnimations = useRef(
    EXERCISE_CATEGORIES_DATA.map(() => ({
      scale: new Animated.Value(0.8),
      opacity: new Animated.Value(0),
      pressAnim: new Animated.Value(1),
    }))
  ).current;
  
  useEffect(() => {
    // Staggered animation for cards
    Animated.stagger(80,
      cardAnimations.map(anim =>
        Animated.parallel([
          Animated.spring(anim.scale, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      )
    ).start();
  }, []);

  const handleExerciseCategoryPress = async (category, index) => {
    // Press animation
    const anim = cardAnimations[index];
    Animated.sequence([
      Animated.timing(anim.pressAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim.pressAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate to ExerciseCategoryScreen
    navigation.navigate('ExerciseCategory', {
      categoryTitle: category.title,
      exercises: null, // Will be fetched from API based on category
    });
  };

  // Filter categories based on search query
  const filteredCategories = EXERCISE_CATEGORIES_DATA.filter((category) =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get thumbnail URL for a category
  const getThumbnailUrl = (category) => {
    if (category.thumbnailUrl) {
      return category.thumbnailUrl;
    }
    return getYouTubeThumbnail(category.videoUrl);
  };

  // Handle thumbnail load error
  const handleThumbnailError = (categoryId) => {
    setThumbnailErrors((prev) => ({
      ...prev,
      [categoryId]: true,
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
            My Exercises
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

      {/* Main Content - Exercise Categories Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.exerciseGrid}>
          {filteredCategories.map((category, index) => {
            const anim = cardAnimations[index] || cardAnimations[0];
            return (
              <Animated.View
                key={category.id}
                style={[
                  {
                    opacity: anim.opacity,
                    transform: [
                      { scale: Animated.multiply(anim.scale, anim.pressAnim) },
                    ],
                  },
                  index % 2 === 0 && styles.exerciseCardLeft,
                ]}
              >
                <TouchableOpacity
                  style={styles.exerciseCard}
                  onPress={() => handleExerciseCategoryPress(category, index)}
                  activeOpacity={1}
                >
                  {/* Thumbnail */}
                  <View style={[styles.thumbnailContainer, { backgroundColor: theme.colors.surface }]}>
                    {thumbnailErrors[category.id] ? (
                      <View style={[styles.thumbnailPlaceholder, { backgroundColor: theme.colors.surface }]}>
                        <Ionicons name="barbell" size={48} color={theme.colors.textMuted} />
                      </View>
                    ) : (
                      <Image
                        source={{ uri: getThumbnailUrl(category) }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                        onError={() => handleThumbnailError(category.id)}
                      />
                    )}
                    {/* Play button overlay */}
                    <View style={styles.playButtonOverlay}>
                      <Animated.View 
                        style={[
                          styles.playButtonIcon,
                          {
                            backgroundColor: theme.colors.primary,
                            transform: [{ scale: anim.pressAnim }],
                          }
                        ]}
                      >
                        <Ionicons name="play" size={24} color={theme.colors.onPrimary} />
                      </Animated.View>
                    </View>
                  </View>

                  {/* Title */}
                  <ThemedText style={[styles.exerciseTitle, { color: theme.colors.text }]} font="manrope" weight="regular" numberOfLines={2}>
                    {category.title}
                  </ThemedText>
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
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exerciseCard: {
    width: CARD_WIDTH,
    marginBottom: 20,
  },
  exerciseCardLeft: {
    marginRight: 12,
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  exerciseTitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default MyExercisesScreen;
