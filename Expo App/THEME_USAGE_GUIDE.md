# Theme System Usage Guide

This guide explains how to use the light/dark theme system in the PakFit app.

## Overview

The app now supports both light and dark themes with smooth transitions. The theme system is built using React Context and provides:

- **Light Mode**: Bright, clean interface for daytime use
- **Dark Mode**: Easy on the eyes for nighttime use
- **Smooth Animations**: Theme transitions are animated for better UX
- **Persistent Storage**: Theme preference is saved and restored on app restart

## Basic Usage

### 1. Import the Theme Hook

```jsx
import { useTheme } from '../../components/ThemeProvider';
```

### 2. Get Theme Values

```jsx
const { theme, mode, toggleMode, setMode } = useTheme();

// theme.colors contains all color values
// mode is either 'light' or 'dark'
// toggleMode() switches between light and dark
// setMode('light' | 'dark') sets a specific mode
```

### 3. Use Theme Colors in Styles

Instead of hardcoded colors, use theme colors:

```jsx
// ❌ Bad - Hardcoded colors
<View style={{ backgroundColor: '#1A1A1A' }}>
  <Text style={{ color: '#FFFFFF' }}>Hello</Text>
</View>

// ✅ Good - Theme colors
<View style={{ backgroundColor: theme.colors.background }}>
  <Text style={{ color: theme.colors.text }}>Hello</Text>
</View>
```

## Available Theme Colors

### Background Colors
- `theme.colors.background` - Main background
- `theme.colors.surface` - Card/surface background
- `theme.colors.surfaceAlt` - Alternative surface (e.g., input fields)
- `theme.colors.surfaceElevated` - Elevated surfaces (modals, dropdowns)

### Text Colors
- `theme.colors.text` - Primary text
- `theme.colors.textSecondary` - Secondary text
- `theme.colors.textMuted` - Muted/disabled text
- `theme.colors.textInverse` - Text for dark backgrounds

### Primary Colors
- `theme.colors.primary` - Main brand color (PakFit red)
- `theme.colors.primaryDark` - Darker shade of primary
- `theme.colors.primaryLight` - Lighter shade of primary
- `theme.colors.onPrimary` - Text color on primary background

### Border & Divider
- `theme.colors.border` - Border color
- `theme.colors.borderLight` - Light border
- `theme.colors.divider` - Divider color

### Status Colors
- `theme.colors.success` / `theme.colors.successLight`
- `theme.colors.warning` / `theme.colors.warningLight`
- `theme.colors.error` / `theme.colors.errorLight`
- `theme.colors.info` / `theme.colors.infoLight`

## Adding Animations

### Simple Fade Animation

```jsx
import { Animated } from 'react-native';

const fadeAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }).start();
}, []);

<Animated.View style={{ opacity: fadeAnim }}>
  {/* Your content */}
</Animated.View>
```

### Theme Transition Animation

```jsx
const { theme, mode } = useTheme();
const themeAnim = useRef(new Animated.Value(mode === 'dark' ? 1 : 0)).current;

useEffect(() => {
  Animated.spring(themeAnim, {
    toValue: mode === 'dark' ? 1 : 0,
    useNativeDriver: false,
  }).start();
}, [mode]);

<Animated.View
  style={{
    backgroundColor: themeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [lightColor, darkColor],
    }),
  }}
>
  {/* Your content */}
</Animated.View>
```

## Example: Complete Screen Implementation

```jsx
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import ThemedText from '../../components/ThemedText';

const MyScreen = () => {
  const { theme, mode } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <ThemedText style={{ color: theme.colors.text }}>
          Hello World
        </ThemedText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
});

export default MyScreen;
```

## Theme Toggle in Profile Screen

The theme toggle is already implemented in the ProfileScreen. Users can switch between light and dark mode from the Profile screen under the "Appearance" section.

## Best Practices

1. **Always use theme colors** - Never hardcode colors like `#FFFFFF` or `#000000`
2. **Use Animated.View for theme transitions** - Provides smooth color changes
3. **Test both themes** - Make sure your UI looks good in both light and dark mode
4. **Use appropriate text colors** - `text` for primary, `textSecondary` for less important text
5. **Consider contrast** - Ensure text is readable on backgrounds in both themes

## Updating Existing Screens

To update an existing screen to use the theme:

1. Import `useTheme` hook
2. Get `theme` and `mode` from the hook
3. Replace hardcoded colors with `theme.colors.*`
4. Update StatusBar `barStyle` based on mode
5. Add animations where appropriate
6. Test in both light and dark modes

## StatusBar

Always set StatusBar based on theme mode:

```jsx
import { StatusBar } from 'react-native';

<StatusBar 
  barStyle={mode === 'dark' ? "light-content" : "dark-content"} 
  backgroundColor={theme.colors.background} 
/>
```

## Common Patterns

### Card Component
```jsx
<View style={[
  styles.card,
  {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  }
]}>
```

### Button Component
```jsx
<TouchableOpacity
  style={[
    styles.button,
    { backgroundColor: theme.colors.primary }
  ]}
>
  <ThemedText style={{ color: theme.colors.onPrimary }}>
    Button Text
  </ThemedText>
</TouchableOpacity>
```

### Input Field
```jsx
<TextInput
  style={[
    styles.input,
    {
      backgroundColor: theme.colors.surfaceAlt,
      borderColor: theme.colors.border,
      color: theme.colors.text,
    }
  ]}
  placeholderTextColor={theme.colors.textMuted}
/>
```

## Troubleshooting

**Theme not changing?**
- Make sure you're using `theme.colors.*` instead of hardcoded colors
- Check that `useTheme()` is called at the component level
- Verify the ThemeProvider wraps your app in App.js

**Colors look wrong?**
- Ensure you're using the right color property (e.g., `text` not `textInverse`)
- Check if you need `surface` vs `surfaceAlt` vs `background`
- Verify contrast ratios for accessibility

**Animations not working?**
- Make sure `useNativeDriver` is set correctly (true for transform/opacity, false for colors)
- Check that Animated.Value is initialized with `useRef`
- Verify animations are started in `useEffect`

