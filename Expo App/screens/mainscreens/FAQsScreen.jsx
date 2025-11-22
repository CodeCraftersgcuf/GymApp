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
import { useFAQs } from '../../api/hooks';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme, mode } = useTheme();
  
  // Fetch FAQs from API
  const { data: faqsData, isLoading: isLoadingFAQs } = useFAQs({ per_page: 100 });
  const faqs = faqsData?.data || [];
  const [expandedItems, setExpandedItems] = useState(new Set());
  
  // Animation for FAQ cards - initialize with max expected items
  const cardAnimations = useRef(
    Array(100).fill(null).map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;
  
  useEffect(() => {
    // Staggered animation for FAQ cards when FAQs are loaded
    if (faqs.length > 0) {
      Animated.stagger(50,
        cardAnimations.slice(0, faqs.length).map(anim =>
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
    }
  }, [faqs.length]);

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
        {isLoadingFAQs ? (
          <View style={styles.loadingContainer}>
            <ThemedText style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading FAQs...
            </ThemedText>
          </View>
        ) : faqs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="help-circle-outline" size={64} color={theme.colors.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: theme.colors.textSecondary }]} font="manrope" weight="medium">
              No FAQs available
            </ThemedText>
          </View>
        ) : (
          faqs.map((faq, index) => {
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
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
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
