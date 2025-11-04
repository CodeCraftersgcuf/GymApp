import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemedText from '../../components/ThemedText';

// Dummy URLs - will be replaced with backend links later
// Using desktop URLs to potentially avoid QUIC protocol issues
const FACEBOOK_PAGE_URL = 'https://www.facebook.com/Pakfit.Ltb';
const INSTAGRAM_PAGE_URL = 'https://www.instagram.com/pakfit.pk';

const MODAL_STORAGE_KEY = '@pakfit_community_modal_dismissed';

const CommunityScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Facebook');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

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
            Community
          </ThemedText>
        </View>
        <View style={styles.rightSpacer} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Facebook' && styles.tabActive]}
          onPress={() => setActiveTab('Facebook')}
          activeOpacity={0.7}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === 'Facebook' && styles.tabTextActive,
            ]}
            font="manrope"
            weight="regular"
          >
            Facebook
          </ThemedText>
          {activeTab === 'Facebook' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'Instagram' && styles.tabActive]}
          onPress={() => setActiveTab('Instagram')}
          activeOpacity={0.7}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === 'Instagram' && styles.tabTextActive,
            ]}
            font="manrope"
            weight="regular"
          >
            Instagram
          </ThemedText>
          {activeTab === 'Instagram' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {/* WebView Container */}
      <View style={styles.webViewContainer}>
        {isLoading && !hasError && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E53E3E" />
          </View>
        )}
        
        {hasError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color="#E53E3E" />
            <ThemedText style={styles.errorTitle} font="manrope" weight="bold">
              Unable to Load Content
            </ThemedText>
            <ThemedText style={styles.errorMessage} font="manrope" weight="regular">
              {errorMessage}
            </ThemedText>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.retryButtonText} font="manrope" weight="bold">
                Retry
              </ThemedText>
            </TouchableOpacity>
          </View>
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
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={handleCloseModal}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.modalLogoContainer}>
              <View style={styles.modalLogoCircle}>
                <View style={styles.modalLogoInner}>
                  <View style={styles.modalLogoIcon}>
                    <ThemedText style={styles.modalLogoText} font="manrope" weight="bold">
                      IF
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.modalPakfitText} font="oleo" weight="bold">
                    PAKFIT
                  </ThemedText>
                </View>
                {/* Facebook Icon Overlay */}
                <View style={styles.facebookIconOverlay}>
                  <Ionicons name="logo-facebook" size={20} color="#FFFFFF" />
                </View>
              </View>
            </View>

            {/* Text Content */}
            <ThemedText style={styles.modalTitle} font="manrope" weight="bold">
              See more from PakFit
            </ThemedText>
            <ThemedText style={styles.modalDescription} font="manrope" weight="regular">
              Log in to get all the details and all the updates from Pages you follow.
            </ThemedText>

            {/* Buttons */}
            <TouchableOpacity
              style={styles.modalLoginButton}
              onPress={handleLoginPress}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.modalLoginButtonText} font="manrope" weight="bold">
                Log in
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCreateAccountButton}
              onPress={handleCreateAccountPress}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.modalCreateAccountButtonText} font="manrope" weight="regular">
                Create new account
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabActive: {
    // Active tab styling handled by text color and underline
  },
  tabText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  tabTextActive: {
    color: '#E53E3E',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#E53E3E',
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#E53E3E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#000000',
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
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  modalLogoText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  modalPakfitText: {
    fontSize: 14,
    color: '#FFFFFF',
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
    borderColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalLoginButton: {
    backgroundColor: '#1877F2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalLoginButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalCreateAccountButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  modalCreateAccountButtonText: {
    fontSize: 16,
    color: '#000000',
  },
});

export default CommunityScreen;
