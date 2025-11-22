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
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '../../api/hooks';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme, mode } = useTheme();
  
  // Fetch notifications from API
  const { data: notificationsData, isLoading: isLoadingNotifications } = useNotifications({ per_page: 50 });
  const notifications = notificationsData?.data || [];
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  
  // Animation for notification cards - initialize with max expected items
  const cardAnimations = useRef(
    Array(50).fill(null).map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;
  
  // Update animations when notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      Animated.stagger(100,
        cardAnimations.slice(0, notifications.length).map(anim =>
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
  }, [notifications.length]);

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
        {isLoadingNotifications ? (
          <View style={styles.loadingContainer}>
            <ThemedText style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading notifications...
            </ThemedText>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color={theme.colors.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: theme.colors.textSecondary }]} font="manrope" weight="medium">
              No notifications yet
            </ThemedText>
          </View>
        ) : (
          notifications.map((notification, index) => {
            const anim = cardAnimations[index] || { opacity: new Animated.Value(1), translateY: new Animated.Value(0) };
            const formatDate = (dateString) => {
              if (!dateString) return 'Recently';
              const date = new Date(dateString);
              const now = new Date();
              const diffMs = now - date;
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMs / 3600000);
              const diffDays = Math.floor(diffMs / 86400000);
              
              if (diffMins < 1) return 'Just now';
              if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
              if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
              if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
              return date.toLocaleDateString();
            };
            
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
                <TouchableOpacity
                  onPress={() => {
                    if (!notification.read_at) {
                      markAsReadMutation.mutate(notification.id);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.notificationHeader}>
                    <ThemedText style={[styles.notificationTitle, { color: theme.colors.text }]} font="manrope" weight="bold">
                      {notification.title || 'Notification'}
                    </ThemedText>
                    <ThemedText style={[styles.notificationTimestamp, { color: theme.colors.textSecondary }]} font="manrope" weight="regular">
                      {formatDate(notification.created_at)}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.notificationMessage, { color: theme.colors.text }]} font="manrope" weight="regular">
                    {notification.message || notification.body || 'No message'}
                  </ThemedText>
                  {!notification.read_at && (
                    <View style={[styles.unreadIndicator, { backgroundColor: theme.colors.primary }]} />
                  )}
                </TouchableOpacity>
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
  unreadIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
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
