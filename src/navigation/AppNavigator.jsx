import React from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ConnectionScreen from "../screens/ConnectionScreen";
import MovementScreen from "../screens/MovementScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ActionScreen from "../screens/ActionScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#131315" }}>
        <ActivityIndicator size="large" color="#b9c7e4" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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