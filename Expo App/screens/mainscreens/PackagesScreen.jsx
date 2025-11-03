import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import ThemedText from '../../components/ThemedText';

const PackagesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ThemedText variant="h1">Packages Screen</ThemedText>
        <ThemedText variant="body" style={styles.subtitle}>
          View your subscription packages
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

export default PackagesScreen;

