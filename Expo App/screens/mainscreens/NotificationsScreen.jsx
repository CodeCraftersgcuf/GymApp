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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeProvider';
import ThemedText from '../../components/ThemedText';

// Dummy JSON data for notifications - will be replaced with API data later
const NOTIFICATIONS_DATA = [
  {
    id: 1,
    title: 'Plan Assigned',
    timestamp: '3 months ago',
    message: 'You have been assigned a plan please check it in your app.',
  },
  {
    id: 2,
    title: 'Plan Assigned',
    timestamp: '3 months ago',
    message: 'You have been assigned a plan please check it in your app.',
  },
];

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme, mode } = useTheme();
  
  // Animation for notification cards
  const cardAnimations = useRef(
    NOTIFICATIONS_DATA.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;
  
  useEffect(() => {
    Animated.stagger(100,
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
            Notifications
          </ThemedText>
        </View>
        <View style={styles.rightSpacer} />
      </View>

      {/* Main Content - Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {NOTIFICATIONS_DATA.map((notification, index) => {
          const anim = cardAnimations[index];
          return (
            <Animated.View
              key={notification.id}
              style={[
                styles.notificationCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  opacity: anim.opacity,
                  transform: [{ translateY: anim.translateY }],
                }
              ]}
            >
              <View style={styles.notificationHeader}>
                <ThemedText style={[styles.notificationTitle, { color: theme.colors.text }]} font="manrope" weight="bold">
                  {notification.title}
                </ThemedText>
                <ThemedText style={[styles.notificationTimestamp, { color: theme.colors.textSecondary }]} font="manrope" weight="regular">
                  ({notification.timestamp})
                </ThemedText>
              </View>
              <ThemedText style={[styles.notificationMessage, { color: theme.colors.text }]} font="manrope" weight="regular">
                {notification.message}
              </ThemedText>
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
  notificationCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  notificationTitle: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  notificationTimestamp: {
    fontSize: 14,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default NotificationsScreen;
