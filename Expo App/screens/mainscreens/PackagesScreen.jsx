import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeProvider';
import ThemedText from '../../components/ThemedText';

// Dummy JSON data for payment options - will be replaced with API data later
const PAYMENT_OPTIONS = [
  {
    id: 1,
    title: 'Option 1',
    bankName: 'Habib Bank Limiteds',
    accountTitle: 'PAKFITS',
    accountNo: '5023 7000 697755',
  },
  {
    id: 2,
    title: 'Option 2',
    bankName: 'Mobi Cash / Jazz Ca',
    accountTitle: 'Omar Bilal Ahmad',
    accountNo: '0307 268 1501',
  },
  {
    id: 3,
    title: 'Option 3',
    bankName: 'Easy Paisas',
    accountTitle: 'Omar Bilal Ahmad',
    accountNo: '0316 2989 178',
  },
];

const WHATSAPP_NUMBER = '03162989178';

const PackagesScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme, mode } = useTheme();
  
  // Animation for payment cards
  const cardAnimations = useRef(
    PAYMENT_OPTIONS.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
      pressAnim: new Animated.Value(1),
    }))
  ).current;
  
  useEffect(() => {
    Animated.stagger(80,
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

  const handleWhatsAppPress = () => {
    const url = `whatsapp://send?phone=${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`);
    });
  };

  const handleOptionPress = (option, index) => {
    // Press animation
    const anim = cardAnimations[index];
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
    
    navigation.navigate('PackageDetail', {
      packageData: {
        title: '3 Months Consultation',
        price: 'PKR 15000',
        features: [
          'Customized Nutrition Plan',
          'No Medicines & Supplements',
          'Homebased Cost Effective Diet',
          'Customized Workout Strategy',
          'Performance based changes',
          'Home Workout Videos',
          'Gym Workout Videos',
          'Body Weight Workout Videos',
          'Motivational Videos',
          'Food Recipe Videos',
          'Mind Sciences Training',
          'Stress Management Training',
          '1 on 1 Chat with Omar Bilal',
        ],
      },
      paymentOption: option,
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
            Packages
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
        {/* Instructions */}
        <Animated.View 
          style={[
            styles.instructionsContainer,
            {
              opacity: cardAnimations[0]?.opacity || 1,
            }
          ]}
        >
          <ThemedText style={[styles.instructionsText, { color: theme.colors.text }]} font="manrope" weight="regular">
            Whatsapp the Screenshot of the RECEIPT
          </ThemedText>
          <View style={styles.instructionsRow}>
            <ThemedText style={[styles.instructionsText, { color: theme.colors.text }]} font="manrope" weight="regular">
              after making the payment at{' '}
            </ThemedText>
            <TouchableOpacity onPress={handleWhatsAppPress} activeOpacity={0.7}>
              <ThemedText style={[styles.phoneNumber, { color: theme.colors.primary }]} font="manrope" weight="regular">
                {WHATSAPP_NUMBER}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Payment Options */}
        {PAYMENT_OPTIONS.map((option, index) => {
          const anim = cardAnimations[index];
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
                  styles.paymentCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => handleOptionPress(option, index)}
                activeOpacity={1}
              >
                <View style={styles.paymentCardContent}>
                  <ThemedText style={[styles.optionTitle, { color: theme.colors.primary }]} font="manrope" weight="bold">
                    {option.title}
                  </ThemedText>
                  
                  <View style={styles.paymentDetailRow}>
                    <ThemedText style={[styles.detailLabel, { color: theme.colors.text }]} font="manrope" weight="regular">
                      Bank Name:
                    </ThemedText>
                    <ThemedText style={[styles.detailValue, { color: theme.colors.text }]} font="manrope" weight="regular">
                      {option.bankName}
                    </ThemedText>
                  </View>

                  <View style={styles.paymentDetailRow}>
                    <ThemedText style={[styles.detailLabel, { color: theme.colors.text }]} font="manrope" weight="regular">
                      Account Title:
                    </ThemedText>
                    <ThemedText style={[styles.detailValue, { color: theme.colors.text }]} font="manrope" weight="regular">
                      {option.accountTitle}
                    </ThemedText>
                  </View>

                  <View style={styles.paymentDetailRow}>
                    <ThemedText style={[styles.detailLabel, { color: theme.colors.text }]} font="manrope" weight="regular">
                      Account No:
                    </ThemedText>
                    <ThemedText style={[styles.detailValue, { color: theme.colors.text }]} font="manrope" weight="regular">
                      {option.accountNo}
                    </ThemedText>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
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
  instructionsContainer: {
    marginBottom: 24,
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  instructionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  phoneNumber: {
    fontSize: 14,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  paymentCardContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  paymentDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
  },
});

export default PackagesScreen;

