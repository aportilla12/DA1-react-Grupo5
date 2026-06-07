import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING, FONT } from "./theme";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    overflow: "hidden",
  },

  backgroundGlowTop: {
    position: "absolute",
    top: -120,
    left: -100,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: COLORS.primary,
    opacity: 0.08,
  },

  backgroundGlowBottom: {
    position: "absolute",
    bottom: -120,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.primary,
    opacity: 0.08,
  },

  container: {
    width: "100%",
    maxWidth: 390,
    alignItems: "center",
  },

  logoBox: {
    width: 82,
    height: 82,
    borderRadius: 14,
    backgroundColor: COLORS.primaryDark,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  logoIcon: {
    fontSize: 38,
  },

  appTitle: {
    fontSize: FONT.title,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: FONT.subtitle,
    letterSpacing: 3,
    color: COLORS.textSecondary,
    fontWeight: "700",
    marginBottom: 30,
  },

  card: {
    width: "100%",
    backgroundColor: "rgba(31,31,33,0.92)",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },

  cardTitle: {
    fontSize: FONT.heading,
    color: COLORS.primary,
    fontWeight: "700",
    marginBottom: 8,
  },

  titleUnderline: {
    width: 46,
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginBottom: 22,
  },

  fieldGroup: {
    marginBottom: 18,
  },

  label: {
    color: COLORS.textSecondary,
    fontSize: FONT.label,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 8,
  },

  inputWrapper: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceLow,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  inputIcon: {
    fontSize: 18,
    marginRight: 10,
    color: COLORS.muted,
  },

  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT.body,
    letterSpacing: 0.5,
  },

  eyeIcon: {
    fontSize: 18,
    color: COLORS.muted,
  },

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.muted,
  },

  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  optionText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  forgotText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  loginButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: COLORS.primaryDark,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  loginButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  footer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 34,
  },

  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },

  footerLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  securityRow: {
    flexDirection: "row",
    gap: 26,
    marginTop: 18,
    opacity: 0.55,
  },

  securityIcon: {
    color: COLORS.textSecondary,
    fontSize: 18,
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
});