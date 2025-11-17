import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../components/ThemeProvider';
import ThemedText from '../../components/ThemedText';

const ExercisesScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme, mode } = useTheme();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
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

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={mode === 'dark' ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          }
        ]}
      >
        <ThemedText style={[styles.title, { color: theme.colors.text }]} variant="h1">Exercises Screen</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.colors.textSecondary }]} variant="body">
          Browse available exercises
        </ThemedText>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    textAlign: 'center',
  },
});

export default ExercisesScreen;

