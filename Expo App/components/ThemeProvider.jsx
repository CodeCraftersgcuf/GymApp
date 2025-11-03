// theme/ThemeProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const STORAGE_KEY = "@theme_primary";
const DEFAULT_PRIMARY = "#2563EB"; // Modern blue

export const createTheme = (primary) => {
  const onPrimary = "#ffffff";
  return {
    colors: {
      // Primary colors
      primary,
      primaryDark: darken(primary, 0.15),
      primaryLight: lighten(primary, 0.7),
      onPrimary,
      
      // Secondary colors
      secondary: "#14B8A6", // Teal
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      },
    },
  };
};

const ThemeContext = createContext({
  theme: createTheme(DEFAULT_PRIMARY),
  primary: DEFAULT_PRIMARY,
  setPrimary: (_hex) => {},
});

export const ThemeProvider = ({ children }) => {
  const [primary, setPrimaryState] = useState(DEFAULT_PRIMARY);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setPrimaryState(saved);
    })();
  }, []);

  const setPrimary = async (hex) => {
    setPrimaryState(hex);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, hex);
    } catch {}
  };

  const value = useMemo(() => ({ theme: createTheme(primary), primary, setPrimary }), [primary]);

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
