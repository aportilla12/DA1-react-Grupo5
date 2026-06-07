import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRobot } from "../context/RobotContext";

export default function TopAppBar({ showLogout = false, onLogout }) {
  const { connectionState } = useRobot();

  const isConnected = connectionState === "connected";

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerIcon}>⚙️</Text>
        <Text style={styles.headerTitle}>Unitree Control</Text>
      </View>

      <View style={styles.headerRight}>
        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isConnected ? "#22c55e" : "#94a3b8" },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: isConnected ? "#22c55e" : "#94a3b8" },
            ]}
          >
            {isConnected ? "CONECTADO" : "DESCONECTADO"}
          </Text>
        </View>

        {showLogout && (
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 58,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#44474d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#131315",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    fontSize: 20,
  },
  headerTitle: {
    color: "#b9c7e4",
    fontSize: 17,
    fontWeight: "800",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f21",
    borderWidth: 1,
    borderColor: "#44474d",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  logoutButton: {
    backgroundColor: "#690005",
    borderWidth: 1,
    borderColor: "#ef4444",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  logoutText: {
    color: "#ffb4ab",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
});