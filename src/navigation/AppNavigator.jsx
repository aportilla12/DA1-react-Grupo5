import React from "react";
import { ActivityIndicator, Button, View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";
import { useRobot } from "../context/RobotContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ConnectionScreen from "../screens/ConnectionScreen";
import MovementScreen from "../screens/MovementScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ActionScreen from "../screens/ActionScreen";

const Stack = createNativeStackNavigator();

const ConnectionStatus = () => {
  const { connectionState } = useRobot();
  
  const statusColor = 
    connectionState === "connected" ? "#22c55e" : 
    connectionState === "disconnected" ? "#94a3b8" : "#ef4444";
    
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: statusColor, marginRight: 5 }} />
      <Text style={{ fontSize: 12, fontWeight: "bold", color: statusColor }}>
        {connectionState === "connected" ? "Conectado" : 
         connectionState === "disconnected" ? "Desconectado" : "Error"}
      </Text>
    </View>
  );
};

export default function AppNavigator() {
  const { loading, isAuthenticated, logout } = useAuth();

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
    isAuthenticated ? "Conexion" : "Login"
  );

  return (
    <Stack.Navigator
      screenOptions={
        isAuthenticated
          ? {
              headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ConnectionStatus />
                  <Button title="Cerrar sesion" onPress={logout} color="#ef4444" />
                </View>
              ),
            }
          : {}
      }
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Conexion" component={ConnectionScreen} />
          <Stack.Screen name="Movimiento" component={MovementScreen} />
          <Stack.Screen name="Acciones" component={ActionScreen} />
          <Stack.Screen name="Historial" component={HistoryScreen} />
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