import React from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";
import { useRobot } from "../context/RobotContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ConnectionScreen from "../screens/ConnectionScreen";
import MovementScreen from "../screens/MovementScreen";
import ActionsScreen from "../screens/ActionsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { loading, isAuthenticated } = useAuth();
  const { connectionState } = useRobot();

  console.log(
    "[AppNavigator] loading=",
    loading,
    "isAuthenticated=",
    isAuthenticated
  );

  if (loading) {
    console.log("[AppNavigator] mostrando spinner...");
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log(
    "[AppNavigator] navegando a:",
    isAuthenticated ? "Conexión" : "Login"
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => {
          if (!isAuthenticated) return null;
          const color = connectionState === "connected" ? "#22c55e" : connectionState === "error" ? "#ef4444" : "#94a3b8";
          const label = connectionState === "connected" ? "Conectado" : connectionState === "error" ? "Error" : "Desconectado";
          return (
            <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color, marginRight: 6 }} />
              <Text style={{ fontSize: 12, fontWeight: "bold", color: "#334155" }}>
                {label}
              </Text>
            </View>
          );
        }
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Conexión" component={ConnectionScreen} />
          <Stack.Screen name="Movimiento" component={MovementScreen} />
          <Stack.Screen name="Acciones" component={ActionsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registro" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}