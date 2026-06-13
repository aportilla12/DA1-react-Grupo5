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

  connectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 6,
  },

  connectedDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },

  connectedText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: 16,
  },

  robotCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  robotAvatar: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  robotAvatarText: {
    fontSize: 30,
  },

  robotTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "800",
  },

  batteryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },

  batteryText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  batteryTrack: {
    width: 55,
    height: 8,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceHigh,
    overflow: "hidden",
  },

  batteryFill: {
    height: "100%",
    width: "88%",
    backgroundColor: COLORS.primary,
  },

  telemetryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  telemetryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 12,
  },

  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT.label,
    fontWeight: "900",
    letterSpacing: 1.4,
    marginBottom: 12,
    textTransform: "uppercase",
  },

  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  dataKey: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  dataValue: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },

  dpadCard: {
    alignItems: "center",
  },

  controls: {
    alignItems: "center",
    gap: 8,
  },

  controlsRow: {
    flexDirection: "row",
    gap: 8,
  },

  dpadButton: {
    width: 54,
    height: 54,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    },

  stopButton: {
    backgroundColor: "rgba(239,68,68,0.18)",
    borderColor: COLORS.error,
  },
  
  dpadText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 22,
    },

  speedRow: {
    flexDirection: "row",
    gap: 10,
  },

  speedButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
    backgroundColor: COLORS.surfaceLow,
  },

  speedButtonActive: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primary,
  },

  speedText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  speedTextActive: {
    color: COLORS.primary,
  },

  twoColumns: {
    flexDirection: "row",
    gap: 12,
  },

  columnCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 14,
  },

  smallButton: {
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingVertical: 11,
    alignItems: "center",
    marginBottom: 9,
  },

  smallButtonText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  safeButton: {
    backgroundColor: "#3d4759",
  },

  lastCommandBox: {
    marginTop: 16,
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },

  lastCommandLabel: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 4,
  },

  lastCommandText: {
    color: COLORS.text,
    fontSize: 13,
  },

  feedback: {
    marginTop: 12,
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
  },

  disconnectedText: {
    color: "#ffb4ab",
    fontWeight: "800",
    textAlign: "center",
  },
});