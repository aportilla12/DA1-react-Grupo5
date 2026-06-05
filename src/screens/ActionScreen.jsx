import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useRobot } from "../context/RobotContext";
import {
  getActions,
  executeAction,
  saveCommandHistory,
  getCommandHistory
} from "../services/api";

export default function ActionScreen({ navigation }) {
  const { token, username } = useAuth();
  const { connectionState, robotType } = useRobot();
  const isFocused = useIsFocused();

  const [actions, setActions] = useState([]);
  const [loadingActions, setLoadingActions] = useState(false);
  const [loadingExecute, setLoadingExecute] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [localHistory, setLocalHistory] = useState([]);

  const isConnected = connectionState === "connected";

  useEffect(() => {
    if (isConnected && token) {
      fetchActions();
    }
  }, [isConnected, token]);

  useEffect(() => {
    if (isFocused && token && username) {
      loadHistory();
    }
  }, [isFocused, token, username]);

  const loadHistory = async () => {
    try {
      const history = await getCommandHistory(token, username);
      setLocalHistory(history.slice(0, 5));
    } catch (e) {
      console.log("[ActionScreen] Error loading history:", e.message);
    }
  };

  const fetchActions = async () => {
    try {
      setLoadingActions(true);
      const data = await getActions(token);
      // Asumimos que data es un array de acciones, por ejemplo [{ name: "action1", description: "..." }]
      // O tal vez es solo un array de strings ["action1", "action2"].
      // El backend unitree_robot_api: GET /actions -> return ["action1", "action2", ...]
      setActions(data.actions || data);
    } catch (e) {
      console.log("[ActionScreen] Error fetching actions:", e.message);
    } finally {
      setLoadingActions(false);
    }
  };

  const recordCommand = async (action, success, details = null) => {
    if (!token || !username) return;
    try {
      const newCmd = await saveCommandHistory(
        token,
        robotType,
        action,
        success ? "success" : "failed",
        details,
        username
      );
      setLocalHistory((prev) => [newCmd, ...prev].slice(0, 5));
    } catch (e) {
      console.log("[ActionScreen] recordCommand error:", e.message);
    }
  };

  const handleExecuteAction = async (actionItem) => {
    if (!isConnected || !token) return;
    
    // Si la accion es un objeto, usamos el name, si no, el string directo
    const actionName = actionItem.name || actionItem;

    setLoadingExecute(true);
    setFeedback("");
    
    try {
      await executeAction(token, actionName);
      setFeedback(`Acción "${actionName}" ejecutada correctamente.`);
      await recordCommand(actionName, true);
    } catch (e) {
      const errorMessage = e.message || `Error al ejecutar "${actionName}"`;
      setFeedback(errorMessage);
      await recordCommand(actionName, false, errorMessage);
    } finally {
      setLoadingExecute(false);
    }
  };

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Acciones del Robot</Text>
        <View style={styles.disconnectedBox}>
          <Text style={styles.disconnectedText}>
            Primero tenes que conectar el robot para ver las acciones.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Acciones del Robot</Text>
      
      {loadingActions ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : actions.length > 0 ? (
        <View style={styles.grid}>
          {actions.map((action, idx) => {
            const actionName = action.name || action;
            return (
              <TouchableOpacity
                key={idx}
                style={styles.actionButton}
                disabled={loadingExecute}
                onPress={() => handleExecuteAction(action)}
              >
                <Text style={styles.actionText}>{actionName}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <Text style={styles.emptyText}>No hay acciones disponibles.</Text>
      )}

      {feedback ? (
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      ) : null}

      {localHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Últimas acciones enviadas</Text>
          <View style={styles.historyList}>
            {localHistory.map((cmd, idx) => (
              <View key={idx} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyAction}>{cmd.action}</Text>
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
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#f8fafc",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 20,
  },
  disconnectedBox: {
    backgroundColor: "#fee2e2",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  disconnectedText: {
    color: "#941b1b",
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#64748b",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "45%",
    flexGrow: 1,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "capitalize",
  },
  emptyText: {
    color: "#64748b",
    fontSize: 16,
    fontStyle: "italic",
  },
  feedbackBox: {
    marginTop: 20,
    backgroundColor: "#dcfce7",
    padding: 12,
    borderRadius: 10,
  },
  feedbackText: {
    color: "#166534",
    fontWeight: "bold",
    textAlign: "center",
  },
  historyContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 10,
  },
  historyList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    padding: 12,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  historyAction: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    textTransform: "capitalize",
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  historySuccess: {
    color: "#16a34a",
  },
  historyFailed: {
    color: "#dc2626",
  },
  historyTime: {
    fontSize: 11,
    color: "#94a3b8",
  },
});