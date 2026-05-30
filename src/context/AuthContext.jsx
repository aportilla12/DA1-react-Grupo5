import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient, { setAuthToken } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    console.log("[AuthContext] loadSession: buscando token en storage...");
    try {
      const savedToken = await AsyncStorage.getItem("token");
      console.log("[AuthContext] loadSession: token encontrado:", savedToken ? savedToken.slice(0, 20) + "..." : "ninguno");

      if (savedToken) {
        setToken(savedToken);
        setAuthToken(savedToken);
      } else {
        // TOKEN TEMPORAL PARA DESARROLLO - SACAR CUANDO ESTÉ EL LOGIN
        const devToken = await apiClient.post("/auth/token", {
          identifier: "admin",
          password: "changeme",
        }).then(r => r.data.access_token);
        console.log("[AuthContext] loadSession: token dev obtenido:", devToken.slice(0, 20) + "...");
        await AsyncStorage.setItem("token", devToken);
        setToken(devToken);
        setAuthToken(devToken);
      }
    } catch (e) {
      console.log("[AuthContext] loadSession: error:", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    console.log("[AuthContext] login: intentando con identifier:", email);
    const response = await apiClient.post("/auth/token", { identifier: email, password });
    const accessToken = response.data.access_token;
    console.log("[AuthContext] login: token recibido:", accessToken.slice(0, 20) + "...");
    await AsyncStorage.setItem("token", accessToken);
    setToken(accessToken);
    setAuthToken(accessToken);
    console.log("[AuthContext] login: token guardado y seteado");
  }

  async function register(username, email, password) {
    console.log("[AuthContext] register: registrando usuario:", username);
    await apiClient.post("/auth/register", { username, email, password });
    console.log("[AuthContext] register: usuario registrado OK");
  }

  async function logout() {
    console.log("[AuthContext] logout: borrando token");
    await AsyncStorage.removeItem("token");
    setToken(null);
    setAuthToken(null);
    console.log("[AuthContext] logout: token borrado");
  }

  console.log("[AuthContext] render: isAuthenticated=", isAuthenticated, "loading=", loading);

  return (
    <AuthContext.Provider value={{ token, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}