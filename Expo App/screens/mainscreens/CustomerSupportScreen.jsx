import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';

// Dummy WhatsApp number - will be replaced with backend data later
const WHATSAPP_NUMBER = '03162989178';

const CustomerSupportScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleStartChat = async () => {
    try {
      // Format phone number (remove any non-numeric characters)
      const phoneNumber = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
      
      // Try to open WhatsApp directly
      const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
      const supported = await Linking.canOpenURL(whatsappUrl);
      
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Fallback to web WhatsApp if app is not installed
        const webWhatsappUrl = `https://wa.me/${phoneNumber}`;
        await Linking.openURL(webWhatsappUrl);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open WhatsApp. Please make sure WhatsApp is installed.');
      console.error('Error opening WhatsApp:', error);
    }
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
          <View style={styles.backButtonContainer}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.headerTitle} font="manrope" weight="bold">
            Customer Support
          </ThemedText>
        </View>
        <View style={styles.rightSpacer} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Start Chat Button */}
        <TouchableOpacity
          style={styles.startChatButton}
          onPress={handleStartChat}
          activeOpacity={0.8}
        >
          {/* Headset Icon */}
          <Ionicons name="headset" size={28} color="#2A2A2A" />
          
          {/* Start Chat Text */}
          <ThemedText style={styles.startChatText} font="manrope" weight="bold">
            START CHAT
          </ThemedText>
        </TouchableOpacity>
      </View>
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
  },
  backButton: {
    width: 48,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
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
    width: 48,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  startChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
    width: '100%',
    gap: 16,
  },
  startChatText: {
    fontSize: 16,
    color: '#2A2A2A',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default CustomerSupportScreen;
