// Design tokens for Come In app. Mint green / white / sunshine yellow light theme.
import { useMemo } from "react";
import { Appearance, StyleSheet, useColorScheme } from "react-native";

export type ColorScheme = "light" | "dark";

const light = {
  // ---------------------------------------------------------------------------
  // Surfaces — "paper" premium LIGHT theme. Noticeably deeper off-white /
  // light-grey canvas, deeper neutral section cards, deeper fills for
  // inputs/chips. Still a light theme — never black, never dark mode.
  // ---------------------------------------------------------------------------
  surface: "#E8ECE2",            // app canvas — soft paper, perceptibly darker
  onSurface: "#0A1612",          // deep green-charcoal text
  surfaceSecondary: "#D6DCCB",   // cards / section backgrounds
  onSurfaceSecondary: "#263028",
  surfaceTertiary: "#C5CDB6",    // inputs / chips, deepest nesting
  onSurfaceTertiary: "#3C463A",
  surfaceInverse: "#0A1612",     // tooltips, snackbars popping off the canvas
  onSurfaceInverse: "#E8ECE2",
  muted: "#5B6456",              // captions, timestamps, placeholders

  // ---------------------------------------------------------------------------
  // Brand — rich deep Come In green with a golden-yellow door accent.
  // ---------------------------------------------------------------------------
  brand: "#036C4E",
  onBrand: "#FFFFFF",
  brandPrimary: "#036C4E",
  onBrandPrimary: "#FFFFFF",
  brandSecondary: "#EAB22A",
  onBrandSecondary: "#1A1308",
  brandTertiary: "#BDD6C8",
  onBrandTertiary: "#053F2E",

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------
  success: "#036C4E",
  onSuccess: "#FFFFFF",
  warning: "#9A5A08",
  onWarning: "#FFFFFF",
  error: "#A51818",
  onError: "#FFFFFF",
  info: "#2A3B3F",
  onInfo: "#FFFFFF",

  // ---------------------------------------------------------------------------
  // Lines
  // ---------------------------------------------------------------------------
  border: "#B8C0AE",
  borderStrong: "#A0A896",
  divider: "#C5CDB6",
};

export type ThemeColors = typeof light;

export const defaultScheme = "light" satisfies ColorScheme;

export const themes: { light: ThemeColors; dark?: ThemeColors } = { light };

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
};

export function setColorScheme(scheme: ColorScheme | null) {
  Appearance.setColorScheme?.(scheme ?? "unspecified");
}

setColorScheme?.(themes.dark ? null : defaultScheme);

export function useTheme(): { scheme: ColorScheme; colors: ThemeColors } {
  const system = useColorScheme();
  const scheme: ColorScheme =
    system === "light" || system === "dark"
      ? (themes[system] ? system : defaultScheme)
      : defaultScheme;
  return { scheme, colors: themes[scheme] ?? themes.light };
}

export const colors = themes.light;

export function makeStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: ThemeColors) => T & StyleSheet.NamedStyles<any>,
): () => T {
  return function useStyles(): T {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}
