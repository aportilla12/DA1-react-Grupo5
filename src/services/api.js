const BASE_URL = "http://192.168.1.40:8000";

// Función base que todas las demás usan internamente
const request = async (method, path, body = null, token = null) => {
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    // El backend manda el error en data.detail
    throw new Error(data.detail || "Error desconocido");
  }

  return data;
};

export const login = (identifier, password) =>
  request("POST", "/auth/token", { identifier, password });

export const register = (username, email, password) =>
  request("POST", "/auth/register", { username, email, password });

export const connectRobot = (token, robotType = "go2") =>
  request("POST", "/connect", { robot_type: robotType }, token);

export const disconnectRobot = (token) =>
  request("POST", "/disconnect", null, token);

export const getStatus = (token) => request("GET", "/status", null, token);

export const moveRobot = (token, vx, vy, vyaw) =>
  request("POST", "/move", { vx, vy, vyaw }, token);

export const stopRobot = (token) => request("POST", "/stop", null, token);
