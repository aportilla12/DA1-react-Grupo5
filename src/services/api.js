import axios from "axios";

export const API_BASE_URL = "http://192.168.1.40:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

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
  apiClient
    .post("/auth/register", { username, email, password })
    .then((r) => r.data);

export const connectRobot = (
  token,
  robotType = "go2",
  networkInterface = "eth0",
) => {
  setAuthToken(token);
  return apiClient
    .post("/connect", {
      robot_type: robotType,
      network_interface: networkInterface,
    })
    .then((r) => r.data);
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
