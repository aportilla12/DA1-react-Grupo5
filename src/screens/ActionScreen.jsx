import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import TopAppBar from "../components/TopAppBar";
import BottomNavBar from "../components/BottomNavBar";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useRobot } from "../context/RobotContext";
import {
  getActions,
  executeAction,
  saveCommandHistory,
  getCommandHistory,
} from "../services/api";

import { styles } from "../styles/actionStyles";

const ACTION_LABELS = {
  hello: "Saludar",
  stretch: "Estirar",
  dance1: "Baile 1",
  dance2: "Baile 2",
  heart: "Corazón",
  flips: "Volteretas",
  balance_stand: "Balance",
  recovery_stand: "Recuperarse",
  wave_hand: "Saludar mano",
  wave_hand_turn: "Saludo giro",
  shake_hand: "Dar mano",
  high_stand: "Postura alta",
  low_stand: "Postura baja",
  release_arm: "Soltar brazo",
  shake_hand_arm: "Dar mano brazo",
  high_five: "Chocar cinco",
  hug: "Abrazo",
  clap: "Aplaudir",
};

const ACTION_ICONS = {
  hello: "👋",
  stretch: "🧘",
  dance1: "🕺",
  dance2: "💃",
  heart: "💙",
  flips: "🤸",
  balance_stand: "⚖️",
  recovery_stand: "↺",
  wave_hand: "👋",
  wave_hand_turn: "🔄",
  shake_hand: "🤝",
  high_stand: "⬆️",
  low_stand: "⬇️",
  release_arm: "🦾",
  shake_hand_arm: "🤝",
  high_five: "✋",
  hug: "🫂",
  clap: "👏",
};

function formatActionName(actionName) {
  if (!actionName) return "Acción";

  if (ACTION_LABELS[actionName]) return ACTION_LABELS[actionName];

  return String(actionName)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getActionIcon(actionName) {
  return ACTION_ICONS[actionName] || "▣";
}

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
      setActions(data.actions || data || []);
    } catch (e) {
      setFeedback(e.message || "No se pudieron cargar las acciones.");
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

    const actionName = actionItem.name || actionItem;

    setLoadingExecute(true);
    setFeedback("");

    try {
      await executeAction(token, actionName);
      setFeedback(`Acción "${formatActionName(actionName)}" ejecutada correctamente.`);
      await recordCommand(formatActionName(actionName), true);
    } catch (e) {
      const errorMessage = e.message || `Error al ejecutar "${actionName}"`;
      setFeedback(errorMessage);
      await recordCommand(formatActionName(actionName), false, errorMessage);
    } finally {
      setLoadingExecute(false);
    }
  };

  if (!isConnected) {
    return (
      <View style={styles.screen}>
        <TopAppBar />
        <View style={styles.disconnectedContent}>
          <Text style={styles.title}>Acciones del Robot</Text>

          <View style={styles.disconnectedBox}>
            <Text style={styles.disconnectedText}>
              Primero tenés que conectar el robot para ver las acciones.
            </Text>
          </View>
        </View>

        <BottomNavBar navigation={navigation} active="Acciones" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TopAppBar />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Acciones del Robot</Text>
        <Text style={styles.subtitle}>
          Ejecutá protocolos disponibles para el robot conectado.
        </Text>

        {feedback ? (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        ) : null}

        {loadingActions ? (
          <ActivityIndicator size="large" color="#b9c7e4" />
        ) : actions.length > 0 ? (
          <View style={styles.grid}>
            {actions.map((action, idx) => {
              const actionName = action.name || action;
              const label = formatActionName(actionName);
              const icon = getActionIcon(actionName);

              return (
                <TouchableOpacity
                  key={`${actionName}-${idx}`}
                  style={[
                    styles.actionButton,
                    loadingExecute && styles.actionButtonDisabled,
                  ]}
                  disabled={loadingExecute}
                  onPress={() => handleExecuteAction(action)}
                >
                  <Text style={styles.actionIcon}>{icon}</Text>
                  <Text style={styles.actionText}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyText}>No hay acciones disponibles.</Text>
        )}

        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Últimas acciones enviadas</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Historial")}>
            <Text style={styles.viewAll}>Ver Todo</Text>
          </TouchableOpacity>
        </View>

        {localHistory.length > 0 ? (
          localHistory.map((cmd, idx) => {
            const isSuccess = cmd.status === "success";

            return (
              <View key={idx} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <View
                    style={[
                      styles.historyIconBox,
                      !isSuccess && styles.historyIconBoxError,
                    ]}
                  >
                    <Text style={styles.historyIcon}>
                      {getActionIcon(cmd.action)}
                    </Text>
                  </View>

                  <View>
                    <Text style={styles.historyAction}>{cmd.action}</Text>
                    <Text style={styles.historyTime}>
                      {cmd.timestamp
                        ? new Date(cmd.timestamp).toLocaleTimeString()
                        : ""}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    isSuccess ? styles.statusOk : styles.statusError,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isSuccess ? styles.statusOkText : styles.statusErrorText,
                    ]}
                  >
                    {isSuccess ? "● OK" : "● ERROR"}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>Todavía no se enviaron acciones.</Text>
        )}
      </ScrollView>
      <BottomNavBar navigation={navigation} active="Acciones" />
    </View>
  );
}