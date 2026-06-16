import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import BottomNavBar from "../components/BottomNavBar";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles/loginStyles";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Completá usuario/email y contraseña");
      Alert.alert("Error", "Completá usuario/email y contraseña");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
    } catch (e) {
      const message = e.message || "Credenciales incorrectas";
      setError(message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      <View style={styles.container}>
        <View style={styles.logoBox}>
          <Text style={styles.logoIcon}>⚙️</Text>
        </View>

        <Text style={styles.appTitle}>Unitree Control</Text>
        <Text style={styles.subtitle}>SISTEMAS DE TELEMETRÍA V4.2</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar sesión</Text>
          <View style={styles.titleUnderline} />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>USUARIO O EMAIL</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Nombre de usuario o email"
                placeholderTextColor="#666a73"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>CONTRASEÑA</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#666a73"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>
                  {showPassword ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRemember(!remember)}
            >
              <View
                style={[
                  styles.checkbox,
                  remember && styles.checkboxActive,
                ]}
              />
              <Text style={styles.optionText}>Recordarme</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotText}>¿Olvidó contraseña?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? "INICIANDO..." : "INICIAR SESIÓN  →"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes una cuenta?</Text>

          <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
            <Text style={styles.footerLink}>Registrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}