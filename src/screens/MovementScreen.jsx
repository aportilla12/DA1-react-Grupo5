import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import { useAuth } from "../context/AuthContext";
import { useRobot } from "../context/RobotContext";
import JoystickControl from "../components/JoystickControl";

import {
  moveRobot,
  stopRobot,
  standupRobot,
  sitdownRobot,
  dampRobot,
  handstandRobot,
  freeboundRobot,
  freeavoidRobot,
  walkuprightRobot,
  crossstepRobot,
  freejumpRobot,
  saveCommandHistory,
} from "../services/api";

export default function MovementScreen({ navigation }) {
  const { token } = useAuth();
  const { connectionState, robotType } = useRobot();

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [lastCommand, setLastCommand] = useState("");

  const isConnected = connectionState === "connected";

  const currentRobotLabel =
    robotType === "g1" ? "🤖 G1 Humanoide" : "🐕 Go2 Cuadrupedo";

  const recordCommand = async (action, success, details = null) => {
    if (!token) return;
    try {
      await saveCommandHistory(token, robotType, action, success ? "success" : "failed", details);
    } catch (e) {
      console.log("[MovementScreen] recordCommand error:", e.message);
    }
  };

  const sendMove = async (label, vx, vy, vyaw) => {
    if (!isConnected || !token) return;

    setLoading(true);
    setFeedback("");
    setLastCommand(label);

    try {
      await moveRobot(token, vx, vy, vyaw);
      setFeedback(`${label} enviado correctamente`);
      await recordCommand(label, true, `vx=${vx} vy=${vy} vyaw=${vyaw}`);
    } catch (e) {
      const errorMessage = e.message || "Error al enviar movimiento";
      setFeedback(errorMessage);
      await recordCommand(label, false, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const sendSimpleCommand = async (label, commandFn) => {
    if (!isConnected || !token) return;

    setLoading(true);
    setFeedback("");
    setLastCommand(label);

    try {
      await commandFn(token);
      setFeedback(`${label} enviado correctamente`);
      await recordCommand(label, true);
    } catch (e) {
      const errorMessage = e.message || `Error al ejecutar ${label}`;
      setFeedback(errorMessage);
      await recordCommand(label, false, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const sendToggleCommand = async (label, commandFn, enable = true) => {
    if (!isConnected || !token) return;

    setLoading(true);
    setFeedback("");
    setLastCommand(label);

    try {
      await commandFn(token, enable);
      setFeedback(`${label} enviado correctamente`);
      await recordCommand(label, true, `enable=${enable}`);
    } catch (e) {
      const errorMessage = e.message || `Error al ejecutar ${label}`;
      setFeedback(errorMessage);
      await recordCommand(label, false, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleJoystickMove = async (vx, vy, vyaw) => {
    if (!isConnected || !token) return;

    try {
      await moveRobot(token, vx, vy, vyaw);
      setLastCommand(`Joystick vx=${vx} vy=${vy} vyaw=${vyaw}`);
      await recordCommand("Joystick", true, `vx=${vx} vy=${vy} vyaw=${vyaw}`);
    } catch (e) {
      setFeedback(e.message || "Error al mover con joystick");
      await recordCommand("Joystick", false, e.message || "Error al mover con joystick");
    }
  };

  const handleJoystickStop = async () => {
    if (!isConnected || !token) return;

    try {
      await stopRobot(token);
      setLastCommand("Stop por joystick");
      setFeedback("Robot detenido");
      await recordCommand("Detener (Joystick)", true);
    } catch (e) {
      setFeedback(e.message || "Error al detener con joystick");
      await recordCommand("Detener (Joystick)", false, e.message || "Error al detener con joystick");
    }
  };

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Control de Movimiento</Text>

        <View style={styles.disconnectedBox}>
          <Text style={styles.disconnectedText}>
            Primero tenes que conectar el robot.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Control de Movimiento</Text>

      <View style={styles.robotBox}>
        <Text style={styles.robotText}>{currentRobotLabel}</Text>
        <Text style={styles.connectedText}>Estado: conectado</Text>
      </View>

      <Text style={styles.sectionTitle}>Controles direccionales</Text>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.directionButton}
          disabled={loading}
          onPress={() => sendMove("Adelante", 0.3, 0, 0)}
        >
          <Text style={styles.arrow}>↑</Text>
          <Text style={styles.buttonText}>Adelante</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.directionButton}
            disabled={loading}
            onPress={() => sendMove("Izquierda", 0, 0.3, 0)}
          >
            <Text style={styles.arrow}>←</Text>
            <Text style={styles.buttonText}>Izquierda</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.directionButton, styles.stopButton]}
            disabled={loading}
            onPress={() => sendSimpleCommand("Detener", stopRobot)}
          >
            <Text style={styles.arrow}>■</Text>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.directionButton}
            disabled={loading}
            onPress={() => sendMove("Derecha", 0, -0.3, 0)}
          >
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.buttonText}>Derecha</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.directionButton}
          disabled={loading}
          onPress={() => sendMove("Atras", -0.3, 0, 0)}
        >
          <Text style={styles.arrow}>↓</Text>
          <Text style={styles.buttonText}>Atras</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Postura</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          disabled={loading}
          onPress={() => sendSimpleCommand("Pararse", standupRobot)}
        >
          <Text style={styles.actionText}>Pararse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          disabled={loading}
          onPress={() => sendSimpleCommand("Sentarse", sitdownRobot)}
        >
          <Text style={styles.actionText}>Sentarse</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.actionButton, styles.fullButton]}
        disabled={loading}
        onPress={() => sendSimpleCommand("Damp", dampRobot)}
      >
        <Text style={styles.actionText}>Modo amortiguado</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Joystick virtual</Text>

      <JoystickControl
        disabled={!isConnected || loading}
        onMove={handleJoystickMove}
        onStop={handleJoystickStop}
      />

      <Text style={styles.sectionTitle}>Extras por robot</Text>

      {robotType === "go2" ? (
        <View style={styles.extraBox}>
          <Text style={styles.extraTitle}>Extras Go2</Text>

          <TouchableOpacity
            style={styles.extraButton}
            disabled={loading}
            onPress={() => sendToggleCommand("Handstand", handstandRobot, true)}
          >
            <Text style={styles.extraText}>Parada de Manos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.extraButton}
            disabled={loading}
            onPress={() => sendToggleCommand("Freebound", freeboundRobot, true)}
          >
            <Text style={styles.extraText}>Salto Libre</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.extraButton}
            disabled={loading}
            onPress={() => sendToggleCommand("Freeavoid", freeavoidRobot, true)}
          >
            <Text style={styles.extraText}>Esquivar Obstaculos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.extraBox}>
          <Text style={styles.extraTitle}>Extras G1</Text>

          <TouchableOpacity
            style={styles.extraButton}
            disabled={loading}
            onPress={() =>
              sendToggleCommand("Walk Upright", walkuprightRobot, true)
            }
          >
            <Text style={styles.extraText}>Caminar Erguido</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.extraButton}
            disabled={loading}
            onPress={() => sendToggleCommand("Cross Step", crossstepRobot, true)}
          >
            <Text style={styles.extraText}>Paso Cruzado</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.extraButton}
            disabled={loading}
            onPress={() => sendToggleCommand("Free Jump", freejumpRobot, true)}
          >
            <Text style={styles.extraText}>Salto Libre</Text>
          </TouchableOpacity>
        </View>
      )}

      {lastCommand ? (
        <View style={styles.lastCommandBox}>
          <Text style={styles.lastCommandLabel}>Ultimo comando</Text>
          <Text style={styles.lastCommandText}>{lastCommand}</Text>
        </View>
      ) : null}

      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate("Historial")}
      >
        <Text style={styles.historyButtonText}>Ver historial</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#f8fafc",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
  },
  robotBox: {
    backgroundColor: "#dcfce7",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  robotText: {
    color: "#166534",
    fontWeight: "bold",
    fontSize: 16,
  },
  connectedText: {
    color: "#166534",
    marginTop: 4,
  },
  disconnectedBox: {
    backgroundColor: "#fee2e2",
    borderRadius: 14,
    padding: 16,
  },
  disconnectedText: {
    color: "#991b1b",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#334155",
    marginTop: 22,
    marginBottom: 12,
  },
  controls: {
    alignItems: "center",
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  directionButton: {
    width: 95,
    height: 82,
    backgroundColor: "#3b82f6",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  stopButton: {
    backgroundColor: "#ef4444",
  },
  arrow: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#64748b",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    minHeight: 48,
  },
  fullButton: {
    marginTop: 12,
    flex: 0,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  extraBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 10,
  },
  extraTitle: {
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 4,
  },
  extraButton: {
    backgroundColor: "#0f172a",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  extraText: {
    color: "#fff",
    fontWeight: "bold",
  },
  lastCommandBox: {
    marginTop: 20,
    backgroundColor: "#fef9c3",
    borderRadius: 12,
    padding: 12,
  },
  lastCommandLabel: {
    color: "#854d0e",
    fontWeight: "bold",
    marginBottom: 4,
  },
  lastCommandText: {
    color: "#854d0e",
  },
  feedback: {
    marginTop: 16,
    textAlign: "center",
    color: "#0f172a",
    fontWeight: "bold",
  },
  historyButton: {
    marginTop: 24,
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  historyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});