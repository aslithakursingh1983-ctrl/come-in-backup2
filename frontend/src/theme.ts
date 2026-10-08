// Design tokens for Come In app. Mint green / white / sunshine yellow light theme.
import { useMemo } from "react";
import { Appearance, StyleSheet, useColorScheme } from "react-native";

export type ColorScheme = "light" | "dark";

const light = {
  // ---------------------------------------------------------------------------
  // Surfaces — slightly darker premium LIGHT theme. Warm off-white canvas,
  // deeper neutral cards, deeper fills for inputs/chips. Still bright and
  // readable, never dark mode.
  // ---------------------------------------------------------------------------
  surface: "#F4F6F1",            // app canvas — soft warm off-white
  onSurface: "#0F1A14",          // near-black with a green tint
  surfaceSecondary: "#EAEDE5",   // cards / section backgrounds
  onSurfaceSecondary: "#2F3A33",
  surfaceTertiary: "#DFE3DA",    // input / chip fills, deepest nesting
  onSurfaceTertiary: "#4A5248",
  surfaceInverse: "#0F1A14",     // tooltips, snackbars popping off the canvas
  onSurfaceInverse: "#F4F6F1",
  muted: "#687065",              // captions, timestamps, placeholders

  // ---------------------------------------------------------------------------
  // Brand — rich, deep Come In green with a golden yellow accent for the
  // selective "door" moments. brandTertiary is a deeper mint tint for pills
  // and savings chips, consistent with the darker canvas.
  // ---------------------------------------------------------------------------
  brand: "#047857",
  onBrand: "#FFFFFF",
  brandPrimary: "#047857",
  onBrandPrimary: "#FFFFFF",
  brandSecondary: "#F0B429",
  onBrandSecondary: "#1A1308",
  brandTertiary: "#CDE4D9",
  onBrandTertiary: "#053F2E",

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------
  success: "#047857",
  onSuccess: "#FFFFFF",
  warning: "#B45309",
  onWarning: "#FFFFFF",
  error: "#B91C1C",
  onError: "#FFFFFF",
  info: "#334155",
  onInfo: "#FFFFFF",

  // ---------------------------------------------------------------------------
  // Lines
  // ---------------------------------------------------------------------------
  border: "#D2D7CC",
  borderStrong: "#BBC2B5",
  divider: "#E0E4DB",
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
