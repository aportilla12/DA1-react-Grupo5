import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING, FONT } from "./theme";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: 58,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.background,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  headerIcon: {
    fontSize: 20,
  },

  headerTitle: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: "800",
  },

  headerSignal: {
    color: COLORS.primary,
    fontSize: 18,
  },

  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "rgba(31,31,33,0.82)",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: 18,
  },

  statusCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  labelCaps: {
    color: COLORS.textSecondary,
    fontSize: FONT.label,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 6,
  },

  statusTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },

  statusIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.surfaceHigh,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statusIcon: {
    fontSize: 22,
  },

  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: FONT.label,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 10,
  },

  robotSelector: {
    gap: 12,
    marginBottom: 20,
  },

  robotCard: {
    backgroundColor: "rgba(31,31,33,0.82)",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    opacity: 0.6,
  },

  robotCardSelected: {
    borderColor: "#64FFDA",
    opacity: 1,
  },

  robotTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  robotIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },

  robotIcon: {
    fontSize: 21,
  },

  robotBadge: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
  },

  robotBadgeAvailable: {
    backgroundColor: "rgba(100,255,218,0.08)",
    borderColor: "rgba(100,255,218,0.25)",
  },

  robotBadgeUnavailable: {
    backgroundColor: "rgba(143,144,151,0.12)",
    borderColor: COLORS.border,
  },

  robotBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  robotBadgeTextAvailable: {
    color: "#64FFDA",
  },

  robotBadgeTextUnavailable: {
    color: COLORS.textSecondary,
  },

  robotName: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },

  robotDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  networkCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },

  networkHeader: {
    color: COLORS.primary,
    fontSize: FONT.label,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 14,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceLow,
    color: COLORS.text,
    paddingHorizontal: 14,
    fontSize: 14,
  },

  error: {
    color: "#ffb4ab",
    backgroundColor: COLORS.errorSoft,
    borderWidth: 1,
    borderColor: "#93000a",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 14,
    fontWeight: "600",
  },

  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },

  connectButton: {
    flex: 1,
    backgroundColor: "#64FFDA",
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: "center",
  },

  disconnectButton: {
    flex: 1,
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  connectText: {
    color: COLORS.primaryDark,
    fontWeight: "900",
    fontSize: 13,
  },

  disconnectText: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 13,
  },

  quickLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },

  quickLinkText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  quickLinkDanger: {
    color: COLORS.error,
  },

  slash: {
    color: COLORS.muted,
  },

  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 8,
  },

  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  historyRobot: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
  },

  historyStatus: {
    fontSize: 11,
    fontWeight: "900",
  },

  historySuccess: {
    color: COLORS.success,
  },

  historyFailed: {
    color: COLORS.error,
  },

  historyTime: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },

  diagnostics: {
    backgroundColor: "#0e0e10",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginTop: 10,
  },

  diagnosticsText: {
    color: "#64FFDA",
    fontSize: 12,
    lineHeight: 18,
  },
});