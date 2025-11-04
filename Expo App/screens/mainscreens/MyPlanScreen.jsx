import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';

// JSON data for plan options - will be replaced with API data later
const PLAN_OPTIONS = [
  { id: 1, title: 'Protocols' },
  { id: 2, title: 'Breakfast' },
  { id: 3, title: 'Snack 1' },
  { id: 4, title: 'Lunch' },
  { id: 5, title: 'Snack 2' },
  { id: 6, title: 'Dinner' },
  { id: 7, title: 'Snack (Before Bed)' },
  { id: 8, title: 'Exercise Instructions' },
  { id: 9, title: 'Frequently Asked Questions' },
  { id: 10, title: 'Important Instructions' },
];

const MyPlanScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleOptionPress = (option) => {
    // Navigate to PlanDetailScreen with the option title
    // For now, all options will use the same data structure
    // Later, when API is connected, different data can be passed based on planType
    navigation.navigate('PlanDetail', {
      title: option.title,
      planType: option.title.toLowerCase().replace(/\s+/g, '_'), // Convert to snake_case for API
      items: null, // Will be fetched from API based on planType
    });
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
            MY PLAN
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
        {/* Plan Options Card */}
        <View style={styles.optionsCard}>
          {PLAN_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                index === PLAN_OPTIONS.length - 1 && styles.lastOptionButton,
              ]}
              onPress={() => handleOptionPress(option)}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.optionText} font="manrope" weight="regular">
                {option.title}
              </ThemedText>
              <Ionicons name="chevron-forward" size={20} color="#E53E3E" />
            </TouchableOpacity>
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
  optionsCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  lastOptionButton: {
    marginBottom: 0,
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
});

export default MyPlanScreen;
