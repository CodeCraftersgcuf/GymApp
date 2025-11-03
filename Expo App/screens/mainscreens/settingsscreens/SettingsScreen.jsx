import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import ThemedText from '../../../components/ThemedText';
import { useAuth } from '../../../contexts/AuthContext';

const SettingsScreen = () => {
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ThemedText variant="h1">Settings Screen</ThemedText>
        <ThemedText variant="body" style={styles.subtitle}>
          Manage your app settings
        </ThemedText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  subtitle: {
    marginTop: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default SettingsScreen;

