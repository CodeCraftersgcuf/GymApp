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
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../components/ThemeProvider';
import ThemedText from '../../components/ThemedText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (videoUrl) => {
  if (!videoUrl) return null;
  const match = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match && match[1] ? match[1] : null;
};

// JSON data for video details - will be replaced with API data later
const VIDEO_DETAILS_DATA = {
  description: "This Beginners Gym Workout Video series is recommended for those who have joined PakFit's Consultation Program for the very first Time.",
  importantPoints: [
    "Warm Up (Target Muscle) for atleast 5 Minutes before starting your Workout.",
    "Perform 3 to 4 Sets of every Exercise.",
    "Do 12 to 15 repetitions (Fatloss Clients) of each exercise.",
    "Do 8 to 10 repetitions (Muscle Gain Clients) of each exercise.",
    "Increase weight gradually in every set.",
    "Lift according to your strength, the weight must be challenging.",
    "Finish off your Workout with Training Abs (daily)",
    "Workout duration must be 60 - 90 Minutes",
    "If you are going to the Gym for first time, make sure to follow (1st Time Gym Guide) Video series in the Video Playlist Section",
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

const VideoDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { theme, mode } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const webViewRef = useRef(null);
  const errorTimeoutRef = useRef(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const playButtonScale = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const handlePlayPress = () => {
    Animated.sequence([
      Animated.spring(playButtonScale, {
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.spring(playButtonScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    setVideoError(false);
    setIsPlaying(true);
  };

  // JavaScript to inject for detecting YouTube errors
  const injectedJavaScript = `
    (function() {
      // Check for YouTube error messages
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
      
      // Check periodically
      setTimeout(checkForErrors, 2000);
      setTimeout(checkForErrors, 5000);
    })();
    true; // note: this is required, or you'll sometimes get silent failures
  `;

  // Get video data from route params
  const {
    video,
    videoTitle,
    videoUrl,
    workoutType,
    episode,
    duration,
    description,
    importantPoints,
    workoutSchedule,
  } = route.params || {};

  // Use video object data if provided, otherwise use individual params
  const finalVideoUrl = video?.videoUrl || videoUrl;
  const finalTitle = video?.title || videoTitle || 'Video';
  const finalWorkoutType = video?.workoutType || workoutType || 'WORKOUT';
  const finalEpisode = video?.episode || episode || 'EPISODE 01';
  const finalDuration = video?.duration || duration || '10 Minutes';
  const finalDescription = description || VIDEO_DETAILS_DATA.description;
  const finalImportantPoints = importantPoints || VIDEO_DETAILS_DATA.importantPoints;
  const finalWorkoutSchedule = workoutSchedule || VIDEO_DETAILS_DATA.workoutSchedule;

  // Test video that definitely allows embedding - Big Buck Bunny (commonly used for testing)
  // This video is guaranteed to allow embedding for testing purposes
  const TEST_VIDEO_ID = 'YE7VzlLtp-4'; // Big Buck Bunny - this video definitely allows embedding
  
  // For testing: Always use the test video that allows embedding
  // TODO: Replace this with your actual video ID when you have videos that allow embedding
  const videoId = TEST_VIDEO_ID;
  
  // Original code (commented out for testing):
  // let videoId = getYouTubeVideoId(finalVideoUrl);
  
  // Use standard YouTube embed URL with minimal parameters to avoid error 153
  // Error 153 often occurs when origin parameter or other restrictive params are used
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0&playsinline=1` : null;

  const handleShare = async () => {
    try {
      if (finalVideoUrl) {
        await Share.share({
          message: `Check out this workout video: ${finalTitle}\n${finalVideoUrl}`,
          url: finalVideoUrl,
        });
      } else {
        Alert.alert('Error', 'No video URL to share');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share video');
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

  // Set up timeout to detect if video doesn't load
  useEffect(() => {
    if (isPlaying && !videoError) {
      // Clear any existing timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      
      // Set a timeout to check if video loaded after 8 seconds
      errorTimeoutRef.current = setTimeout(() => {
        // Check if WebView has loaded content
        // If after 8 seconds we haven't received an error, assume it's working
        // (We could make this smarter by checking WebView state)
      }, 8000);
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [isPlaying, videoError]);

  // Handle messages from injected JavaScript
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
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={mode === 'dark' ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            borderBottomColor: theme.colors.border,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <View style={[styles.backButtonCircle, { backgroundColor: theme.colors.surfaceAlt }]}>
            <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
          </View>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <ThemedText style={[styles.headerTitle, { color: theme.colors.text }]} font="manrope" weight="bold">
            {finalTitle.split(' | ')[0] || finalTitle}
          </ThemedText>
        </View>
        <View style={styles.rightSpacer} />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Player Section */}
        <View style={styles.videoPlayerContainer}>
          {embedUrl ? (
            <>
              {/* Thumbnail with Overlay (shown initially) */}
              {!isPlaying ? (
                <TouchableOpacity
                  style={styles.videoThumbnailContainer}
                  activeOpacity={1}
                  onPress={handlePlayPress}
                >
                  {/* Thumbnail Image Background */}
                  <View style={[styles.thumbnailBackground, { backgroundColor: theme.colors.surfaceElevated }]}>
                    <ThemedText style={[styles.thumbnailPlaceholderText, { color: theme.colors.textMuted }]} font="manrope" weight="regular">
                      {finalWorkoutType}
                    </ThemedText>
                  </View>
                  
                  {/* Overlay with Info */}
                  <View style={styles.videoOverlay}>
                    {/* PAKFIT Logo - Top Left */}
                    <View style={styles.logoContainer}>
                      <View style={[styles.logoCircle, { backgroundColor: theme.colors.primary }]}>
                        <ThemedText style={[styles.logoText, { color: theme.colors.onPrimary }]} font="manrope" weight="bold">
                          F
                        </ThemedText>
                      </View>
                      <ThemedText style={[styles.pakfitText, { color: theme.colors.textInverse }]} font="oleo" weight="bold">
                        PAKFIT
                      </ThemedText>
                    </View>

                    {/* Workout Type - Center */}
                    <View style={styles.overlayCenterContent}>
                      <ThemedText style={[styles.workoutTypeText, { color: theme.colors.textInverse }]} font="manrope" weight="bold">
                        {finalWorkoutType}
                      </ThemedText>
                      <View style={[styles.episodeBanner, { backgroundColor: theme.colors.primary }]}>
                        <ThemedText style={[styles.episodeText, { color: theme.colors.onPrimary }]} font="manrope" weight="medium">
                          {finalEpisode}
                        </ThemedText>
                      </View>
                      <ThemedText style={[styles.seriesText, { color: theme.colors.textInverse }]} font="manrope" weight="regular">
                        BEGINNERS WORKOUT SERIES
                      </ThemedText>
                    </View>

                    {/* Play Button - Center */}
                    <Animated.View 
                      style={[
                        styles.playButtonContainer,
                        { transform: [{ scale: playButtonScale }] }
                      ]}
                    >
                      <View style={[styles.playButtonCircle, { backgroundColor: theme.colors.primary + 'E6' }]}>
                        <Ionicons name="play" size={40} color={theme.colors.onPrimary} />
                      </View>
                    </Animated.View>
                  </View>
                </TouchableOpacity>
                             ) : videoError ? (
                 /* Error fallback */
                 <Animated.View 
                   style={[
                     styles.videoPlaceholder,
                     {
                       backgroundColor: theme.colors.surface,
                       opacity: fadeAnim,
                     }
                   ]}
                 >
                   <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
                   <ThemedText style={[styles.placeholderText, { color: theme.colors.text }]} font="manrope" weight="regular">
                     Unable to play video
                   </ThemedText>
                   <ThemedText style={[styles.errorSubtext, { color: theme.colors.textSecondary }]} font="manrope" weight="regular">
                     This video may not allow embedding.
                   </ThemedText>
                  <TouchableOpacity
                    style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => {
                      setVideoError(false);
                      setIsPlaying(true);
                    }}
                  >
                    <ThemedText style={[styles.retryButtonText, { color: theme.colors.onPrimary }]} font="manrope" weight="medium">
                      Retry
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.youtubeButtonFallback, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}
                    onPress={handleWatchOnYouTube}
                  >
                    <Ionicons name="logo-youtube" size={20} color="#FF0000" />
                    <ThemedText style={[styles.youtubeButtonText, { color: theme.colors.text }]} font="manrope" weight="medium">
                      Open in YouTube
                    </ThemedText>
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                /* Video Player (shown when playing) */
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
                    // Error 153 might show up here, handle it gracefully
                    if (nativeEvent.statusCode === 403 || nativeEvent.statusCode >= 400) {
                      setVideoError(true);
                    }
                  }}
                  onNavigationStateChange={(navState) => {
                    // Check URL for error indicators
                    if (navState.url.includes('error') || navState.url.includes('disable')) {
                      setVideoError(true);
                    }
                  }}
                  renderError={(errorName) => {
                    console.warn('WebView render error: ', errorName);
                    setVideoError(true);
                    return (
                      <View style={[styles.videoPlaceholder, { backgroundColor: theme.colors.surface }]}>
                        <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
                        <ThemedText style={[styles.placeholderText, { color: theme.colors.text }]} font="manrope" weight="regular">
                          Video playback error
                        </ThemedText>
                      </View>
                    );
                  }}
                />
              )}
            </>
          ) : (
            <View style={[styles.videoPlaceholder, { backgroundColor: theme.colors.surface }]}>
              <ThemedText style={[styles.placeholderText, { color: theme.colors.text }]} font="manrope" weight="regular">
                Video unavailable
              </ThemedText>
            </View>
          )}

          {/* Video Controls Bar */}
          <Animated.View 
            style={[
              styles.videoControlsBar,
              {
                backgroundColor: theme.colors.surface,
                borderTopColor: theme.colors.border,
                opacity: fadeAnim,
              }
            ]}
          >
            <TouchableOpacity
              onPress={handleShare}
              style={styles.controlButton}
              activeOpacity={0.7}
            >
              <Ionicons name="share-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleWatchOnYouTube}
              style={[styles.youtubeButton, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}
              activeOpacity={0.7}
            >
              <View style={styles.youtubeButtonContent}>
                <Ionicons name="logo-youtube" size={20} color="#FF0000" />
                <ThemedText style={[styles.youtubeButtonText, { color: theme.colors.text }]} font="manrope" weight="medium">
                  Watch on YouTube
                </ThemedText>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Video Title and Duration */}
        <Animated.View 
          style={[
            styles.videoInfoContainer,
            {
              backgroundColor: theme.colors.surface,
              opacity: fadeAnim,
            }
          ]}
        >
          <ThemedText style={[styles.videoTitleText, { color: theme.colors.text }]} font="manrope" weight="regular">
            {finalTitle}
          </ThemedText>
          <View style={styles.durationContainer}>
            <ThemedText style={[styles.durationLabel, { color: theme.colors.text }]} font="manrope" weight="regular">
              Duration :
            </ThemedText>
            <ThemedText style={[styles.durationValue, { color: theme.colors.primary }]} font="manrope" weight="medium">
              {' '}{finalDuration}
            </ThemedText>
          </View>
        </Animated.View>

        {/* About Video Section */}
        <Animated.View 
          style={[
            styles.aboutVideoContainer,
            {
              backgroundColor: theme.colors.surface,
              opacity: fadeAnim,
            }
          ]}
        >
          <ThemedText style={[styles.sectionTitle, { color: theme.colors.text }]} font="manrope" weight="bold">
            About Video
          </ThemedText>
          <ThemedText style={[styles.descriptionText, { color: theme.colors.text }]} font="manrope" weight="regular">
            {finalDescription}
          </ThemedText>

          {/* Important Points */}
          <ThemedText style={[styles.subsectionTitle, { color: theme.colors.text }]} font="manrope" weight="bold">
            Important Points to remember
          </ThemedText>
          {finalImportantPoints.map((point, index) => (
            <Animated.View 
              key={index} 
              style={[
                styles.bulletPointContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                }
              ]}
            >
              <View style={[styles.bulletPoint, { backgroundColor: theme.colors.primary }]} />
              <ThemedText style={[styles.bulletText, { color: theme.colors.text }]} font="manrope" weight="regular">
                {point}
              </ThemedText>
            </Animated.View>
          ))}

          {/* Workout Schedule */}
          <ThemedText style={[styles.subsectionTitle, { color: theme.colors.text }]} font="manrope" weight="bold">
            Workout Schedule:
          </ThemedText>
          {finalWorkoutSchedule.map((schedule, index) => (
            <Animated.View 
              key={index} 
              style={[
                styles.bulletPointContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                }
              ]}
            >
              <View style={[styles.bulletPoint, { backgroundColor: theme.colors.primary }]} />
              <ThemedText style={[styles.bulletText, { color: theme.colors.text }]} font="manrope" weight="regular">
                {schedule}
              </ThemedText>
            </Animated.View>
          ))}
        </Animated.View>
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
  backButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    paddingBottom: 120, // Space for bottom navigation
  },
  // Video Player Styles
  videoPlayerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailPlaceholderText: {
    fontSize: 24,
    opacity: 0.3,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 12,
  },
  retryButtonText: {
    fontSize: 16,
  },
  youtubeButtonFallback: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
  },
  pakfitText: {
    fontSize: 14,
    letterSpacing: 1,
  },
  overlayCenterContent: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  workoutTypeText: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 12,
  },
  episodeBanner: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  episodeText: {
    fontSize: 14,
  },
  seriesText: {
    fontSize: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  videoControlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  controlButton: {
    padding: 8,
  },
  youtubeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  youtubeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  youtubeButtonText: {
    fontSize: 14,
  },
  // Video Info Styles
  videoInfoContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  videoTitleText: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationLabel: {
    fontSize: 14,
  },
  durationValue: {
    fontSize: 14,
  },
  // About Video Styles
  aboutVideoContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 16,
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
    marginTop: 6,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
});

export default VideoDetailScreen;
