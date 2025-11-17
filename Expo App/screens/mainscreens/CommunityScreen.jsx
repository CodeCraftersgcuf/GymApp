import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Modal,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../components/ThemeProvider';
import ThemedText from '../../components/ThemedText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Dummy URLs - will be replaced with backend links later
// Using desktop URLs to potentially avoid QUIC protocol issues
const FACEBOOK_PAGE_URL = 'https://www.facebook.com/Pakfit.Ltb';
const INSTAGRAM_PAGE_URL = 'https://www.instagram.com/pakfit.pk';

const MODAL_STORAGE_KEY = '@pakfit_community_modal_dismissed';

const CommunityScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme, mode } = useTheme();
  const [activeTab, setActiveTab] = useState('Facebook');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const tabUnderlineAnim = useRef(new Animated.Value(activeTab === 'Facebook' ? 0 : 1)).current;
  
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  useEffect(() => {
    Animated.spring(tabUnderlineAnim, {
      toValue: activeTab === 'Facebook' ? 0 : 1,
      tension: 100,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  // Check if modal has been dismissed before
  useEffect(() => {
    const checkModalStatus = async () => {
      try {
        const dismissed = await AsyncStorage.getItem(MODAL_STORAGE_KEY);
        if (!dismissed) {
          // Show modal if not dismissed before
          setShowLoginModal(true);
        }
      } catch (error) {
        console.error('Error checking modal status:', error);
        // Show modal by default if there's an error
        setShowLoginModal(true);
      }
    };

    checkModalStatus();
  }, []);

  // Reset error state when tab changes
  useEffect(() => {
    setHasError(false);
    setErrorMessage('');
    setIsLoading(true);
    setRefreshKey(0);
  }, [activeTab]);

  const handleCloseModal = async () => {
    try {
      await AsyncStorage.setItem(MODAL_STORAGE_KEY, 'true');
      setShowLoginModal(false);
    } catch (error) {
      console.error('Error saving modal status:', error);
      setShowLoginModal(false);
    }
  };

  const handleLoginPress = () => {
    // TODO: Implement Facebook login
    handleCloseModal();
  };

  const handleCreateAccountPress = () => {
    // TODO: Implement account creation
    handleCloseModal();
  };

  const getCurrentUrl = () => {
    return activeTab === 'Facebook' ? FACEBOOK_PAGE_URL : INSTAGRAM_PAGE_URL;
  };

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage('');
    setIsLoading(true);
    // Force WebView reload by incrementing refresh key
    setRefreshKey(prev => prev + 1);
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
    setIsLoading(false);
    
    // Check for QUIC protocol error or other network errors
    const errorDescription = nativeEvent?.description || '';
    if (errorDescription.includes('ERR_QUIC_PROTOCOL_ERROR') || 
        errorDescription.includes('net::') ||
        nativeEvent?.code === -1) {
      setErrorMessage('Network connection error. Please check your internet connection and try again.');
    } else {
      setErrorMessage('Unable to load content. Please try again.');
    }
    setHasError(true);
  };

  const handleWebViewHttpError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView HTTP error: ', nativeEvent);
    setIsLoading(false);
    setErrorMessage(`HTTP Error ${nativeEvent?.statusCode || 'Unknown'}. Please try again.`);
    setHasError(true);
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
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <ThemedText style={[styles.headerTitle, { color: theme.colors.text }]} font="manrope" weight="bold">
            Community
          </ThemedText>
        </View>
        <View style={styles.rightSpacer} />
      </Animated.View>

      {/* Tabs */}
      <Animated.View 
        style={[
          styles.tabsContainer,
          {
            borderBottomColor: theme.colors.border,
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Facebook')}
          activeOpacity={0.7}
        >
          <ThemedText
            style={[
              styles.tabText,
              {
                color: activeTab === 'Facebook' ? theme.colors.primary : theme.colors.textSecondary,
              }
            ]}
            font="manrope"
            weight={activeTab === 'Facebook' ? "semibold" : "regular"}
          >
            Facebook
          </ThemedText>
          <Animated.View 
            style={[
              styles.tabUnderline,
              {
                backgroundColor: theme.colors.primary,
                opacity: tabUnderlineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
                transform: [{
                  translateX: tabUnderlineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, SCREEN_WIDTH / 2],
                  }),
                }],
              }
            ]} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Instagram')}
          activeOpacity={0.7}
        >
          <ThemedText
            style={[
              styles.tabText,
              {
                color: activeTab === 'Instagram' ? theme.colors.primary : theme.colors.textSecondary,
              }
            ]}
            font="manrope"
            weight={activeTab === 'Instagram' ? "semibold" : "regular"}
          >
            Instagram
          </ThemedText>
          <Animated.View 
            style={[
              styles.tabUnderline,
              {
                backgroundColor: theme.colors.primary,
                opacity: tabUnderlineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
                transform: [{
                  translateX: tabUnderlineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-SCREEN_WIDTH / 2, 0],
                  }),
                }],
              }
            ]} 
          />
        </TouchableOpacity>
      </Animated.View>

      {/* WebView Container */}
      <View style={[styles.webViewContainer, { backgroundColor: theme.colors.surface }]}>
        {isLoading && !hasError && (
          <View style={[styles.loadingContainer, { backgroundColor: theme.colors.surface }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
        
        {hasError ? (
          <Animated.View 
            style={[
              styles.errorContainer,
              {
                backgroundColor: theme.colors.surface,
                opacity: fadeAnim,
              }
            ]}
          >
            <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
            <ThemedText style={[styles.errorTitle, { color: theme.colors.text }]} font="manrope" weight="bold">
              Unable to Load Content
            </ThemedText>
            <ThemedText style={[styles.errorMessage, { color: theme.colors.textSecondary }]} font="manrope" weight="regular">
              {errorMessage}
            </ThemedText>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleRetry}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.retryButtonText, { color: theme.colors.onPrimary }]} font="manrope" weight="bold">
                Retry
              </ThemedText>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <WebView
            key={`${activeTab}-${refreshKey}`} // Force reload when tab changes or retry is pressed
            source={{ uri: getCurrentUrl() }}
            style={styles.webView}
            onLoadStart={() => {
              setIsLoading(true);
              setHasError(false);
              setErrorMessage('');
            }}
            onLoadEnd={() => setIsLoading(false)}
            onError={handleWebViewError}
            onHttpError={handleWebViewHttpError}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            mixedContentMode="always"
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />
        )}
      </View>

      {/* Login Modal */}
      <Modal
        visible={showLoginModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.surface,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            {/* Close Button */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={handleCloseModal}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.modalLogoContainer}>
              <View style={[styles.modalLogoCircle, { backgroundColor: theme.colors.textInverse }]}>
                <View style={styles.modalLogoInner}>
                  <View style={[styles.modalLogoIcon, { backgroundColor: theme.colors.primary }]}>
                    <ThemedText style={[styles.modalLogoText, { color: theme.colors.onPrimary }]} font="manrope" weight="bold">
                      IF
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.modalPakfitText, { color: theme.colors.onPrimary }]} font="oleo" weight="bold">
                    PAKFIT
                  </ThemedText>
                </View>
                {/* Facebook Icon Overlay */}
                <View style={[styles.facebookIconOverlay, { borderColor: theme.colors.surface }]}>
                  <Ionicons name="logo-facebook" size={20} color={theme.colors.onPrimary} />
                </View>
              </View>
            </View>

            {/* Text Content */}
            <ThemedText style={[styles.modalTitle, { color: theme.colors.text }]} font="manrope" weight="bold">
              See more from PakFit
            </ThemedText>
            <ThemedText style={[styles.modalDescription, { color: theme.colors.textSecondary }]} font="manrope" weight="regular">
              Log in to get all the details and all the updates from Pages you follow.
            </ThemedText>

            {/* Buttons */}
            <TouchableOpacity
              style={[styles.modalLoginButton, { backgroundColor: '#1877F2' }]}
              onPress={handleLoginPress}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.modalLoginButtonText, { color: theme.colors.onPrimary }]} font="manrope" weight="bold">
                Log in
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalCreateAccountButton,
                {
                  backgroundColor: theme.colors.surfaceAlt,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={handleCreateAccountPress}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.modalCreateAccountButtonText, { color: theme.colors.text }]} font="manrope" weight="regular">
                Create new account
              </ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLogoContainer: {
    marginBottom: 24,
    marginTop: 16,
  },
  modalLogoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  modalLogoInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLogoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  modalLogoText: {
    fontSize: 20,
  },
  modalPakfitText: {
    fontSize: 14,
    letterSpacing: 1,
  },
  facebookIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalLoginButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalLoginButtonText: {
    fontSize: 16,
  },
  modalCreateAccountButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
  },
  modalCreateAccountButtonText: {
    fontSize: 16,
  },
});

export default CommunityScreen;
