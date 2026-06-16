import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING, FONT } from "./theme";

export const styles = StyleSheet.create({

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

  connectedBadge: {
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

  connectedDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#64FFDA",
  },

  connectedText: {
    color: "#64FFDA",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 110,
  },

  title: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 22,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },

  actionButton: {
    width: "48%",
    height: 82,
    backgroundColor: COLORS.surfaceLow,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  actionButtonDisabled: {
    opacity: 0.55,
  },

  actionIcon: {
    fontSize: 28,
    marginBottom: 12,
  },

  actionText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
  },

  visualCard: {
    height: 90,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceLow,
    marginBottom: 28,
    overflow: "hidden",
    padding: 18,
    justifyContent: "flex-end",
  },

  visualOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,25,47,0.35)",
  },

  visualText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  visualSub: {
    color: "#64FFDA",
    fontSize: 11,
    marginBottom: 6,
  },

  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
  },

  historyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },

  viewAll: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  historyItem: {
    backgroundColor: COLORS.surfaceLow,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  historyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },

  historyIconBoxError: {
    backgroundColor: "#690005",
  },

  historyIcon: {
    fontSize: 20,
  },

  historyAction: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },

  historyTime: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },

  statusBadge: {
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },

  statusOk: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.5)",
  },

  statusError: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderColor: "rgba(239,68,68,0.5)",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  statusOkText: {
    color: COLORS.success,
  },

  statusErrorText: {
    color: COLORS.error,
  },

  feedbackBox: {
    backgroundColor: COLORS.primaryDark,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 18,
  },

  feedbackText: {
    color: COLORS.primary,
    textAlign: "center",
    fontWeight: "800",
  },

  disconnectedBox: {
    backgroundColor: COLORS.errorSoft,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error,
    padding: 16,
    marginTop: 20,
  },

  disconnectedText: {
    color: "#ffb4ab",
    fontWeight: "800",
    textAlign: "center",
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    position: "relative",
    },

  disconnectedContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    },
});
