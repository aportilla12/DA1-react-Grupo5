import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { connectRobot, disconnectRobot, getStatus } from "../services/api";

const RobotContext = createContext();

export function RobotProvider({ children }) {
  const { token } = useAuth();
  const [robotType, setRobotType] = useState("go2");
  const [networkInterface, setNetworkInterface] = useState("eth0");
  const [connectionState, setConnectionState] = useState("disconnected");
  const [statusData, setStatusData] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const intervalRef = useRef(null);

  const fetchStatus = async () => {
    if (!token) return;
    try {
      const data = await getStatus(token);
      setStatusData(data);
      setConnectionState(data.connection_state === "connected" ? "connected" : "disconnected");
      return data;
    } catch {
      setConnectionState("error");
      return null;
    }
  };

  const connect = async () => {
    if (!token) return;
    try {
      setConnectionState("disconnected");
      await connectRobot(token, robotType, networkInterface);
      setConnectionState("connected");
      await fetchStatus();
    } catch (e) {
      setConnectionState("error");
      throw e;
    }
  };

  const disconnect = async () => {
    if (!token) return;
    try {
      await disconnectRobot(token);
      setConnectionState("disconnected");
      setStatusData(null);
    } catch (e) {
      setConnectionState("error");
      throw e;
    }
  };

  // Cada 5 segundos se chequea la conexión
  useEffect(() => {
    if (!token) return;

    intervalRef.current = setInterval(async () => {
      const data = await fetchStatus();

      // Reconexión automática si se perdió la conexión
      if (data && data.connection_state !== "connected" && connectionState === "connected" && !isReconnecting) {
        setIsReconnecting(true);
        try {
          await connectRobot(token, robotType, networkInterface);
          setConnectionState("connected");
        } catch {
          setConnectionState("error");
        } finally {
          setIsReconnecting(false);
        }
      }
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [token, connectionState, robotType, networkInterface]);

  return (
    <RobotContext.Provider value={{
      robotType, setRobotType,
      networkInterface, setNetworkInterface,
      connectionState,
      statusData,
      isReconnecting,
      connect,
      disconnect,
      fetchStatus,
    }}>
      {children}
    </RobotContext.Provider>
  );
}

export function useRobot() {
  return useContext(RobotContext);
}