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

function getActionName(actionItem) {
  if (!actionItem) return "";
  if (typeof actionItem === "string") return actionItem;
  return actionItem.name || actionItem.action || actionItem.action_name || "";
}

function normalizeActions(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.actions)) return data.actions;
  if (Array.isArray(data?.available_actions)) return data.available_actions;
  return [];
}

function formatActionName(actionName) {
  if (!actionName) return "Acción";

  if (ACTION_LABELS[actionName]) return ACTION_LABELS[actionName];

  return String(actionName)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getActionIcon(actionNameOrLabel) {
  const raw = String(actionNameOrLabel || "");
  const normalized = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "_");

  if (ACTION_ICONS[raw]) return ACTION_ICONS[raw];
  if (ACTION_ICONS[normalized]) return ACTION_ICONS[normalized];

  if (normalized.includes("saludar")) return "👋";
  if (normalized.includes("baile") || normalized.includes("dance")) return "🕺";
  if (normalized.includes("corazon") || normalized.includes("heart")) return "💙";
  if (normalized.includes("voltereta") || normalized.includes("flip")) return "🤸";
  if (normalized.includes("balance")) return "⚖️";
  if (normalized.includes("mano") || normalized.includes("hand")) return "🤝";
  if (normalized.includes("abrazo") || normalized.includes("hug")) return "🫂";
  if (normalized.includes("aplaudir") || normalized.includes("clap")) return "👏";

  return "▣";
}

export default function ActionScreen({ navigation }) {
  const { token, username } = useAuth();
  const { connectionState, robotType } = useRobot();
  const isFocused = useIsFocused();

  const [actions, setActions] = useState([]);
  const [loadingActions, setLoadingActions] = useState(false);
  const [executingAction, setExecutingAction] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [localHistory, setLocalHistory] = useState([]);

  const isConnected = connectionState === "connected";

  useEffect(() => {
    if (isConnected && token) {
      fetchActions();
    } else {
      setActions([]);
    }
  }, [isConnected, token, robotType]);

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
      setFeedback("");

      const data = await getActions(token);
      const normalized = normalizeActions(data);

      setActions(normalized);
    } catch (e) {
      setActions([]);
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

    const actionName = getActionName(actionItem);
    const actionLabel = formatActionName(actionName);

    if (!actionName) {
      setFeedback("Acción inválida.");
      return;
    }

    setExecutingAction(actionName);
    setFeedback("");

    try {
      await executeAction(token, actionName);

      setFeedback(`Acción "${actionLabel}" ejecutada correctamente.`);
      await recordCommand(actionLabel, true);
    } catch (e) {
      const errorMessage = e.message || `Error al ejecutar "${actionLabel}"`;
      setFeedback(errorMessage);
      await recordCommand(actionLabel, false, errorMessage);
    } finally {
      setExecutingAction(null);
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
              const actionName = getActionName(action);
              const label = formatActionName(actionName);
              const icon = getActionIcon(actionName);
              const isExecuting = executingAction === actionName;

              return (
                <TouchableOpacity
                  key={`${actionName}-${idx}`}
                  style={[
                    styles.actionButton,
                    executingAction && styles.actionButtonDisabled,
                  ]}
                  disabled={!!executingAction}
                  onPress={() => handleExecuteAction(action)}
                >
                  {isExecuting ? (
                    <ActivityIndicator size="small" color="#64FFDA" />
                  ) : (
                    <>
                      <Text style={styles.actionIcon}>{icon}</Text>
                      <Text style={styles.actionText}>{label}</Text>
                    </>
                  )}
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