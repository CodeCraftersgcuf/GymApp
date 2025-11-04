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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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
        {NOTIFICATIONS_DATA.map((notification) => (
          <View key={notification.id} style={styles.notificationCard}>
            <View style={styles.notificationHeader}>
              <ThemedText style={styles.notificationTitle} font="manrope" weight="bold">
                {notification.title}
              </ThemedText>
              <ThemedText style={styles.notificationTimestamp} font="manrope" weight="regular">
                ({notification.timestamp})
              </ThemedText>
            </View>
            <ThemedText style={styles.notificationMessage} font="manrope" weight="regular">
              {notification.message}
            </ThemedText>
          </View>
        ))}
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
  notificationCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#555', // Light gray border
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
    color: '#FFFFFF',
    marginRight: 8,
    fontWeight: 'bold',
  },
  notificationTimestamp: {
    fontSize: 14,
    color: '#999', // Lighter gray for timestamp
  },
  notificationMessage: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
});

export default NotificationsScreen;
