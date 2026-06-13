import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import TopAppBar from "../components/TopAppBar";
import BottomNavBar from "../components/BottomNavBar";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useRobot } from "../context/RobotContext";
import { getCommandHistoryByRobot } from "../services/api";
import { styles } from "../styles/historyStyles";

export default function HistoryScreen({ navigation }) {
  const { token, username } = useAuth();
  const { robotType } = useRobot();

  const isFocused = useIsFocused();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRobotLabel = (type) =>
    type === "g1" ? "Unitree G1" : "Unitree Go2";

  const getActionIcon = (action = "") => {
    const value = action.toLowerCase();

    if (value.includes("forward") || value.includes("avanz")) return "➤";
    if (value.includes("turn") || value.includes("girar")) return "⟳";
    if (value.includes("sit") || value.includes("sentar")) return "⊖";
    if (value.includes("stand") || value.includes("parar")) return "⇧";
    if (value.includes("stop") || value.includes("detener")) return "■";
    if (value.includes("jump") || value.includes("salto")) return "✦";

    return "⌘";
  };

  const normalizeActionName = (item) => {
    return item.action || item.command || "COMANDO";
  };

  const normalizeStatus = (item) => {
    if (item.status) return item.status;
    return item.success ? "success" : "failed";
  };

  const normalizeTimestamp = (item) => {
    return (
      item.timestamp ||
      item.occurred_at ||
      item.created_at ||
      item.date ||
      null
    );
  };

  const loadHistory = useCallback(async () => {
    if (!token || !username) return;

    setError("");
    setLoading(true);

    try {
      const items = await getCommandHistoryByRobot(token, robotType, username);
      setHistory(Array.isArray(items) ? items : []);
    } catch (e) {
      setError(e.message || "Error al cargar historial");
    } finally {
      setLoading(false);
    }
  }, [token, robotType, username]);

  useEffect(() => {
    if (isFocused) {
      loadHistory();
    }
  }, [isFocused, loadHistory]);

  const renderItem = ({ item }) => {
    const action = normalizeActionName(item);
    const status = normalizeStatus(item);
    const timestamp = normalizeTimestamp(item);
    const details = item.details || item.message || "";
    const isSuccess = status === "success";

    const timeText = timestamp
      ? new Date(timestamp).toLocaleTimeString()
      : "Sin hora";

    return (
      <View style={[styles.card, !isSuccess && styles.cardFailed]}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconBox, !isSuccess && styles.iconBoxFailed]}>
            <Text style={styles.iconText}>{getActionIcon(action)}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.commandName}>{String(action).toUpperCase()}</Text>

            <View style={styles.metaRow}>
              <View
                style={[
                  styles.statusBadge,
                  isSuccess ? styles.statusSuccess : styles.statusFailed,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    isSuccess ? styles.successText : styles.failedText,
                  ]}
                >
                  {isSuccess ? "● OK" : "● FAIL"}
                </Text>
              </View>

              <Text style={styles.timeText}>{timeText}</Text>
            </View>

            {details ? <Text style={styles.details}>{details}</Text> : null}
          </View>
        </View>

        <Text style={styles.chevron}>›</Text>
      </View>
    );
  };

  if (loading && history.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b9c7e4" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TopAppBar />

      <View style={styles.container}>
        <Text style={styles.title}>Historial de comandos</Text>
        <Text style={styles.sessionText}>SESSION LOG · {new Date().toLocaleDateString()}</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <FlatList
          data={history}
          keyExtractor={(item, index) =>
            `${item.id || item.timestamp || index}`
          }
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadHistory}
              tintColor="#b9c7e4"
            />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>↺</Text>
                <Text style={styles.emptyText}>
                  Sin comandos registrados. La telemetría aparecerá acá.
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            <View style={styles.terminalBox}>
              <View style={styles.terminalHeader}>
                <Text style={styles.terminalTitle}>● LIVE_SYSTEM_LOG</Text>
                <Text style={styles.terminalVersion}>v2.4.0-STABLE</Text>
              </View>

              <View style={styles.terminalBody}>
                <Text style={styles.terminalLine}>
                  [SYS] Initializing telemetry stream...
                </Text>
                <Text style={styles.terminalLine}>
                  [AUTH] Operator session active
                </Text>
                <Text style={styles.terminalLine}>
                  [BOT] Current unit: {getRobotLabel(robotType)}
                </Text>
                <Text style={styles.terminalLine}>
                  [LOG] Commands loaded: {history.length}
                </Text>
              </View>
            </View>
          }
        />
      </View>
      <BottomNavBar navigation={navigation} active="Historial" />
    </View>
  );
}