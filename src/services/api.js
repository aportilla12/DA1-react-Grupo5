import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL = "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para manejar errores del backend
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.detail || error.message || "Error desconocido";
    return Promise.reject(new Error(msg));
  }
);

export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

export default apiClient;

export const login = (identifier, password) =>
  apiClient.post("/auth/token", { identifier, password }).then((r) => r.data);

export const register = (username, email, password) =>
  apiClient.post("/auth/register", { username, email, password }).then((r) => r.data);

export const connectRobot = (token, robotType = "go2", networkInterface = "eth0") => {
  setAuthToken(token);
  return apiClient.post("/connect", { robot_type: robotType, network_interface: networkInterface }).then((r) => r.data);
};

export const disconnectRobot = (token) => {
  setAuthToken(token);
  return apiClient.post("/disconnect").then((r) => r.data);
};

export const getStatus = (token) => {
  setAuthToken(token);
  return apiClient.get("/status").then((r) => r.data);
};

export const moveRobot = (token, vx, vy, vyaw) => {
  setAuthToken(token);
  return apiClient.post("/move", { vx, vy, vyaw }).then((r) => r.data);
};

export const stopRobot = (token) => {
  setAuthToken(token);
  return apiClient.post("/stop").then((r) => r.data);
};

export const standupRobot = (token) => {
  setAuthToken(token);
  return apiClient.post("/standup").then((r) => r.data);
};

export const sitdownRobot = (token) => {
  setAuthToken(token);
  return apiClient.post("/sitdown").then((r) => r.data);
};

export const dampRobot = (token) => {
  setAuthToken(token);
  return apiClient.post("/damp").then((r) => r.data);
};

export const handstandRobot = (token, enable = true) => {
  setAuthToken(token);
  return apiClient.post("/handstand", { enable }).then((r) => r.data);
};

export const freeboundRobot = (token, enable = true) => {
  setAuthToken(token);
  return apiClient.post("/freebound", { enable }).then((r) => r.data);
};

export const freeavoidRobot = (token, enable = true) => {
  setAuthToken(token);
  return apiClient.post("/freeavoid", { enable }).then((r) => r.data);
};

export const getActions = (token) => {
  setAuthToken(token);
  return apiClient.get("/actions").then((r) => r.data);
};

export const executeAction = (token, actionName) => {
  setAuthToken(token);
  return apiClient.post(`/action/${actionName}`).then((r) => r.data);
};

export const saveCommandHistory = async (token, robotType, action, status, details, username = "default") => {
  try {
    // Usar username como clave para que persista entre sesiones
    const key = `history_${username}`;
    const existing = await AsyncStorage.getItem(key);
    const history = existing ? JSON.parse(existing) : [];
    
    const newCommand = {
      id: Date.now(),
      robotType,
      action,
      status,
      details,
      timestamp: new Date().toISOString(),
    };
    
    history.unshift(newCommand);
    await AsyncStorage.setItem(key, JSON.stringify(history));
    
    return newCommand;
  } catch (e) {
    console.log("[saveCommandHistory] error:", e.message);
    throw e;
  }
};

export const getCommandHistory = async (token, username = "default") => {
  try {
    // Usar username como clave para recuperar el historial del usuario
    const key = `history_${username}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log("[getCommandHistory] error:", e.message);
    return [];
  }
};

export const getCommandHistoryByRobot = async (token, robotType, username = "default") => {
  try {
    // Usar username como clave
    const key = `history_${username}`;
    const data = await AsyncStorage.getItem(key);
    const history = data ? JSON.parse(data) : [];
    return history.filter(cmd => cmd.robotType === robotType);
  } catch (e) {
    console.log("[getCommandHistoryByRobot] error:", e.message);
    return [];
  }
};

export const walkuprightRobot = (token, enable = true) => {
  setAuthToken(token);
  return apiClient.post("/walkupright", { enable }).then((r) => r.data);
};

export const crossstepRobot = (token, enable = true) => {
  setAuthToken(token);
  return apiClient.post("/crossstep", { enable }).then((r) => r.data);
};

export const freejumpRobot = (token, enable = true) => {
  setAuthToken(token);
  return apiClient.post("/freejump", { enable }).then((r) => r.data);
};