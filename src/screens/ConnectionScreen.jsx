import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRobot } from "../context/RobotContext";

const ROBOTS = {
  go2: { label: "Go2", emoji: "🐕", description: "Cuadrúpedo" },
  g1:  { label: "G1",  emoji: "🤖", description: "Humanoide"  },
};

const STATE_COLOR = {
  connected:    "#22c55e",
  disconnected: "#94a3b8",
  error:        "#ef4444",
};

const STATE_LABEL = {
  connected:    "Conectado",
  disconnected: "Desconectado",
  error:        "Error",
};

export default function ConnectionScreen({ navigation}) {
  const {
    robotType, setRobotType,
    networkInterface, setNetworkInterface,
    connectionState,
    statusData,
    isReconnecting,
    connect,
    disconnect,
  } = useRobot();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("[ConnectionScreen] render: connectionState=", connectionState, "robotType=", robotType, "networkInterface=", networkInterface, "isReconnecting=", isReconnecting);

  const handleConnect = async () => {
    console.log("[ConnectionScreen] handleConnect: iniciando conexión con robotType=", robotType, "networkInterface=", networkInterface);
    setError("");
    setLoading(true);
    try {
      await connect();
      console.log("[ConnectionScreen] handleConnect: conexión exitosa");
    } catch (e) {
      console.log("[ConnectionScreen] handleConnect: error:", e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    console.log("[ConnectionScreen] handleDisconnect: desconectando...");
    setError("");
    setLoading(true);
    try {
      await disconnect();
      console.log("[ConnectionScreen] handleDisconnect: desconectado OK");
    } catch (e) {
      console.log("[ConnectionScreen] handleDisconnect: error:", e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Indicador de estado */}
      <View style={[styles.statusBadge, { backgroundColor: STATE_COLOR[connectionState] }]}>
        <Text style={styles.statusText}>
          {isReconnecting ? "🔄 Reconectando..." : STATE_LABEL[connectionState]}
        </Text>
      </View>

      {/* Selector de robot */}
      <Text style={styles.label}>Tipo de robot</Text>
      <View style={styles.robotSelector}>
        {Object.entries(ROBOTS).map(([key, robot]) => (
          <TouchableOpacity
            key={key}
            style={[styles.robotCard, robotType === key && styles.robotCardSelected]}
            onPress={() => {
              console.log("[ConnectionScreen] robotType cambiado a:", key);
              setRobotType(key);
            }}
          >
            <Text style={styles.robotEmoji}>{robot.emoji}</Text>
            <Text style={styles.robotLabel}>{robot.label}</Text>
            <Text style={styles.robotDesc}>{robot.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Interfaz de red */}
      <Text style={styles.label}>Interfaz de red</Text>
      <TextInput
        style={styles.input}
        value={networkInterface}
        onChangeText={(val) => {
          console.log("[ConnectionScreen] networkInterface cambiado a:", val);
          setNetworkInterface(val);
        }}
        autoCapitalize="none"
        placeholder="eth0"
      />

      {/* Error */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Botones */}
      <TouchableOpacity
        style={[styles.button, styles.buttonConnect, (loading || connectionState === "connected") && styles.buttonDisabled]}
        onPress={handleConnect}
        disabled={loading || connectionState === "connected"}
      >
        <Text style={styles.buttonText}>{loading && connectionState !== "connected" ? "Conectando..." : "Conectar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonDisconnect, (loading || connectionState === "disconnected") && styles.buttonDisabled]}
        onPress={handleDisconnect}
        disabled={loading || connectionState === "disconnected"}
      >
        <Text style={styles.buttonText}>{loading && connectionState === "connected" ? "Desconectando..." : "Desconectar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#0f172a" }]}
        onPress={() => navigation.navigate("Movimiento")}
      >
        <Text style={styles.buttonText}>Ir a Movimiento</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#0f172a" }]}
        onPress={() => navigation.navigate("Acciones")}
      >
        <Text style={styles.buttonText}>Ir a Acciones</Text>
      </TouchableOpacity>

      {/* Diagnóstico */}
      {statusData && (
        <>
          <Text style={styles.label}>Diagnóstico</Text>
          <View style={styles.diagnostics}>
            <Text style={styles.diagnosticsText}>
              {JSON.stringify(statusData, null, 2)}
            </Text>
          </View>
        </>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { padding: 20, paddingTop: 40 },
  statusBadge:      { borderRadius: 20, paddingVertical: 8, paddingHorizontal: 20, alignSelf: "center", marginBottom: 24 },
  statusText:       { color: "#fff", fontWeight: "bold", fontSize: 16 },
  label:            { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 8, marginTop: 16 },
  robotSelector:    { flexDirection: "row", gap: 12 },
  robotCard:        { flex: 1, borderWidth: 2, borderColor: "#e2e8f0", borderRadius: 12, padding: 16, alignItems: "center" },
  robotCardSelected:{ borderColor: "#3b82f6", backgroundColor: "#eff6ff" },
  robotEmoji:       { fontSize: 36 },
  robotLabel:       { fontWeight: "bold", fontSize: 16, marginTop: 4 },
  robotDesc:        { fontSize: 12, color: "#94a3b8" },
  input:            { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 8, padding: 10 },
  error:            { color: "#ef4444", textAlign: "center", marginTop: 8 },
  button:           { borderRadius: 10, padding: 14, alignItems: "center", marginTop: 12 },
  buttonConnect:    { backgroundColor: "#3b82f6" },
  buttonDisconnect: { backgroundColor: "#64748b" },
  buttonDisabled:   { opacity: 0.4 },
  buttonText:       { color: "#fff", fontWeight: "bold", fontSize: 16 },
  diagnostics:      { backgroundColor: "#1e293b", borderRadius: 10, padding: 16, marginTop: 8 },
  diagnosticsText:  { color: "#94a3b8", fontFamily: "monospace", fontSize: 12 },
});