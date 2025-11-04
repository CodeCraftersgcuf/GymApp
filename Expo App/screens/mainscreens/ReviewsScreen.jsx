import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
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

// Dummy JSON data for client transformations - will be replaced with API data later
const CLIENT_TRANSFORMATIONS = [
  {
    id: 1,
    megaText: 'MEGA',
    fatLossText: 'FATLOSS',
    weightBefore: '96 KG',
    weightAfter: '78 KG',
    duration: '06 Months',
    noGym: true,
    videoUrl: 'https://www.youtube.com/watch?v=j7rKKpwdXNE',
    beforeImageUrl: null, // Will be replaced with actual image URL
    afterImageUrl: null, // Will be replaced with actual image URL
  },
  {
    id: 2,
    megaText: 'MEGA',
    fatLossText: 'FATLOSS',
    weightBefore: '105 KG',
    weightAfter: '85 KG',
    duration: '08 Months',
    noGym: true,
    videoUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
    beforeImageUrl: null,
    afterImageUrl: null,
  },
  {
    id: 3,
    megaText: 'MEGA',
    fatLossText: 'TRANSFORMATION',
    weightBefore: '88 KG',
    weightAfter: '72 KG',
    duration: '05 Months',
    noGym: true,
    videoUrl: 'https://www.youtube.com/watch?v=UItWltVZZmE',
    beforeImageUrl: null,
    afterImageUrl: null,
  },
  {
    id: 4,
    megaText: 'MEGA',
    fatLossText: 'FATLOSS',
    weightBefore: '92 KG',
    weightAfter: '75 KG',
    duration: '07 Months',
    noGym: true,
    videoUrl: 'https://www.youtube.com/watch?v=8KpYp3RqDGI',
    beforeImageUrl: null,
    afterImageUrl: null,
  },
  {
    id: 5,
    megaText: 'MEGA',
    fatLossText: 'TRANSFORMATION',
    weightBefore: '100 KG',
    weightAfter: '80 KG',
    duration: '06 Months',
    noGym: true,
    videoUrl: 'https://www.youtube.com/watch?v=ynP2nmO5fH8',
    beforeImageUrl: null,
    afterImageUrl: null,
  },
];

const WHATSAPP_NUMBER = '03162989178';

const ReviewsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const isScrollingRef = useRef(false);

  // Create infinite carousel data: [lastItem, ...items, firstItem]
  const extendedData = [
    CLIENT_TRANSFORMATIONS[CLIENT_TRANSFORMATIONS.length - 1], // Last item at the beginning
    ...CLIENT_TRANSFORMATIONS,
    CLIENT_TRANSFORMATIONS[0], // First item at the end
  ];

  const slideSize = SCREEN_WIDTH - 48;
  const realDataLength = CLIENT_TRANSFORMATIONS.length;

  // Set initial scroll position to show the first real item (index 1 in extended array)
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: slideSize,
          animated: false,
        });
      }, 100);
    }
  }, []);

  const handleCarouselScroll = (event) => {
    if (isScrollingRef.current) return;
    
    const offset = event.nativeEvent.contentOffset.x;
    let index = Math.round(offset / slideSize);
    
    // Calculate real index (accounting for the duplicate at the start)
    let realIndex = index - 1;
    
    // Handle infinite loop
    if (index === 0) {
      // Scrolled to duplicate last item, jump to real last item
      isScrollingRef.current = true;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: slideSize * realDataLength,
          animated: false,
        });
        setActiveCarouselIndex(realDataLength - 1);
        isScrollingRef.current = false;
      }, 50);
      return;
    } else if (index === extendedData.length - 1) {
      // Scrolled to duplicate first item, jump to real first item
      isScrollingRef.current = true;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: slideSize,
          animated: false,
        });
        setActiveCarouselIndex(0);
        isScrollingRef.current = false;
      }, 50);
      return;
    }
    
    // Update active index for real items (0 to realDataLength - 1)
    if (realIndex >= 0 && realIndex < realDataLength) {
      setActiveCarouselIndex(realIndex);
    }
  };

  const handleWhatsAppPress = () => {
    const url = `whatsapp://send?phone=${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`);
    });
  };

  const handleSocialMediaPress = (platform) => {
    // TODO: Handle social media navigation
    console.log(`Opening ${platform}`);
  };

  const handleWatchTestimonials = () => {
    // TODO: Navigate to testimonials video screen or open video
    const currentTransformation = CLIENT_TRANSFORMATIONS[activeCarouselIndex];
    if (currentTransformation?.videoUrl) {
      Linking.openURL(currentTransformation.videoUrl);
    }
  };

  const getThumbnailUrl = (transformation) => {
    if (transformation.videoUrl) {
      return getYouTubeThumbnail(transformation.videoUrl);
    }
    return null;
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
            Client Reviews
          </ThemedText>
        </View>
        <View style={styles.rightSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Transformation Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleCarouselScroll}
            onScrollBeginDrag={() => {
              isScrollingRef.current = false;
            }}
            style={styles.carousel}
            contentContainerStyle={styles.carouselContent}
          >
            {extendedData.map((transformation, index) => {
              const thumbnailUrl = getThumbnailUrl(transformation);
              return (
                <View key={`carousel-${transformation.id}-${index}`} style={styles.carouselItem}>
                  <View style={styles.transformationCard}>
                    {/* Video Thumbnail Background */}
                    {thumbnailUrl && (
                      <Image
                        source={{ uri: thumbnailUrl }}
                        style={styles.thumbnailBackground}
                        resizeMode="cover"
                      />
                    )}
                    
                    {/* Overlay Content */}
                    <View style={styles.overlayContent}>
                      {/* Top Left - PAKFIT Logo */}
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

                      {/* Left Side - Text Details */}
                      <View style={styles.textDetailsContainer}>
                        <ThemedText style={styles.megaText} font="manrope" weight="bold">
                          {transformation.megaText}
                        </ThemedText>
                        <ThemedText style={styles.fatLossText} font="manrope" weight="bold">
                          {transformation.fatLossText}
                        </ThemedText>
                        
                        <View style={styles.detailsRow}>
                          <Ionicons name="scale-outline" size={16} color="#FFFFFF" />
                          <ThemedText style={styles.detailText} font="manrope" weight="regular">
                            {transformation.weightBefore} to {transformation.weightAfter}
                          </ThemedText>
                        </View>
                        
                        <View style={styles.detailsRow}>
                          <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                          <ThemedText style={styles.detailText} font="manrope" weight="regular">
                            {transformation.duration}
                          </ThemedText>
                        </View>
                        
                        <View style={styles.detailsRow}>
                          <Ionicons name="ban-outline" size={16} color="#FFFFFF" />
                          <ThemedText style={styles.detailText} font="manrope" weight="regular">
                            NO GYM
                          </ThemedText>
                        </View>
                      </View>

                      {/* Right Side - Before & After Images */}
                      <View style={styles.imagesContainer}>
                        <View style={styles.beforeAfterContainer}>
                          <View style={styles.imagePlaceholder}>
                            <ThemedText style={styles.imageLabel} font="manrope" weight="regular">
                              Before
                            </ThemedText>
                            <Ionicons name="person" size={40} color="#999" />
                          </View>
                          <View style={styles.imagePlaceholder}>
                            <ThemedText style={styles.imageLabel} font="manrope" weight="regular">
                              After
                            </ThemedText>
                            <Ionicons name="person" size={40} color="#999" />
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Bottom Section - Footer */}
                    <View style={styles.footerSection}>
                      <View style={styles.footerLine} />
                      <ThemedText style={styles.footerText} font="manrope" weight="regular">
                        Pakistan's 1st Fitness App
                      </ThemedText>
                      
                      <View style={styles.socialContainer}>
                        <TouchableOpacity
                          style={styles.socialItem}
                          onPress={() => handleSocialMediaPress('phone')}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="call-outline" size={14} color="#FFFFFF" />
                          <ThemedText style={styles.socialText} font="manrope" weight="regular">
                            PAKFIT.pk
                          </ThemedText>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={styles.socialItem}
                          onPress={() => handleSocialMediaPress('instagram')}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="logo-instagram" size={14} color="#FFFFFF" />
                          <ThemedText style={styles.socialText} font="manrope" weight="regular">
                            Pakfit.pk
                          </ThemedText>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={styles.socialItem}
                          onPress={() => handleSocialMediaPress('facebook')}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="logo-facebook" size={14} color="#FFFFFF" />
                          <ThemedText style={styles.socialText} font="manrope" weight="regular">
                            Pakfit.Ltb
                          </ThemedText>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={styles.socialItem}
                          onPress={() => handleSocialMediaPress('youtube')}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="logo-youtube" size={14} color="#FFFFFF" />
                          <ThemedText style={styles.socialText} font="manrope" weight="regular">
                            Pakfit.Ltb
                          </ThemedText>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={styles.socialItem}
                          onPress={handleWhatsAppPress}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="logo-whatsapp" size={14} color="#FFFFFF" />
                          <ThemedText style={styles.socialText} font="manrope" weight="regular">
                            {WHATSAPP_NUMBER}
                          </ThemedText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Carousel Pagination Dots */}
          <View style={styles.paginationContainer}>
            {CLIENT_TRANSFORMATIONS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeCarouselIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Call to Action Text */}
        <View style={styles.callToActionContainer}>
          <ThemedText style={styles.callToActionText} font="manrope" weight="regular">
            To watch our successful clients results,
          </ThemedText>
          <ThemedText style={styles.callToActionRed} font="manrope" weight="regular">
            click below
          </ThemedText>
        </View>

        {/* Watch Testimonials Button */}
        <TouchableOpacity
          style={styles.watchButton}
          onPress={handleWatchTestimonials}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.watchButtonText} font="manrope" weight="bold">
            Watch Testimonials
          </ThemedText>
        </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120, // Space for bottom navigation
  },
  carouselContainer: {
    marginBottom: 24,
  },
  carousel: {
    height: 400,
  },
  carouselContent: {
    paddingRight: 24,
  },
  carouselItem: {
    width: SCREEN_WIDTH - 48,
    marginLeft: 24,
  },
  transformationCard: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  overlayContent: {
    flex: 1,
    padding: 16,
    position: 'relative',
    zIndex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  pakfitText: {
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  textDetailsContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  megaText: {
    fontSize: 32,
    color: '#E53E3E',
    marginBottom: 4,
  },
  fatLossText: {
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  imagesContainer: {
    position: 'absolute',
    right: 16,
    top: 60,
  },
  beforeAfterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  imagePlaceholder: {
    width: 70,
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  imageLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  footerSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E53E3E',
  },
  footerLine: {
    height: 1,
    backgroundColor: '#E53E3E',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  socialText: {
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555',
  },
  paginationDotActive: {
    backgroundColor: '#E53E3E',
    width: 24,
  },
  callToActionContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  callToActionText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  callToActionRed: {
    fontSize: 14,
    color: '#E53E3E',
    textAlign: 'center',
  },
  watchButton: {
    backgroundColor: '#E53E3E',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  watchButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ReviewsScreen;
