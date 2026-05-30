import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { register } from "../services/api";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  console.log("[RegisterScreen] render: loading=", loading, "error=", error, "success=", success);

  const handleRegister = async () => {
    console.log("[RegisterScreen] handleRegister: username=", username, "email=", email);
    setError("");
    if (!username || !email || !password || !confirmPassword) {
      console.log("[RegisterScreen] handleRegister: campos incompletos");
      setError("Completá todos los campos");
      Alert.alert("Error", "Completá todos los campos");
      return;
    }
    if (password !== confirmPassword) {
      console.log("[RegisterScreen] handleRegister: contraseñas no coinciden");
      setError("Las contraseñas no coinciden");
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      console.log("[RegisterScreen] handleRegister: registro exitoso");
      setSuccess(true);
      Alert.alert("Éxito", "Usuario creado. Podés iniciar sesión.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (e) {
      console.log("[RegisterScreen] handleRegister error completo:", e);
      console.log("[RegisterScreen] handleRegister error.message:", e.message);
      setError(e.message);
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>✅ Usuario creado</Text>
        <Button title="Ir al Login" onPress={() => navigation.navigate("Login")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button
        title={loading ? "Registrando..." : "Registrarse"}
        onPress={handleRegister}
        disabled={loading}
      />
      <Button
        title="Ya tengo cuenta"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12 },
  error: { color: "red", marginBottom: 12, textAlign: "center" },
});