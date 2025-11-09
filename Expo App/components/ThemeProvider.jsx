// theme/ThemeProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

/* helpers: make light/dark tints from a hex */
const clamp = (n) => Math.max(0, Math.min(255, n));
const hexToRgb = (hex) => {
  const s = hex.replace("#", "");
  const b = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  const n = parseInt(b, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};
const rgbToHex = ({ r, g, b }) =>
  "#" + [r, g, b].map((x) => clamp(Math.round(x)).toString(16).padStart(2, "0")).join("");
const mix = (c1, c2, t) => ({
  r: c1.r + (c2.r - c1.r) * t,
  g: c1.g + (c2.g - c1.g) * t,
  b: c1.b + (c2.b - c1.b) * t,
});
const lighten = (hex, t = 0.85) => rgbToHex(mix(hexToRgb(hex), { r: 255, g: 255, b: 255 }, t));
const darken = (hex, t = 0.2) => rgbToHex(mix(hexToRgb(hex), { r: 0, g: 0, b: 0 }, t));

const STORAGE_KEY_PRIMARY = "@theme_primary";
const STORAGE_KEY_MODE = "@theme_mode";
const DEFAULT_PRIMARY = "#E53E3E"; // PakFit red

// Light theme colors
const lightTheme = {
  // Primary colors
  primary: DEFAULT_PRIMARY,
  primaryDark: "#C53030",
  primaryLight: "#FEE2E2",
  onPrimary: "#FFFFFF",
  
  // Secondary colors
  secondary: "#14B8A6",
  secondaryDark: "#0D9488",
  secondaryLight: "#99F6E4",
  
  // Neutral colors
  background: "#FFFFFF",
  surface: "#F8FAFC",
  surfaceAlt: "#F1F5F9",
  surfaceElevated: "#FFFFFF",
  
  // Text colors
  text: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  textInverse: "#FFFFFF",
  
  // Status colors
  success: "#10B981",
  successLight: "#D1FAE5",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  error: "#EF4444",
  errorLight: "#FEE2E2",
  info: "#3B82F6",
  infoLight: "#DBEAFE",
  
  // Border and divider colors
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  divider: "#E2E8F0",
  
  // Shadow colors
  shadow: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.2)",
};

// Dark theme colors
const darkTheme = {
  // Primary colors
  primary: DEFAULT_PRIMARY,
  primaryDark: "#C53030",
  primaryLight: "#7F1D1D",
  onPrimary: "#FFFFFF",
  
  // Secondary colors
  secondary: "#14B8A6",
  secondaryDark: "#0D9488",
  secondaryLight: "#134E4A",
  
  // Neutral colors
  background: "#1A1A1A",
  surface: "#2A2A2A",
  surfaceAlt: "#1A1A1A",
  surfaceElevated: "#333333",
  
  // Text colors
  text: "#FFFFFF",
  textSecondary: "#E2E8F0",
  textMuted: "#94A3B8",
  textInverse: "#0F172A",
  
  // Status colors
  success: "#10B981",
  successLight: "#064E3B",
  warning: "#F59E0B",
  warningLight: "#78350F",
  error: "#EF4444",
  errorLight: "#7F1D1D",
  info: "#3B82F6",
  infoLight: "#1E3A8A",
  
  // Border and divider colors
  border: "#333333",
  borderLight: "#444444",
  divider: "#333333",
  
  // Shadow colors
  shadow: "rgba(0, 0, 0, 0.3)",
  shadowDark: "rgba(0, 0, 0, 0.5)",
};

export const createTheme = (mode = "dark", primary = DEFAULT_PRIMARY) => {
  const baseTheme = mode === "light" ? lightTheme : darkTheme;
  
  return {
    mode,
    colors: {
      ...baseTheme,
      primary,
      primaryDark: darken(primary, 0.15),
      primaryLight: mode === "light" ? lighten(primary, 0.7) : darken(primary, 0.3),
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 40,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      full: 9999,
    },
    typography: {
      h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
      h2: { fontSize: 28, lineHeight: 36, fontWeight: '600' },
      h3: { fontSize: 24, lineHeight: 32, fontWeight: '600' },
      h4: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
      h5: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
      h6: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
      body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
      bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
      caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
      button: { fontSize: 16, lineHeight: 20, fontWeight: '600' },
    },
    shadows: {
      sm: {
        shadowColor: mode === "light" ? '#000' : '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: mode === "light" ? 0.05 : 0.3,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: mode === "light" ? '#000' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: mode === "light" ? 0.1 : 0.4,
        shadowRadius: 4,
        elevation: 3,
      },
      lg: {
        shadowColor: mode === "light" ? '#000' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: mode === "light" ? 0.15 : 0.5,
        shadowRadius: 8,
        elevation: 6,
      },
    },
  };
};

const ThemeContext = createContext({
  theme: createTheme("dark", DEFAULT_PRIMARY),
  mode: "dark",
  toggleMode: () => {},
  setMode: () => {},
  primary: DEFAULT_PRIMARY,
  setPrimary: () => {},
});

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState("dark");
  const [primary, setPrimaryState] = useState(DEFAULT_PRIMARY);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [savedMode, savedPrimary] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_MODE),
          AsyncStorage.getItem(STORAGE_KEY_PRIMARY),
        ]);
        
        if (savedMode) {
          setModeState(savedMode);
        } else {
          // Use system preference if no saved mode
          setModeState(systemColorScheme === "dark" ? "dark" : "light");
        }
        
        if (savedPrimary) {
          setPrimaryState(savedPrimary);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
        setModeState(systemColorScheme === "dark" ? "dark" : "light");
      } finally {
        setIsInitialized(true);
      }
    })();
  }, [systemColorScheme]);

  const setMode = async (newMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_MODE, newMode);
    } catch (error) {
      console.error("Error saving theme mode:", error);
    }
  };

  const toggleMode = async () => {
    const newMode = mode === "light" ? "dark" : "light";
    await setMode(newMode);
  };

  const setPrimary = async (hex) => {
    setPrimaryState(hex);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_PRIMARY, hex);
    } catch (error) {
      console.error("Error saving primary color:", error);
    }
  };

  const value = useMemo(
    () => ({
      theme: createTheme(mode, primary),
      mode,
      toggleMode,
      setMode,
      primary,
      setPrimary,
      isInitialized,
    }),
    [mode, primary, isInitialized]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

// Static colors for files that don't use dynamic theme
export const STATIC_COLORS = {
  // Primary colors
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryLight: "#DBEAFE",
  onPrimary: "#ffffff",
  
  // Secondary colors
  secondary: "#14B8A6",
  secondaryDark: "#0D9488",
  secondaryLight: "#99F6E4",
  
  // Neutral colors
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F5F9",
  surfaceElevated: "#FFFFFF",
  
  // Text colors
  text: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  textInverse: "#FFFFFF",
  
  // Status colors
  success: "#10B981",
  successLight: "#D1FAE5",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  error: "#EF4444",
  errorLight: "#FEE2E2",
  info: "#3B82F6",
  infoLight: "#DBEAFE",
  
  // Border and divider colors
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  divider: "#E2E8F0",
  
  // Shadow colors
  shadow: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.2)",
};
