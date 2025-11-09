// components/ThemeTransitionWrapper.jsx
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useTheme } from './ThemeProvider';

/**
 * Wrapper component that provides smooth theme transition animations
 * Wrap your screen content with this component for automatic theme transitions
 */
export const ThemeTransitionWrapper = ({ children, style }) => {
  const { theme, isInitialized } = useTheme();
  const fadeAnim = useRef(new Animated.Value(isInitialized ? 1 : 0)).current;

  useEffect(() => {
    if (isInitialized) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isInitialized, theme.mode]);

  if (!isInitialized) {
    return null; // Or a loading indicator
  }

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          backgroundColor: theme.colors.background,
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default ThemeTransitionWrapper;

