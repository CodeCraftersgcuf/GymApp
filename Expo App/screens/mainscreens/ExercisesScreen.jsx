import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import ThemedText from '../../components/ThemedText';

const ExercisesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ThemedText variant="h1">Exercises Screen</ThemedText>
        <ThemedText variant="body" style={styles.subtitle}>
          Browse available exercises
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

export default ExercisesScreen;

