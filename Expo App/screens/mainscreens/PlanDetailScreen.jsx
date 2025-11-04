import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';

// JSON data for protocols - will be replaced with API data later
// Each item can have a YouTube video URL
const PROTOCOLS_DATA = [
  {
    id: 1,
    text: 'Important Rules and Instructions to be followed.',
    videoUrl: null, // YouTube URL will be added here
  },
  {
    id: 2,
    text: 'Avoid food made of White Flour (Maida), for e.g Bakery items, Pizza, Pasta, Bun, White Bread, White Naan (Roti), Biscuits, etc.',
    videoUrl: null,
  },
  {
    id: 3,
    text: 'Avoid food containing sugar, such as Canned Juices, Cold drinks, Cakes, Chocolates etc.',
    videoUrl: null,
  },
  {
    id: 4,
    text: 'Drink enough water, so your Urine is clear—approximately 8 to 12 glasses.',
    videoUrl: null,
  },
  {
    id: 5,
    text: 'Oil intake should not exceed (3-5 tablespoon) per day (Olive oil and Desi ghee) is recommended.',
    videoUrl: null,
  },
  {
    id: 6,
    text: 'This plan is approx (1500 to 1800) Calories, designed especially according to your ideal body weight.',
    videoUrl: null,
  },
  {
    id: 7,
    text: 'Breakfast, Lunch and Dinner.',
    videoUrl: null,
  },
];

const PlanDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  // Get the plan type and title from route params
  // Handle null explicitly since default parameter only works for undefined
  const { planType, title = 'Protocols', items: routeItems } = route.params || {};
  const items = routeItems ?? PROTOCOLS_DATA;

  const handlePlayPress = async (item) => {
    if (item.videoUrl) {
      // If there's a YouTube URL, open it
      try {
        const supported = await Linking.canOpenURL(item.videoUrl);
        if (supported) {
          await Linking.openURL(item.videoUrl);
        } else {
          Alert.alert('Error', 'Unable to open video URL');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to open video');
      }
    } else {
      // TODO: Handle video playback when API provides YouTube URLs
      Alert.alert('Video', `Play video for: ${item.text.substring(0, 50)}...`);
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
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.headerTitle} font="manrope" weight="bold">
            {title.toUpperCase()}
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
        {/* Protocol Items List */}
        <View style={styles.listContainer}>
          {items.map((item, index) => (
            <View key={item.id || index} style={styles.protocolCard}>
              {/* Left Side - Red Bullet Point and Text */}
              <View style={styles.leftContent}>
                <View style={styles.bulletPoint} />
                <ThemedText style={styles.protocolText} font="manrope" weight="regular">
                  {item.text}
                </ThemedText>
              </View>

              {/* Right Side - Play Button */}
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => handlePlayPress(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="play" size={18} color="#FFFFFF" />
              </TouchableOpacity>
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
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  listContainer: {
    gap: 12,
  },
  protocolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53E3E',
    marginTop: 6,
    marginRight: 12,
  },
  protocolText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2, // Offset play icon slightly right for better visual alignment
  },
});

export default PlanDetailScreen;
