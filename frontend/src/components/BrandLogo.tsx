import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useT } from "@/src/i18n";
import { useTheme } from "@/src/theme";

type LogoSize = "sm" | "md" | "lg";

type BrandMarkProps = {
  size?: number;
};

type BrandLogoProps = {
  compact?: boolean;
  size?: LogoSize;
  showSupportingText?: boolean;
  testID?: string;
};

const DIMENSIONS: Record<LogoSize, number> = {
  sm: 34,
  md: 42,
  lg: 58,
};

export function BrandMark({ size = DIMENSIONS.md }: BrandMarkProps) {
  const { colors } = useTheme();
  const geometry = useMemo(
    () => ({
      roofWidth: size * 0.72,
      roofHeight: size * 0.36,
      bodyWidth: size * 0.62,
      bodyHeight: size * 0.52,
      doorWidth: size * 0.21,
      doorHeight: size * 0.31,
    }),
    [size],
  );

  return (
    <View
      accessible
      accessibilityLabel="Come In logo"
      style={[
        styles.mark,
        {
          width: size,
          height: size,
          borderRadius: size * 0.24,
          backgroundColor: colors.brandTertiary,
        },
      ]}
    >
      <View
        style={[
          styles.roof,
          {
            top: size * 0.1,
            borderLeftWidth: geometry.roofWidth / 2,
            borderRightWidth: geometry.roofWidth / 2,
            borderBottomWidth: geometry.roofHeight,
            borderBottomColor: colors.brandPrimary,
          },
        ]}
      />
      <View
        style={[
          styles.house,
          {
            width: geometry.bodyWidth,
            height: geometry.bodyHeight,
            left: (size - geometry.bodyWidth) / 2,
            top: size * 0.37,
            backgroundColor: colors.brandPrimary,
            borderTopLeftRadius: size * 0.06,
            borderTopRightRadius: size * 0.06,
          },
        ]}
      />
      <View
        style={[
          styles.door,
          {
            width: geometry.doorWidth,
            height: geometry.doorHeight,
            left: (size - geometry.doorWidth) / 2,
            top: size * 0.52,
            borderTopLeftRadius: size * 0.04,
            borderTopRightRadius: size * 0.04,
            backgroundColor: colors.brandSecondary,
          },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: colors.brandForest }]} />
      </View>
    </View>
  );
}

export function BrandLogo({
  compact = false,
  size = "md",
  showSupportingText = false,
  testID,
}: BrandLogoProps) {
  const { colors } = useTheme();
  const { t } = useT();
  const markSize = DIMENSIONS[size];
  const tagline = t("brand.tagline").replace(/—/g, "").trim();

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Come In, your town, at your door"
      style={[styles.logo, compact && styles.logoCompact]}
    >
      <BrandMark size={markSize} />
      {!compact && (
        <View style={styles.copy}>
          <Text testID={testID ?? "brand-logo"} style={styles.wordmark}>
            <Text style={{ color: colors.brandForest }}>Come</Text>
            <Text style={{ color: colors.brandPrimary }}> In</Text>
          </Text>
          <Text style={[styles.tagline, { color: colors.muted }]}>{tagline}</Text>
          {showSupportingText && (
            <Text style={[styles.supporting, { color: colors.muted }]}>Local Shops • Home Services • More</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoCompact: {
    gap: 0,
  },
  mark: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  roof: {
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
  },
  house: {
    position: "absolute",
  },
  door: {
    position: "absolute",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 2,
  },
  handle: {
    width: 2.5,
    height: 2.5,
    borderRadius: 2,
  },
  copy: {
    minWidth: 0,
  },
  wordmark: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  tagline: {
    fontSize: 10,
    lineHeight: 13,
    marginTop: 1,
    letterSpacing: 0.1,
  },
  supporting: {
    fontSize: 8,
    lineHeight: 10,
    marginTop: 2,
    letterSpacing: 0.15,
  },
});
