import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import TopAppBar from "../components/TopAppBar";
import BottomNavBar from "../components/BottomNavBar";
import { useAuth } from "../context/AuthContext";
import { useRobot } from "../context/RobotContext";
import JoystickControl from "../components/JoystickControl";
import { styles } from "../styles/movementStyles";

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

const SPEED_VALUES = {
  precision: 0.25,
  normal: 0.45,
  fast: 0.7,
};

export default function MovementScreen({ navigation }) {
  const { token, username } = useAuth();
  const { connectionState, robotType } = useRobot();

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [lastCommand, setLastCommand] = useState("");
  const [speedMode, setSpeedMode] = useState("precision");
  const [joystickActive, setJoystickActive] = useState(false);

  const [telemetry, setTelemetry] = useState({
    vx: 0,
    vy: 0,
    vyaw: 0,
    status: "Detenido",
  });

  const isConnected = connectionState === "connected";

  const currentRobotLabel =
    robotType === "g1" ? "G1 Humanoide" : "Go2 Cuadrúpedo";

  const currentRobotIcon = robotType === "g1" ? "🤖" : "🐕";

  const updateTelemetry = (vx, vy, vyaw, status) => {
    setTelemetry({
      vx,
      vy,
      vyaw,
      status,
    });
  };

  const sendMove = async (label, vx, vy, vyaw) => {
    if (!isConnected || !token) return;

    setLoading(true);
    setFeedback("");
    setLastCommand(label);
    updateTelemetry(vx, vy, vyaw, label);

    try {
      await moveRobot(token, vx, vy, vyaw);
      setFeedback(`${label} enviado correctamente`);
      await saveCommandHistory(
        token,
        robotType,
        label,
        "success",
        `vx: ${vx.toFixed(2)}, vy: ${vy.toFixed(2)}`,
        username
      );
    } catch (e) {
      setFeedback(e.message || "Error al enviar movimiento");
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
      await saveCommandHistory(token, robotType, label, "success", null, username);

      if (label === "Detener") {
        updateTelemetry(0, 0, 0, "Detenido");
      }
    } catch (e) {
      await saveCommandHistory(token, robotType, label, "failed", e.message, username);
      setFeedback(e.message || `Error al ejecutar ${label}`);
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
      await saveCommandHistory(
        token,
        robotType,
        label,
        "success",
        enable ? "Activado" : "Desactivado",
        username
      );
    } catch (e) {
      await saveCommandHistory(token, robotType, label, "failed", e.message, username);
      setFeedback(e.message || `Error al ejecutar ${label}`);
    } finally {
      setLoading(false);
    }
  };

  const handleJoystickMove = async (vx, vy, vyaw) => {
    if (!isConnected || !token) return;

    try {
      await moveRobot(token, vx, vy, vyaw);
      setLastCommand(`Joystick vx=${vx} vy=${vy} vyaw=${vyaw}`);
    } catch (e) {
      setFeedback(e.message || "Error al mover con joystick");
    }
  };

  const handleJoystickStop = async () => {
    if (!isConnected || !token) return;

    try {
      await stopRobot(token);
      setLastCommand("Stop por joystick");
      setFeedback("Robot detenido");
    } catch (e) {
      setFeedback(e.message || "Error al detener con joystick");
    }
  };

  const speedValue = SPEED_VALUES[speedMode];

  if (!isConnected) {
    return (
      <View style={styles.screen}>
        <TopAppBar />


        <View style={styles.container}>
          <View style={styles.disconnectedBox}>
            <Text style={styles.disconnectedText}>
              Primero tenés que conectar el robot.
            </Text>
          </View>
        </View>
        <BottomNavBar navigation={navigation} active="Movimiento" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TopAppBar />

      <ScrollView scrollEnabled={!joystickActive} contentContainerStyle={styles.container}>
        <View style={[styles.card, styles.robotCard]}>
          <View style={styles.robotAvatar}>
            <Text style={styles.robotAvatarText}>{currentRobotIcon}</Text>
          </View>

          <View>
            <Text style={styles.robotTitle}>{currentRobotLabel}</Text>

            <View style={styles.batteryRow}>
              <Text style={styles.batteryText}>BATERÍA: 88%</Text>
              <View style={styles.batteryTrack}>
                <View style={styles.batteryFill} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.telemetryRow}>
          <View style={styles.telemetryCard}>
            <Text style={styles.sectionLabel}>TELEMETRÍA LINEAL</Text>

            <View style={styles.dataRow}>
              <Text style={styles.dataKey}>vx:</Text>
              <Text style={styles.dataValue}>{telemetry.vx.toFixed(2)} m/s</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataKey}>vy:</Text>
              <Text style={styles.dataValue}>{telemetry.vy.toFixed(2)} m/s</Text>
            </View>
          </View>

          <View style={styles.telemetryCard}>
            <Text style={styles.sectionLabel}>TELEMETRÍA ROTACIÓN</Text>

            <View style={styles.dataRow}>
              <Text style={styles.dataKey}>vyaw:</Text>
              <Text style={styles.dataValue}>
                {telemetry.vyaw.toFixed(2)} rad/s
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataKey}>STATUS:</Text>
              <Text style={styles.dataValue}>{telemetry.status}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.dpadCard]}>
          <Text style={styles.sectionLabel}>CONTROL DIRECCIONAL</Text>

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.dpadButton}
              disabled={loading}
              onPress={() => sendMove("Avanzando", speedValue, 0, 0)}
            >
              <Text style={styles.dpadText}>▲</Text>
            </TouchableOpacity>

            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={styles.dpadButton}
                disabled={loading}
                onPress={() => sendMove("Lateral izquierda", 0, speedValue, 0)}
              >
                <Text style={styles.dpadText}>◀</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dpadButton, styles.stopButton]}
                disabled={loading}
                onPress={() => sendSimpleCommand("Detener", stopRobot)}
              >
                <Text style={styles.dpadText}>■</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dpadButton}
                disabled={loading}
                onPress={() => sendMove("Lateral derecha", 0, -speedValue, 0)}
              >
                <Text style={styles.dpadText}>▶</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.dpadButton}
              disabled={loading}
              onPress={() => sendMove("Retrocediendo", -speedValue, 0, 0)}
            >
              <Text style={styles.dpadText}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        <JoystickControl
          disabled={!isConnected || loading}
          speedMode={speedMode}
          onMove={handleJoystickMove}
          onStop={handleJoystickStop}
          onTelemetryChange={setTelemetry}
          onTouchStart={() => setJoystickActive(true)}
          onTouchEnd={() => setJoystickActive(false)}
        />

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>MODO DE VELOCIDAD</Text>

          <View style={styles.speedRow}>
            {[
              ["precision", "PRECISIÓN"],
              ["normal", "NORMAL"],
              ["fast", "RÁPIDO"],
            ].map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.speedButton,
                  speedMode === key && styles.speedButtonActive,
                ]}
                onPress={() => setSpeedMode(key)}
              >
                <Text
                  style={[
                    styles.speedText,
                    speedMode === key && styles.speedTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.twoColumns}>
          <View style={styles.columnCard}>
            <Text style={styles.sectionLabel}>POSTURA</Text>

            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => sendSimpleCommand("Pararse", standupRobot)}
            >
              <Text style={styles.smallButtonText}>PARARSE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => sendSimpleCommand("Sentarse", sitdownRobot)}
            >
              <Text style={styles.smallButtonText}>SENTARSE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.smallButton]}
              onPress={() => sendSimpleCommand("Modo seguro", dampRobot)}
            >
              <Text style={styles.smallButtonText}>MODO SEGURO</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.columnCard}>
            <Text style={styles.sectionLabel}>EXTRAS</Text>

            {robotType === "go2" ? (
              <>
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() =>
                    sendToggleCommand("Parada de manos", handstandRobot, true)
                  }
                >
                  <Text style={styles.smallButtonText}>P. DE MANOS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() =>
                    sendToggleCommand("Salto libre", freeboundRobot, true)
                  }
                >
                  <Text style={styles.smallButtonText}>SALTO LIBRE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() =>
                    sendToggleCommand("Esquivar", freeavoidRobot, true)
                  }
                >
                  <Text style={styles.smallButtonText}>ESQUIVAR</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() =>
                    sendToggleCommand("Caminar erguido", walkuprightRobot, true)
                  }
                >
                  <Text style={styles.smallButtonText}>CAMINAR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() =>
                    sendToggleCommand("Paso cruzado", crossstepRobot, true)
                  }
                >
                  <Text style={styles.smallButtonText}>PASO CRUZADO</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() =>
                    sendToggleCommand("Salto libre", freejumpRobot, true)
                  }
                >
                  <Text style={styles.smallButtonText}>SALTO LIBRE</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {lastCommand ? (
          <View style={styles.lastCommandBox}>
            <Text style={styles.lastCommandLabel}>ÚLTIMO COMANDO</Text>
            <Text style={styles.lastCommandText}>{lastCommand}</Text>
          </View>
        ) : null}

        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      </ScrollView>
      <BottomNavBar navigation={navigation} active="Movimiento" />
    </View>
  );
}