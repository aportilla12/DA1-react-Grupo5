import { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
} from "react-native";

const MAX_DISTANCE = 65;
const SEND_INTERVAL_MS = 120;
const DEAD_ZONE = 0.12;

const SPEED_CONFIG = {
  precision: { linear: 0.3, yaw: 0.7 },
  normal: { linear: 0.6, yaw: 1.2 },
  fast: { linear: 0.9, yaw: 1.8 },
};

export default function JoystickControl({
  disabled = false,
  speedMode = "normal",
  onMove,
  onStop,
  onTelemetryChange,
  onTouchStart,
  onTouchEnd,

}) {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const lastSentAt = useRef(0);

  const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  };

  const applyDeadZone = (value) => {
    return Math.abs(value) < DEAD_ZONE ? 0 : value;
  };

  const circularLimit = (dx, dy) => {
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= MAX_DISTANCE) {
      return { x: dx, y: dy };
    }

    const angle = Math.atan2(dy, dx);

    return {
      x: Math.cos(angle) * MAX_DISTANCE,
      y: Math.sin(angle) * MAX_DISTANCE,
    };
  };

  const calculateMovement = (dx, dy) => {
    const limited = circularLimit(dx, dy);
    const config = SPEED_CONFIG[speedMode] || SPEED_CONFIG.normal;

    const normalizedX = limited.x / MAX_DISTANCE;
    const normalizedY = limited.y / MAX_DISTANCE;

    let vx = -normalizedY * config.linear;
    let vy = normalizedX * config.linear;
    let vyaw = normalizedX * config.yaw;

    vx = applyDeadZone(vx);
    vy = applyDeadZone(vy);
    vyaw = applyDeadZone(vyaw);

    return {
      x: limited.x,
      y: limited.y,
      vx: Number(clamp(vx, -1, 1).toFixed(2)),
      vy: Number(clamp(vy, -1, 1).toFixed(2)),
      vyaw: Number(clamp(vyaw, -3.14159, 3.14159).toFixed(2)),
    };
  };

  const getStatus = (vx, vy, vyaw) => {
    if (vx === 0 && vy === 0 && vyaw === 0) return "Detenido";
    if (Math.abs(vx) >= Math.abs(vy)) return vx > 0 ? "Avanzando" : "Retrocediendo";
    if (vy > 0) return "Lateral derecha";
    return "Lateral izquierda";
  };

  const sendMovement = async (dx, dy) => {
    if (disabled || !onMove) return;

    const now = Date.now();
    if (now - lastSentAt.current < SEND_INTERVAL_MS) return;

    lastSentAt.current = now;

    const movement = calculateMovement(dx, dy);
    const status = getStatus(movement.vx, movement.vy, movement.vyaw);

    onTelemetryChange?.({
      vx: movement.vx,
      vy: movement.vy,
      vyaw: movement.vyaw,
      status,
    });

    await onMove(movement.vx, movement.vy, movement.vyaw);
  };

  const resetJoystick = async () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();

    onTelemetryChange?.({
      vx: 0,
      vy: 0,
      vyaw: 0,
      status: "Detenido",
    });

    if (!disabled && onStop) {
      await onStop();
    }

    onTouchEnd?.();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        onTouchStart?.();
      },

      onPanResponderMove: (_, gestureState) => {
        const movement = calculateMovement(
          gestureState.dx,
          gestureState.dy
        );

        position.setValue({
          x: movement.x,
          y: movement.y,
        });

        sendMovement(movement.x, movement.y);
      },

      onPanResponderRelease: resetJoystick,
      onPanResponderTerminate: resetJoystick,
    })
  ).current;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>JOYSTICK VIRTUAL</Text>

      <View style={[styles.base, disabled && styles.disabled]}>
        <View style={styles.axisHorizontal} />
        <View style={styles.axisVertical} />

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.knob,
            {
              transform: position.getTranslateTransform(),
            },
          ]}
        >
          <Text style={styles.knobIcon}>✥</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1f1f21",
    borderWidth: 1,
    borderColor: "#44474d",
    borderRadius: 12,
    padding: 22,
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    color: "#c5c6cd",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 22,
  },

  base: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: "#44474d",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  disabled: {
    opacity: 0.45,
  },

  axisHorizontal: {
    position: "absolute",
    height: 1,
    width: "100%",
    backgroundColor: "rgba(143,144,151,0.35)",
  },

  axisVertical: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(143,144,151,0.35)",
  },

  knob: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#b9c7e4",
    alignItems: "center",
    justifyContent: "center",
  },

  knobIcon: {
    color: "#0a192f",
    fontSize: 22,
    fontWeight: "900",
  },
});