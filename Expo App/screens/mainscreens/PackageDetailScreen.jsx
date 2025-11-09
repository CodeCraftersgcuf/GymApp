import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import { useTheme } from '../../components/ThemeProvider';

// Dummy JSON data for package details - will be replaced with API data later
const PACKAGE_DETAILS = {
  title: '3 Months Consultation',
  price: 'PKR 15000',
  features: [
    'Customized Nutrition Plan',
    'No Medicines & Supplements',
    'Homebased Cost Effective Diet',
    'Customized Workout Strategy',
    'Performance based changes',
    'Home Workout Videos',
    'Gym Workout Videos',
    'Body Weight Workout Videos',
    'Motivational Videos',
    'Food Recipe Videos',
    'Mind Sciences Training',
    'Stress Management Training',
    '1 on 1 Chat with Omar Bilal',
  ],
};

const PackageDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { theme, mode } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Get package data from route params or use default
  const packageData = route.params?.packageData || PACKAGE_DETAILS;
  const { title, price, features } = packageData;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      
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
            Packages
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
        {/* Package Card */}
        <Animated.View
          style={[
            styles.packageCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Package Title */}
          <ThemedText style={[styles.packageTitle, { color: theme.colors.text }]} font="manrope" weight="bold">
            {title}
          </ThemedText>

          {/* Price */}
          <ThemedText style={[styles.packagePrice, { color: theme.colors.primary }]} font="manrope" weight="bold">
            {price}
          </ThemedText>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.featureItem,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }],
                  },
                ]}
              >
                <Ionicons name="checkmark" size={20} color={theme.colors.primary} style={styles.checkmark} />
                <ThemedText style={[styles.featureText, { color: theme.colors.text }]} font="manrope" weight="regular">
                  {feature}
                </ThemedText>
              </Animated.View>
            ))}
          </View>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120, // Space for bottom navigation
  },
  packageCard: {
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
  },
  packageTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  packagePrice: {
    fontSize: 32,
    marginBottom: 24,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkmark: {
    marginRight: 12,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PackageDetailScreen;
