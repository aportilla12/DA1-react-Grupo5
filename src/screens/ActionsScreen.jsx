import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRobot } from "../context/RobotContext";

export default function ActionsScreen() {
  const { availableActions, commandHistory, executeAction, loadActions, connectionState } = useRobot();
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    if (connectionState === "connected") {
      loadActions();
    }
  }, [connectionState, loadActions]);

  const handleActionPress = async (actionName) => {
    setLoadingAction(actionName);
    try {
      await executeAction(actionName);
    } catch {
      /* Error is handled in context */
    } finally {
      setLoadingAction(null);
    }
  };

  const renderActionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={() => handleActionPress(item.name || item)}
      disabled={loadingAction === (item.name || item)}
    >
      {loadingAction === (item.name || item) ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.actionText}>{item.name || item}</Text>
      )}
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }) => {
    const timeString = new Date(item.timestamp).toLocaleTimeString();
    const isSuccess = item.status === "success";
    return (
      <View style={styles.historyItem}>
        <Text style={styles.historyTime}>[{timeString}]</Text>
        <Text style={styles.historyAction}>{item.action}</Text>
        <Text style={[styles.historyStatus, isSuccess ? styles.successText : styles.errorText]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Acciones Disponibles</Text>
      <View style={styles.actionsContainer}>
        {availableActions && availableActions.length > 0 ? (
          <FlatList
            data={availableActions}
            keyExtractor={(item, index) => item.name ? item.name : item.toString() + index}
            renderItem={renderActionItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        ) : (
          <Text style={styles.emptyText}>No hay acciones disponibles</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Historial de Comandos</Text>
      <View style={styles.historyContainer}>
        {commandHistory && commandHistory.length > 0 ? (
          <FlatList
            data={commandHistory}
            keyExtractor={(item, index) => item.timestamp + index}
            renderItem={renderHistoryItem}
          />
        ) : (
          <Text style={styles.emptyText}>No hay comandos recientes</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 8,
    color: "#333",
  },
  actionsContainer: {
    flex: 1,
  },
  row: {
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#007BFF",
    padding: 15,
    margin: 5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  historyItem: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  historyTime: {
    color: "#666",
    marginRight: 10,
    fontSize: 14,
  },
  historyAction: {
    flex: 1,
    fontWeight: "500",
    color: "#333",
    fontSize: 14,
  },
  historyStatus: {
    fontWeight: "bold",
    fontSize: 12,
  },
  successText: {
    color: "green",
  },
  errorText: {
    color: "red",
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});