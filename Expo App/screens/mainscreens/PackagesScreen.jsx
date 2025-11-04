import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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

  const handleWhatsAppPress = () => {
    const url = `whatsapp://send?phone=${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`;
    Linking.openURL(url).catch(() => {
      // If WhatsApp is not installed, open in browser
      Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`);
    });
  };

  const handleOptionPress = (option) => {
    // Navigate to PackageDetailScreen when clicking on any payment option
    // The package details will be shown - later this can be fetched based on selected package
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
      paymentOption: option, // Pass payment option for future use
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
        <View style={styles.instructionsContainer}>
          <ThemedText style={styles.instructionsText} font="manrope" weight="regular">
            Whatsapp the Screenshot of the RECEIPT
          </ThemedText>
          <View style={styles.instructionsRow}>
            <ThemedText style={styles.instructionsText} font="manrope" weight="regular">
              after making the payment at{' '}
            </ThemedText>
            <TouchableOpacity onPress={handleWhatsAppPress} activeOpacity={0.7}>
              <ThemedText style={styles.phoneNumber} font="manrope" weight="regular">
                {WHATSAPP_NUMBER}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Options */}
        {PAYMENT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.paymentCard}
            onPress={() => handleOptionPress(option)}
            activeOpacity={0.7}
          >
            <View style={styles.paymentCardContent}>
              <ThemedText style={styles.optionTitle} font="manrope" weight="bold">
                {option.title}
              </ThemedText>
              
              <View style={styles.paymentDetailRow}>
                <ThemedText style={styles.detailLabel} font="manrope" weight="regular">
                  Bank Name:
                </ThemedText>
                <ThemedText style={styles.detailValue} font="manrope" weight="regular">
                  {option.bankName}
                </ThemedText>
              </View>

              <View style={styles.paymentDetailRow}>
                <ThemedText style={styles.detailLabel} font="manrope" weight="regular">
                  Account Title:
                </ThemedText>
                <ThemedText style={styles.detailValue} font="manrope" weight="regular">
                  {option.accountTitle}
                </ThemedText>
              </View>

              <View style={styles.paymentDetailRow}>
                <ThemedText style={styles.detailLabel} font="manrope" weight="regular">
                  Account No:
                </ThemedText>
                <ThemedText style={styles.detailValue} font="manrope" weight="regular">
                  {option.accountNo}
                </ThemedText>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
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
  instructionsContainer: {
    marginBottom: 24,
  },
  instructionsText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  instructionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#E53E3E',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  paymentCardContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: '#E53E3E',
    marginBottom: 12,
  },
  paymentDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
});

export default PackagesScreen;

