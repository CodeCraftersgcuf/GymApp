import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';

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

  // Get package data from route params or use default
  const packageData = route.params?.packageData || PACKAGE_DETAILS;
  const { title, price, features } = packageData;

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
        <View style={styles.packageCard}>
          {/* Package Title */}
          <ThemedText style={styles.packageTitle} font="manrope" weight="bold">
            {title}
          </ThemedText>

          {/* Price */}
          <ThemedText style={styles.packagePrice} font="manrope" weight="bold">
            {price}
          </ThemedText>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark" size={20} color="#E53E3E" style={styles.checkmark} />
                <ThemedText style={styles.featureText} font="manrope" weight="regular">
                  {feature}
                </ThemedText>
              </View>
            ))}
          </View>
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
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#444',
  },
  packageTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  packagePrice: {
    fontSize: 32,
    color: '#E53E3E',
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
    color: '#FFFFFF',
    lineHeight: 20,
  },
});

export default PackageDetailScreen;
