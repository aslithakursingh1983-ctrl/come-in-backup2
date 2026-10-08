import Feather from "@react-native-vector-icons/feather";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "@/src/store/cart";
import { useLocationCtx } from "@/src/store/location";
import { makeStyles, radius, spacing, useTheme } from "@/src/theme";

type Row = {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  hint?: string;
  onPress?: () => void;
};

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const { totalCount } = useCart();
  const { location } = useLocationCtx();
  const [signInOpen, setSignInOpen] = useState(false);

  const groups: { title: string; rows: Row[] }[] = [
    {
      title: "Your shopping",
      rows: [
        {
          icon: "shopping-bag",
          label: "Cart",
          hint: totalCount > 0 ? `${totalCount} item${totalCount === 1 ? "" : "s"}` : "Empty",
          onPress: () => router.push("/(tabs)/cart"),
        },
        { icon: "clock", label: "Past orders", hint: "No orders yet" },
        { icon: "heart", label: "Saved items" },
      ],
    },
    {
      title: "Delivery",
      rows: [
        {
          icon: "map-pin",
          label: "Delivery address",
          hint: location,
          onPress: () => router.push("/delivery-address"),
        },
        { icon: "package", label: "Request anything", onPress: () => router.push("/request") },
        { icon: "tool", label: "Home services", onPress: () => router.push("/services") },
      ],
    },
    {
      title: "Preferences",
      rows: [
        { icon: "bell", label: "Notifications" },
        { icon: "credit-card", label: "Payment methods" },
        { icon: "help-circle", label: "Help & support" },
      ],
    },
  ];

  return (
    <>
      <ScrollView
        style={styles.root}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>G</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Hi there, Guest</Text>
          <Text style={styles.sub}>Sign in to track orders and saved addresses</Text>
        </View>
        <Pressable
          testID="account-signin-btn"
          onPress={() => setSignInOpen(true)}
          style={styles.signInBtn}
        >
          <Text style={styles.signInText}>Sign in</Text>
        </Pressable>
      </View>

      {groups.map((g) => (
        <View key={g.title} style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <Text style={styles.groupTitle}>{g.title}</Text>
          <View style={styles.groupCard}>
            {g.rows.map((r, idx) => (
              <Pressable
                testID={`account-row-${r.label}`}
                key={r.label}
                onPress={r.onPress}
                style={({ pressed }) => [
                  styles.row,
                  idx < g.rows.length - 1 && styles.rowDivider,
                  pressed && { backgroundColor: colors.surfaceTertiary },
                ]}
              >
                <View style={styles.rowIcon}>
                  <Feather name={r.icon} size={18} color={colors.brandPrimary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>{r.label}</Text>
                  {r.hint && (
                    <Text style={styles.rowHint} numberOfLines={1}>
                      {r.hint}
                    </Text>
                  )}
                </View>
                <Feather name="chevron-right" size={18} color={colors.muted} />
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.brandFooter}>
        <Text style={styles.brandFooterTitle}>Come In</Text>
        <Text style={styles.brandFooterSub}>your town, at your door.</Text>
        <Text style={styles.version}>v1.0 • Demo</Text>
      </View>
    </ScrollView>

      <Modal
        visible={signInOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSignInOpen(false)}
      >
        <Pressable style={styles.signInBackdrop} onPress={() => setSignInOpen(false)}>
          <View style={styles.signInSheet}>
            <View style={styles.signInIcon}>
              <Feather name="user" size={28} color={colors.onBrandPrimary} />
            </View>
            <Text style={styles.signInTitle}>Sign in coming soon</Text>
            <Text style={styles.signInSub}>
              Accounts, order history and saved addresses will be unlocked in the next update.
            </Text>
            <Pressable
              testID="signin-close-btn"
              onPress={() => setSignInOpen(false)}
              style={styles.signInCloseBtn}
            >
              <Text style={styles.signInCloseText}>Got it</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surfaceSecondary },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.brandTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "800", color: colors.brandPrimary },
  name: { fontSize: 17, fontWeight: "800", color: colors.onSurface },
  sub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  signInBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.brandPrimary,
  },
  signInText: { fontSize: 12, fontWeight: "800", color: colors.onBrandPrimary },

  groupTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  groupCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.brandTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { fontSize: 14, fontWeight: "600", color: colors.onSurface },
  rowHint: { fontSize: 12, color: colors.muted, marginTop: 2 },

  brandFooter: {
    alignItems: "center",
    marginTop: spacing.xl,
    gap: 2,
  },
  brandFooterTitle: { fontSize: 20, fontWeight: "800", color: colors.brandPrimary },
  brandFooterSub: { fontSize: 12, color: colors.muted },
  version: { fontSize: 10, color: colors.muted, marginTop: spacing.sm },

  signInBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  signInSheet: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.lg,
    alignItems: "center",
    gap: spacing.sm,
  },
  signInIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  signInTitle: { fontSize: 17, fontWeight: "800", color: colors.onSurface },
  signInSub: { fontSize: 13, color: colors.muted, textAlign: "center", lineHeight: 20 },
  signInCloseBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  signInCloseText: { color: colors.onBrandPrimary, fontWeight: "800" },
}));
