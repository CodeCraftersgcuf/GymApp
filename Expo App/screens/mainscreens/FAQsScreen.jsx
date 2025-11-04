import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';

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
  const [expandedItems, setExpandedItems] = useState(new Set([1])); // First item expanded by default

  const toggleItem = (id) => {
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
          return (
            <View key={faq.id} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleItem(faq.id)}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.faqQuestion} font="manrope" weight="regular">
                  {index + 1}. {faq.question}
                </ThemedText>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#E53E3E"
                />
              </TouchableOpacity>
              
              {isExpanded && (
                <View style={styles.faqAnswerContainer}>
                  <ThemedText style={styles.faqAnswer} font="manrope" weight="regular">
                    {faq.answer}
                  </ThemedText>
                </View>
              )}
            </View>
          );
        })}
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
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
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
    color: '#FFFFFF',
    marginRight: 12,
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
});

export default FAQsScreen;
