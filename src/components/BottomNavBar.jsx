import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ITEMS = [
  { route: "Conexion", label: "Connect", icon: "🔗" },
  { route: "Movimiento", label: "Move", icon: "🕹️" },
  { route: "Acciones", label: "Actions", icon: "▦" },
  { route: "Historial", label: "History", icon: "↺" },
];

export default function BottomNavBar({ navigation, active }) {
  return (
    <View style={styles.container}>
      {ITEMS.map((item) => {
        const isActive = active === item.route;

        return (
          <TouchableOpacity
            key={item.route}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => navigation.navigate(item.route)}
          >
            <Text style={[styles.icon, isActive && styles.textActive]}>
              {item.icon}
            </Text>

            <Text style={[styles.label, isActive && styles.textActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 74,
    backgroundColor: "#1f1f21",
    borderTopWidth: 1,
    borderTopColor: "#343536",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  item: {
    minWidth: 65,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 14,
  },
  itemActive: {
    backgroundColor: "#0a192f",
    borderWidth: 1,
    borderColor: "#39475f",
  },
  icon: {
    fontSize: 17,
    color: "#8f9097",
  },
  label: {
    fontSize: 10,
    marginTop: 3,
    color: "#8f9097",
    fontWeight: "800",
  },
  textActive: {
    color: "#b9c7e4",
  },
});