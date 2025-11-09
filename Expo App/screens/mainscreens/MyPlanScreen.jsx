import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeProvider';
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
  const { theme, mode } = useTheme();
  
  // Animation for option buttons
  const optionAnimations = useRef(
    PLAN_OPTIONS.map(() => ({
      translateY: new Animated.Value(30),
      opacity: new Animated.Value(0),
      pressAnim: new Animated.Value(1),
    }))
  ).current;
  
  useEffect(() => {
    // Staggered animation for options
    Animated.stagger(50,
      optionAnimations.map(anim =>
        Animated.parallel([
          Animated.spring(anim.translateY, {
            toValue: 0,
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

  const handleOptionPress = (option, index) => {
    // Press animation
    const anim = optionAnimations[index];
    Animated.sequence([
      Animated.timing(anim.pressAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim.pressAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate to PlanDetailScreen
    navigation.navigate('PlanDetail', {
      title: option.title,
      planType: option.title.toLowerCase().replace(/\s+/g, '_'),
      items: null,
    });
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
        <Animated.View 
          style={[
            styles.optionsCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
        >
          {PLAN_OPTIONS.map((option, index) => {
            const anim = optionAnimations[index];
            return (
              <Animated.View
                key={option.id}
                style={[
                  {
                    opacity: anim.opacity,
                    transform: [
                      { translateY: anim.translateY },
                      { scale: anim.pressAnim },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: theme.colors.surfaceAlt,
                      borderColor: theme.colors.border,
                    },
                    index === PLAN_OPTIONS.length - 1 && styles.lastOptionButton,
                  ]}
                  onPress={() => handleOptionPress(option, index)}
                  activeOpacity={1}
                >
                  <ThemedText style={[styles.optionText, { color: theme.colors.text }]} font="manrope" weight="regular">
                    {option.title}
                  </ThemedText>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  lastOptionButton: {
    marginBottom: 0,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});

export default MyPlanScreen;
