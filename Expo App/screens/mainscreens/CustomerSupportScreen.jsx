import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import { useTheme } from '../../components/ThemeProvider';

// Dummy WhatsApp number - will be replaced with backend data later
const WHATSAPP_NUMBER = '03162989178';

const CustomerSupportScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme, mode } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            borderBottomColor: theme.colors.border,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <View style={[styles.backButtonContainer, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </View>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <ThemedText style={[styles.headerTitle, { color: theme.colors.text }]} font="manrope" weight="bold">
            Customer Support
          </ThemedText>
        </View>
        <View style={styles.rightSpacer} />
      </Animated.View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Start Chat Button */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <TouchableOpacity
            style={[
              styles.startChatButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: 1,
              },
            ]}
            onPress={handleStartChat}
            activeOpacity={0.8}
          >
            {/* Headset Icon */}
            <Ionicons name="headset" size={28} color={theme.colors.primary} />
            
            {/* Start Chat Text */}
            <ThemedText
              style={[
                styles.startChatText,
                { color: theme.colors.text },
              ]}
              font="manrope"
              weight="bold"
            >
              START CHAT
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </View>
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
    width: 48,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
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
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
    width: '100%',
    gap: 16,
  },
  startChatText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default CustomerSupportScreen;
