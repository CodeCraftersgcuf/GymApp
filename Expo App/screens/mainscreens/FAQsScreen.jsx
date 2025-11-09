import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeProvider';
import ThemedText from '../../components/ThemedText';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Dummy JSON data for FAQs - will be replaced with API data later
const FAQS_DATA = [
  {
    id: 1,
    question: "What is PakFit?",
    answer: "PakFit is Pakistan's 1st Fitness App and a Digital Fitness Platform dedicated towards helping people achieve their Fitness Goals.",
  },
  {
    id: 2,
    question: "Who is Omar Bilal Ahmad ?",
    answer: "Omar Bilal Ahmad is Pakistan's 1st Fitness Consultant and the founder of PakFit. He has extensive experience in fitness consultation and training.",
  },
  {
    id: 3,
    question: "What is the Qualification of Omar Bilal Ahmad ?",
    answer: "Omar Bilal Ahmad holds professional certifications in fitness training and nutrition. He is recognized as Pakistan's 1st Fitness Consultant with years of expertise.",
  },
  {
    id: 4,
    question: "How is Omar Bilal Ahmad, The 1st Fitness Consultant of Pakistan?",
    answer: "Omar Bilal Ahmad has been pioneering fitness consultation in Pakistan, establishing himself as the first certified fitness consultant in the country with a proven track record.",
  },
  {
    id: 5,
    question: "How many Clients have Omar Bilal Ahmad Consulted?",
    answer: "Omar Bilal Ahmad has consulted thousands of clients across Pakistan, helping them achieve their fitness goals through personalized consultation and training programs.",
  },
  {
    id: 6,
    question: "How can we trust, Omar Bilal Ahmad?",
    answer: "Omar Bilal Ahmad has established trust through years of successful client transformations, professional certifications, and a transparent approach to fitness consultation. His reputation speaks for itself.",
  },
  {
    id: 7,
    question: "How can we trust the Reviews published on the PakFit App?",
    answer: "All reviews published on the PakFit App are verified and authentic. They come from real clients who have completed consultation programs and achieved their fitness goals.",
  },
  {
    id: 8,
    question: "What is the guarantee that I will achieve my Fitness Goals?",
    answer: "While individual results may vary, PakFit provides comprehensive consultation programs, personalized plans, and ongoing support to maximize your chances of achieving your fitness goals. Success depends on following the program consistently.",
  },
  {
    id: 9,
    question: "What is the Consultation Procedure?",
    answer: "The consultation procedure involves an initial assessment of your fitness goals, body metrics, and lifestyle. Based on this, a personalized fitness and nutrition plan is created. Regular follow-ups ensure progress tracking and plan adjustments as needed.",
  },
  {
    id: 10,
    question: "Who can join the Consultation Program?",
    answer: "Anyone who is committed to improving their fitness and health can join the Consultation Program. Whether you're a beginner or experienced, the program is tailored to meet your individual needs and goals.",
  },
];

const FAQsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme, mode } = useTheme();
  const [expandedItems, setExpandedItems] = useState(new Set([1])); // First item expanded by default
  
  // Animation for FAQ cards
  const cardAnimations = useRef(
    FAQS_DATA.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;
  
  useEffect(() => {
    // Staggered animation for FAQ cards
    Animated.stagger(50,
      cardAnimations.map(anim =>
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(anim.translateY, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ])
      )
    ).start();
  }, []);

  const toggleItem = (id) => {
    // Smooth layout animation
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
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
            FAQs
          </ThemedText>
        </View>
        <View style={styles.rightSpacer} />
      </View>

      {/* Main Content - FAQ List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {FAQS_DATA.map((faq, index) => {
          const isExpanded = expandedItems.has(faq.id);
          const anim = cardAnimations[index];
          return (
            <Animated.View
              key={faq.id}
              style={[
                styles.faqCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  opacity: anim.opacity,
                  transform: [{ translateY: anim.translateY }],
                }
              ]}
            >
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleItem(faq.id)}
                activeOpacity={0.7}
              >
                <ThemedText style={[styles.faqQuestion, { color: theme.colors.text }]} font="manrope" weight="regular">
                  {index + 1}. {faq.question}
                </ThemedText>
                <Animated.View
                  style={{
                    transform: [{
                      rotate: isExpanded ? '180deg' : '0deg',
                    }],
                  }}
                >
                  <Ionicons
                    name="chevron-down"
                    size={24}
                    color={theme.colors.primary}
                  />
                </Animated.View>
              </TouchableOpacity>
              
              {isExpanded && (
                <View style={[styles.faqAnswerContainer, { borderTopColor: theme.colors.border }]}>
                  <ThemedText style={[styles.faqAnswer, { color: theme.colors.text }]} font="manrope" weight="regular">
                    {faq.answer}
                  </ThemedText>
                </View>
              )}
            </Animated.View>
          );
        })}
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
    textTransform: 'uppercase',
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
  faqCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    marginRight: 12,
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default FAQsScreen;
