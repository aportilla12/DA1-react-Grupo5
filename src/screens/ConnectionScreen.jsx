import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import TopAppBar from "../components/TopAppBar";
import BottomNavBar from "../components/BottomNavBar";
import { useAuth } from "../context/AuthContext";
import { useRobot } from "../context/RobotContext";
import { getCommandHistory } from "../services/api";
import { useIsFocused } from "@react-navigation/native";
import { styles } from "../styles/connectionStyles";


const ROBOTS = {
  go2: {
    label: "Unitree Go2",
    emoji: "🐾",
    description: "Quadruped Bionic",
  },
  g1: {
    label: "Unitree G1",
    emoji: "🤖",
    description: "Humanoid Agent",
  },
};

const STATE_LABEL = {
  connected: "Conectado",
  disconnected: "Desconectado",
  error: "Error",
};

const STATE_ICON = {
  connected: "🔗",
  disconnected: "🔌",
  error: "⚠️",
};

export default function ConnectionScreen({ navigation }) {
  const {
    robotType,
    setRobotType,
    networkInterface,
    setNetworkInterface,
    connectionState,
    statusData,
    isReconnecting,
    connect,
    disconnect,
  } = useRobot();

  const { logout, token, username } = useAuth();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [combinedHistory, setCombinedHistory] = useState([]);

  useEffect(() => {
    if (isFocused && token && username) {
      loadCombinedHistory();
    }
  }, [isFocused, token, username]);

  const loadCombinedHistory = async () => {
    try {
      const history = await getCommandHistory(token, username);
      setCombinedHistory(history.slice(0, 5));
    } catch (e) {
      console.log("[ConnectionScreen] Error loading history:", e.message);
    }
  };

  const getRobotEmoji = (type) => ROBOTS[type]?.emoji || "❓";

  const handleConnect = async () => {
    setError("");
    setLoading(true);

    try {
      await connect();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setError("");
    setLoading(true);

    try {
      await disconnect();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const statusText = isReconnecting
    ? "Reconectando..."
    : STATE_LABEL[connectionState];

  return (
    <View style={styles.screen}>
      <TopAppBar showLogout onLogout={logout} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.card, styles.statusCard]}>
          <View>
            <Text style={styles.labelCaps}>SISTEMA CENTRAL</Text>
            <Text style={styles.statusTitle}>Estado: {statusText}</Text>
          </View>

          <View style={styles.statusIconBox}>
            <Text style={styles.statusIcon}>{STATE_ICON[connectionState]}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>SELECCIONAR ROBOT</Text>

        <View style={styles.robotSelector}>
          {Object.entries(ROBOTS).map(([key, robot]) => {
            const selected = robotType === key;
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.robotCard,
                  selected && styles.robotCardSelected,
                ]}
                onPress={() => setRobotType(key)}
              >
                <View style={styles.robotTop}>
                  <View style={styles.robotIconBox}>
                    <Text style={styles.robotIcon}>{robot.emoji}</Text>
                  </View>
                  <View
                    style={[
                      styles.robotBadge,
                      key === "go2"
                        ? styles.robotBadgeAvailable
                        : styles.robotBadgeUnavailable,
                    ]}
                  >
                    <Text
                      style={[
                        styles.robotBadgeText,
                        key === "go2"
                          ? styles.robotBadgeTextAvailable
                          : styles.robotBadgeTextUnavailable,
                      ]}
                    >
                      {robot.badge}
                    </Text>
                  </View>
                </View>

                <Text style={styles.robotName}>{robot.label}</Text>
                <Text style={styles.robotDescription}>
                  {robot.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.card, styles.networkCard]}>
          <Text style={styles.networkHeader}>‹› CONFIGURACIÓN DE RED</Text>

          <Text style={styles.labelCaps}>INTERFAZ DE RED</Text>

          <TextInput
            style={styles.input}
            value={networkInterface}
            onChangeText={setNetworkInterface}
            autoCapitalize="none"
            placeholder="eth0"
            placeholderTextColor="#666a73"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.connectButton,
              (loading || connectionState === "connected") &&
                styles.buttonDisabled,
            ]}
            onPress={handleConnect}
            disabled={loading || connectionState === "connected"}
          >
            <Text style={styles.connectText}>
               {loading ? "CONECTANDO..." : "CONECTAR"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.disconnectButton,
              (loading || connectionState === "disconnected") &&
                styles.buttonDisabled,
            ]}
            onPress={handleDisconnect}
            disabled={loading || connectionState === "disconnected"}
          >
            <Text style={styles.disconnectText}>
              ⛓ {loading ? "DESCONECTANDO..." : "DESCONECTAR"}
            </Text>
          </TouchableOpacity>
        </View>

        {combinedHistory.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>ÚLTIMOS COMANDOS</Text>

            {combinedHistory.map((cmd, idx) => (
              <View key={idx} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyRobot}>
                    {getRobotEmoji(cmd.robotType)} {cmd.action}
                  </Text>

                  <Text
                    style={[
                      styles.historyStatus,
                      cmd.status === "success"
                        ? styles.historySuccess
                        : styles.historyFailed,
                    ]}
                  >
                    {cmd.status === "success" ? "OK" : "Error"}
                  </Text>
                </View>

                <Text style={styles.historyTime}>
                  {cmd.timestamp
                    ? new Date(cmd.timestamp).toLocaleTimeString()
                    : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {statusData && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>DIAGNOSTIC_LOG</Text>

            <View style={styles.diagnostics}>
              <Text style={styles.diagnosticsText}>
                {JSON.stringify(statusData, null, 2)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      <BottomNavBar navigation={navigation} active="Conexion" />
    </View>
  );
}