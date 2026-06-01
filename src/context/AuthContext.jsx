import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient, { setAuthToken } from "../services/api";

const AuthContext = createContext();

const decodeToken = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (e) {
    console.log("[decodeToken] error:", e.message);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
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
        const decoded = decodeToken(savedToken);
        const user = decoded?.sub || decoded?.username || decoded?.email || "user";
        setUsername(user);
        setToken(savedToken);
        setAuthToken(savedToken);
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
    
    const decoded = decodeToken(accessToken);
    const user = decoded?.sub || decoded?.username || decoded?.email || "user";
    setUsername(user);
    
    await AsyncStorage.setItem("token", accessToken);
    setToken(accessToken);
    setAuthToken(accessToken);
    console.log("[AuthContext] login: token guardado y seteado para usuario:", user);
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
    setUsername(null);
    setAuthToken(null);
    console.log("[AuthContext] logout: token borrado");
  }

  console.log("[AuthContext] render: isAuthenticated=", isAuthenticated, "loading=", loading, "username=", username);

  return (
    <AuthContext.Provider value={{ token, username, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}