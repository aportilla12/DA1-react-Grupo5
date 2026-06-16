import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import BottomNavBar from "../components/BottomNavBar";
import { register } from "../services/api";
import { styles } from "../styles/registerStyles";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = useMemo(() => {
    if (!password) return 0;

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return Math.min(score, 4);
  }, [password]);

  const strengthLabel = useMemo(() => {
    if (passwordStrength <= 1) return "BAJA";
    if (passwordStrength === 2) return "MEDIA";
    if (passwordStrength === 3) return "ALTA";
    return "FUERTE";
  }, [passwordStrength]);

  const handleRegister = async () => {
    setError("");

    if (!username || !email || !password || !confirmPassword) {
      setError("Completá todos los campos");
      Alert.alert("Error", "Completá todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (!acceptedTerms) {
      setError("Debés aceptar los protocolos de seguridad");
      Alert.alert("Error", "Debés aceptar los protocolos de seguridad");
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);

      Alert.alert("Éxito", "Usuario creado. Podés iniciar sesión.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (e) {
      const message = e.message || "No se pudo registrar";
      setError(message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>⚙️</Text>
          <Text style={styles.headerTitle}>Unitree Control</Text>
        </View>

        <Text style={styles.headerSignal}>⌁</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <View style={styles.identity}>
            <View style={styles.logoBox}>
              <Text style={styles.logoIcon}>👥</Text>
            </View>

            <Text style={styles.title}>Registro</Text>
            <Text style={styles.subtitle}>
              Configurá tu terminal de enlace para control robótico.
            </Text>
          </View>

          <View style={styles.form}>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>USUARIO</Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre de usuario"
                  placeholderTextColor="#666a73"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="username"
                  textContentType="username"
                  importantForAutofill="yes"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EMAIL</Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#666a73"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  importantForAutofill="yes"
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
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  textContentType="password"
                  importantForAutofill="yes"
                />
              </View>

              <View style={styles.passwordStrength}>
                {[1, 2, 3, 4].map((item) => (
                  <View
                    key={item}
                    style={[
                      styles.strengthBar,
                      item <= passwordStrength && styles.strengthBarActive,
                    ]}
                  />
                ))}
                <Text style={styles.strengthText}>{strengthLabel}</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CONFIRMAR CONTRASEÑA</Text>
              <View
                style={[
                  styles.inputWrapper,
                  confirmPassword &&
                    password === confirmPassword &&
                    styles.inputWrapperFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#666a73"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.hint}>
                Las contraseñas deben coincidir para la sincronización.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxActive,
                ]}
              />

              <Text style={styles.termsText}>
                Acepto los{" "}
                <Text style={styles.termsLink}>
                  Protocolos de Seguridad
                </Text>{" "}
                y el Uso de Datos Telemetricos.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Validando..." : "Registrarse  ›"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginLinkText}>YA TENGO CUENTA ↪</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoPanel}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Encryption</Text>
              <Text style={styles.infoValue}>AES-256</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Network</Text>
              <Text style={styles.infoValue}>Node.US_West</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}