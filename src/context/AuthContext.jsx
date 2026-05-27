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
    try {
      const savedToken = await AsyncStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        setAuthToken(savedToken);
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const response = await apiClient.post("/auth/token", {
      identifier: email,
      password,
    });

    const accessToken = response.data.access_token;

    await AsyncStorage.setItem("token", accessToken);
    setToken(accessToken);
    setAuthToken(accessToken);
  }

  async function register(username, email, password) {
    await apiClient.post("/auth/register", {
      username,
      email,
      password,
    });
  }

  async function logout() {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setAuthToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
