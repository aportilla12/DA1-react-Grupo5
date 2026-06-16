import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ITEMS = [
  { route: "Conexion", label: "Conexion" },
  { route: "Movimiento", label: "Movimiento" },
  { route: "Acciones", label: "Acciones" },
  { route: "Historial", label: "Historial" },
];

export default function BottomNavBar({ navigation, active }) {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        {ITEMS.map((item) => {
          const isActive = active === item.route;

          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.item, isActive && styles.itemActive]}
              onPress={() => navigation.navigate(item.route)}
            >

              <Text style={[styles.label, isActive && styles.textActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "#1f1f21",
    borderTopWidth: 1,
    borderTopColor: "#343536",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    borderRadius: 10,
  },
  itemActive: {
    backgroundColor: "#0a192f",
    borderWidth: 1,
    borderColor: "#39475f",
  },
  label: {
    fontSize: 10,
    color: "#8f9097",
    fontWeight: "800",
    textAlign: "center",
  },
  textActive: {
    color: "#b9c7e4",
  },
});