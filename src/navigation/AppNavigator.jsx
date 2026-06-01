import React from "react";
import { ActivityIndicator, Button, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ConnectionScreen from "../screens/ConnectionScreen";
import MovementScreen from "../screens/MovementScreen";
import HistoryScreen from "../screens/HistoryScreen";

const Stack = createNativeStackNavigator();

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
                <Button title="Cerrar sesion" onPress={logout} color="#ef4444" />
              ),
            }
          : {}
      }
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Conexion" component={ConnectionScreen} />
          <Stack.Screen name="Movimiento" component={MovementScreen} />
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