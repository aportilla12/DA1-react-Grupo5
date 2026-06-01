import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useRobot } from "../context/RobotContext";
import { getCommandHistoryByRobot } from "../services/api";

export default function HistoryScreen() {
  const { token } = useAuth();
  const { robotType } = useRobot();
  const isFocused = useIsFocused();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRobotEmoji = (type) => (type === "g1" ? "🤖" : "🐕");
  const getRobotLabel = (type) => (type === "g1" ? "G1 Humanoide" : "Go2 Cuadrupedo");

  const loadHistory = useCallback(async () => {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const items = await getCommandHistoryByRobot(token, robotType);
      setHistory(Array.isArray(items) ? items : []);
    } catch (e) {
      setError(e.message || "Error al cargar historial");
    } finally {
      setLoading(false);
    }
  }, [token, robotType]);

  useEffect(() => {
    if (isFocused) {
      loadHistory();
    }
  }, [isFocused, loadHistory]);

  const renderItem = ({ item }) => {
    const action = item.action || item.command || "Comando";
    const status = item.status || (item.success ? "success" : "failed") || "unknown";
    const timestamp = item.timestamp || item.occurred_at || item.created_at || item.date || null;
    const details = item.details || item.message || "";
    const dateText = timestamp ? new Date(timestamp).toLocaleString() : "Sin fecha";

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.action}>{action}</Text>
          <Text style={[styles.status, status === "success" ? styles.success : styles.failed]}>
            {status === "success" ? "OK" : status === "failed" ? "Error" : status}
          </Text>
        </View>
        <Text style={styles.timestamp}>{dateText}</Text>
        {details ? <Text style={styles.details}>{details}</Text> : null}
      </View>
    );
  };

  if (loading && history.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de comandos</Text>
      <Text style={styles.robotLabel}>
        {getRobotEmoji(robotType)} {getRobotLabel(robotType)}
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={history}
        keyExtractor={(item, index) => `${item.id || item.timestamp || index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadHistory} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No hay comandos en el historial.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0f172a",
  },
  robotLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
    fontWeight: "600",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  action: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  status: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  success: {
    color: "#16a34a",
  },
  failed: {
    color: "#dc2626",
  },
  timestamp: {
    color: "#64748b",
    fontSize: 12,
    marginBottom: 8,
  },
  details: {
    color: "#475569",
    fontSize: 13,
  },
  error: {
    color: "#dc2626",
    marginBottom: 16,
    textAlign: "center",
  },
  empty: {
    marginTop: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#64748b",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
