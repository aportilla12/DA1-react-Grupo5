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

  robotBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: COLORS.surfaceLow,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  robotDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },

  robotBadgeText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 4,
  },

  sessionText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginBottom: 22,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },

  error: {
    color: "#ffb4ab",
    backgroundColor: COLORS.errorSoft,
    borderWidth: 1,
    borderColor: "#93000a",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "rgba(31,31,33,0.85)",
    borderWidth: 1,
    borderColor: "rgba(68,71,77,0.65)",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardFailed: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },

  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: COLORS.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },

  iconBoxFailed: {
    backgroundColor: "#690005",
  },

  iconText: {
    fontSize: 22,
  },

  commandName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
  },

  statusBadge: {
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  statusSuccess: {
    backgroundColor: "rgba(34,197,94,0.12)",
  },

  statusFailed: {
    backgroundColor: "rgba(239,68,68,0.12)",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "900",
  },

  successText: {
    color: COLORS.success,
  },

  failedText: {
    color: COLORS.error,
  },

  timeText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "700",
  },

  chevron: {
    color: COLORS.primary,
    fontSize: 22,
  },

  details: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },

  empty: {
    marginTop: 60,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.5,
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: "center",
  },

  terminalBox: {
    marginTop: 20,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    backgroundColor: "#0a0a0b",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  terminalHeader: {
    backgroundColor: COLORS.surfaceHigh,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  terminalTitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  terminalVersion: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "700",
  },

  terminalBody: {
    padding: 14,
  },

  terminalLine: {
    color: COLORS.primary,
    opacity: 0.85,
    fontSize: 12,
    lineHeight: 20,
  },
});