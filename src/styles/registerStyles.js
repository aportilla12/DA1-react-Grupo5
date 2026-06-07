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
    backgroundColor: "rgba(19,19,21,0.96)",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  headerIcon: {
    fontSize: 22,
  },

  headerTitle: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: "800",
  },

  headerSignal: {
    color: COLORS.textSecondary,
    fontSize: 18,
  },

  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 26,
    paddingBottom: 40,
    alignItems: "center",
  },

  content: {
    width: "100%",
    maxWidth: 420,
  },

  identity: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.primaryDark,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  logoIcon: {
    fontSize: 28,
  },

  title: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  form: {
    width: "100%",
  },

  fieldGroup: {
    marginBottom: 16,
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

  inputWrapperFocused: {
    borderColor: COLORS.primary,
  },

  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT.body,
  },

  eyeIcon: {
    fontSize: 17,
  },

  passwordStrength: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 7,
  },

  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },

  strengthBarActive: {
    backgroundColor: COLORS.primary,
  },

  strengthText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginLeft: 6,
  },

  hint: {
    color: COLORS.textSecondary,
    opacity: 0.65,
    fontSize: 11,
    fontStyle: "italic",
    marginTop: 6,
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 8,
    marginBottom: 22,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 2,
  },

  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  termsText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },

  termsLink: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  button: {
    height: 54,
    borderRadius: 10,
    backgroundColor: COLORS.primaryDark,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  buttonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },

  loginLink: {
    marginTop: 28,
    alignItems: "center",
  },

  loginLinkText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },

  infoPanel: {
    marginTop: 34,
    backgroundColor: "rgba(31,31,33,0.75)",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    color: COLORS.textSecondary,
    opacity: 0.55,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  infoValue: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
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