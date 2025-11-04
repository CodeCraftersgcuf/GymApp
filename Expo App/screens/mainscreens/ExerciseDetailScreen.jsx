import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Linking,
  Share,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import ThemedText from '../../components/ThemedText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (videoUrl) => {
  if (!videoUrl) return null;
  const match = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match && match[1] ? match[1] : null;
};

// JSON data for exercise details - will be replaced with API data later
const EXERCISE_DETAILS_DATA = {
  description: "This exercise is recommended for those who have joined PakFit's Consultation Program. Follow the proper form and technique shown in the video.",
  importantPoints: [
    "Warm Up (Target Muscle) for atleast 5 Minutes before starting your Exercise.",
    "Perform 3 to 4 Sets of this Exercise.",
    "Do 12 to 15 repetitions (Fatloss Clients) of each set.",
    "Do 8 to 10 repetitions (Muscle Gain Clients) of each set.",
    "Increase weight gradually in every set.",
    "Lift according to your strength, the weight must be challenging.",
    "Maintain proper form throughout the exercise.",
    "Rest 60-90 seconds between sets.",
    "If you are doing this exercise for first time, make sure to follow the video instructions carefully.",
  ],
  workoutSchedule: [
    "Monday: Chest + Abs",
    "Tuesday: Biceps + Abs",
    "Wednesday: Shoulder + Abs",
    "Thursday: Triceps + Abs",
    "Friday: Back + Abs",
    "Saturday: Leg + Abs",
    "Sunday: Rest Day",
  ],
};

const ExerciseDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const webViewRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  // JavaScript to inject for detecting YouTube errors
  const injectedJavaScript = `
    (function() {
      function checkForErrors() {
        var errorElements = document.querySelectorAll('[class*="error"], [id*="error"]');
        for (var i = 0; i < errorElements.length; i++) {
          var text = errorElements[i].textContent || errorElements[i].innerText;
          if (text.includes('153') || text.includes('embedding') || text.includes('not available')) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', error: 'VIDEO_ERROR_153' }));
            return;
          }
        }
      }
      setTimeout(checkForErrors, 2000);
      setTimeout(checkForErrors, 5000);
    })();
    true;
  `;

  // Get exercise data from route params
  const {
    exercise,
    exerciseTitle,
    videoUrl,
    exerciseType,
    episode,
    duration,
    description,
    importantPoints,
    workoutSchedule,
  } = route.params || {};

  // Use exercise object data if provided, otherwise use individual params
  const finalVideoUrl = exercise?.videoUrl || videoUrl;
  const finalTitle = exercise?.title || exerciseTitle || 'Exercise';
  const finalExerciseType = exercise?.exerciseType || exerciseType || 'EXERCISE';
  const finalEpisode = exercise?.episode || episode || 'EPISODE 01';
  const finalDuration = exercise?.duration || duration || '10 Minutes';
  const finalDescription = description || EXERCISE_DETAILS_DATA.description;
  const finalImportantPoints = importantPoints || EXERCISE_DETAILS_DATA.importantPoints;
  const finalWorkoutSchedule = workoutSchedule || EXERCISE_DETAILS_DATA.workoutSchedule;

  // Test video that definitely allows embedding - Big Buck Bunny
  const TEST_VIDEO_ID = 'YE7VzlLtp-4';
  const videoId = TEST_VIDEO_ID;
  
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0&playsinline=1` : null;

  const handleShare = async () => {
    try {
      if (finalVideoUrl) {
        await Share.share({
          message: `Check out this exercise: ${finalTitle}\n${finalVideoUrl}`,
          url: finalVideoUrl,
        });
      } else {
        Alert.alert('Error', 'No video URL to share');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share exercise');
    }
  };

  const handleWatchOnYouTube = async () => {
    if (finalVideoUrl) {
      try {
        const supported = await Linking.canOpenURL(finalVideoUrl);
        if (supported) {
          await Linking.openURL(finalVideoUrl);
        } else {
          Alert.alert('Error', 'Unable to open YouTube');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to open YouTube');
      }
    }
  };

  useEffect(() => {
    if (isPlaying && !videoError) {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => {
        // Video loading check
      }, 8000);
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [isPlaying, videoError]);

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'ERROR' && data.error === 'VIDEO_ERROR_153') {
        setVideoError(true);
      }
    } catch (error) {
      // Ignore parsing errors
    }
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
          <View style={styles.backButtonCircle}>
            <Ionicons name="chevron-back" size={20} color="#000000" />
          </View>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.headerTitle} font="manrope" weight="bold">
            {finalTitle.split(' | ')[0] || finalTitle}
          </ThemedText>
        </View>
        <View style={styles.rightSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Player Section */}
        <View style={styles.videoPlayerContainer}>
          {embedUrl ? (
            <>
              {!isPlaying ? (
                <TouchableOpacity
                  style={styles.videoThumbnailContainer}
                  activeOpacity={1}
                  onPress={() => {
                    setVideoError(false);
                    setIsPlaying(true);
                  }}
                >
                  <View style={styles.thumbnailBackground}>
                    <ThemedText style={styles.thumbnailPlaceholderText} font="manrope" weight="regular">
                      {finalExerciseType}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.videoOverlay}>
                    <View style={styles.logoContainer}>
                      <View style={styles.logoCircle}>
                        <ThemedText style={styles.logoText} font="manrope" weight="bold">
                          F
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.pakfitText} font="oleo" weight="bold">
                        PAKFIT
                      </ThemedText>
                    </View>

                    <View style={styles.overlayCenterContent}>
                      <ThemedText style={styles.exerciseTypeText} font="manrope" weight="bold">
                        {finalExerciseType}
                      </ThemedText>
                      <View style={styles.episodeBanner}>
                        <ThemedText style={styles.episodeText} font="manrope" weight="medium">
                          {finalEpisode}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.seriesText} font="manrope" weight="regular">
                        EXERCISE SERIES
                      </ThemedText>
                    </View>

                    <View style={styles.playButtonContainer}>
                      <View style={styles.playButtonCircle}>
                        <Ionicons name="play" size={40} color="#FFFFFF" />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : videoError ? (
                <View style={styles.videoPlaceholder}>
                  <Ionicons name="alert-circle" size={48} color="#E53E3E" />
                  <ThemedText style={styles.placeholderText} font="manrope" weight="regular">
                    Unable to play video
                  </ThemedText>
                  <ThemedText style={styles.errorSubtext} font="manrope" weight="regular">
                    This video may not allow embedding.
                  </ThemedText>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => {
                      setVideoError(false);
                      setIsPlaying(true);
                    }}
                  >
                    <ThemedText style={styles.retryButtonText} font="manrope" weight="medium">
                      Retry
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.youtubeButtonFallback}
                    onPress={handleWatchOnYouTube}
                  >
                    <Ionicons name="logo-youtube" size={20} color="#FF0000" />
                    <ThemedText style={styles.youtubeButtonText} font="manrope" weight="medium">
                      Open in YouTube
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              ) : (
                <WebView
                  ref={webViewRef}
                  source={{ uri: embedUrl.replace('autoplay=0', 'autoplay=1') }}
                  style={styles.videoPlayer}
                  allowsFullscreenVideo={true}
                  mediaPlaybackRequiresUserAction={false}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  injectedJavaScript={injectedJavaScript}
                  onMessage={handleWebViewMessage}
                  onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                    setVideoError(true);
                  }}
                  onHttpError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView HTTP error: ', nativeEvent);
                    if (nativeEvent.statusCode === 403 || nativeEvent.statusCode >= 400) {
                      setVideoError(true);
                    }
                  }}
                  onNavigationStateChange={(navState) => {
                    if (navState.url.includes('error') || navState.url.includes('disable')) {
                      setVideoError(true);
                    }
                  }}
                  renderError={(errorName) => {
                    console.warn('WebView render error: ', errorName);
                    setVideoError(true);
                    return (
                      <View style={styles.videoPlaceholder}>
                        <Ionicons name="alert-circle" size={48} color="#E53E3E" />
                        <ThemedText style={styles.placeholderText} font="manrope" weight="regular">
                          Video playback error
                        </ThemedText>
                      </View>
                    );
                  }}
                />
              )}
            </>
          ) : (
            <View style={styles.videoPlaceholder}>
              <ThemedText style={styles.placeholderText} font="manrope" weight="regular">
                Video unavailable
              </ThemedText>
            </View>
          )}

          {/* Video Controls Bar */}
          <View style={styles.videoControlsBar}>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.controlButton}
              activeOpacity={0.7}
            >
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleWatchOnYouTube}
              style={styles.youtubeButton}
              activeOpacity={0.7}
            >
              <View style={styles.youtubeButtonContent}>
                <Ionicons name="logo-youtube" size={20} color="#FF0000" />
                <ThemedText style={styles.youtubeButtonText} font="manrope" weight="medium">
                  Watch on YouTube
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Exercise Title and Duration */}
        <View style={styles.exerciseInfoContainer}>
          <ThemedText style={styles.exerciseTitleText} font="manrope" weight="regular">
            {finalTitle}
          </ThemedText>
          <View style={styles.durationContainer}>
            <ThemedText style={styles.durationLabel} font="manrope" weight="regular">
              Duration :
            </ThemedText>
            <ThemedText style={styles.durationValue} font="manrope" weight="medium">
              {' '}{finalDuration}
            </ThemedText>
          </View>
        </View>

        {/* About Exercise Section */}
        <View style={styles.aboutExerciseContainer}>
          <ThemedText style={styles.sectionTitle} font="manrope" weight="bold">
            About Exercise
          </ThemedText>
          <ThemedText style={styles.descriptionText} font="manrope" weight="regular">
            {finalDescription}
          </ThemedText>

          {/* Important Points */}
          <ThemedText style={styles.subsectionTitle} font="manrope" weight="bold">
            Important Points to remember
          </ThemedText>
          {finalImportantPoints.map((point, index) => (
            <View key={index} style={styles.bulletPointContainer}>
              <View style={styles.bulletPoint} />
              <ThemedText style={styles.bulletText} font="manrope" weight="regular">
                {point}
              </ThemedText>
            </View>
          ))}

          {/* Workout Schedule */}
          <ThemedText style={styles.subsectionTitle} font="manrope" weight="bold">
            Workout Schedule:
          </ThemedText>
          {finalWorkoutSchedule.map((schedule, index) => (
            <View key={index} style={styles.bulletPointContainer}>
              <View style={styles.bulletPoint} />
              <ThemedText style={styles.bulletText} font="manrope" weight="regular">
                {schedule}
              </ThemedText>
            </View>
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
  backButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CCCCCC',
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
    paddingBottom: 120,
  },
  videoPlayerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
    position: 'relative',
  },
  videoThumbnailContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  thumbnailBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailPlaceholderText: {
    fontSize: 24,
    color: '#FFFFFF',
    opacity: 0.3,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryButton: {
    backgroundColor: '#E53E3E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 12,
  },
  retryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  youtubeButtonFallback: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  logoContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  pakfitText: {
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  overlayCenterContent: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  exerciseTypeText: {
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  episodeBanner: {
    backgroundColor: '#E53E3E',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  episodeText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  seriesText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  playButtonContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
  },
  playButtonCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(229, 62, 62, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  videoControlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  controlButton: {
    padding: 8,
  },
  youtubeButton: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  youtubeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  youtubeButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  exerciseInfoContainer: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  exerciseTitleText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 24,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationLabel: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  durationValue: {
    fontSize: 14,
    color: '#E53E3E',
  },
  aboutExerciseContainer: {
    backgroundColor: '#2A2A2A',
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 8,
  },
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginTop: 6,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 22,
  },
});

export default ExerciseDetailScreen;
