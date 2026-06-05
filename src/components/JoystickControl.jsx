import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  TouchableOpacity,
} from "react-native";

const MAX_DISTANCE = 65;
const SEND_INTERVAL_MS = 120;
const DEAD_ZONE = 0.12;

const SPEED_MODES = {
  precision: {
    label: "Precisión",
    linear: 0.3,
    yaw: 0.7,
  },
  normal: {
    label: "Normal",
    linear: 0.6,
    yaw: 1.2,
  },
  fast: {
    label: "Rápido",
    linear: 0.9,
    yaw: 1.8,
  },
};

export default function JoystickControl({
  disabled = false,
  onMove,
  onStop,
}) {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const lastSentAt = useRef(0);

  const [mode, setMode] = useState("normal");
  const [direction, setDirection] = useState("Detenido");
  const [values, setValues] = useState({
    vx: 0,
    vy: 0,
    vyaw: 0,
  });

  const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  };

  const applyDeadZone = (value) => {
    return Math.abs(value) < DEAD_ZONE ? 0 : value;
  };

  const calculateCircularLimit = (dx, dy) => {
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

  const getDirectionLabel = (vx, vy, vyaw) => {
    if (vx === 0 && vy === 0 && vyaw === 0) return "Detenido";

    if (Math.abs(vyaw) > 0.5 && Math.abs(vx) < 0.15) {
      return vyaw > 0 ? "Girando derecha" : "Girando izquierda";
    }

    if (Math.abs(vx) >= Math.abs(vy)) {
      return vx > 0 ? "Avanzando" : "Retrocediendo";
    }

    return vy > 0 ? "Lateral derecha" : "Lateral izquierda";
  };

  const calculateMovement = (dx, dy) => {
    const limited = calculateCircularLimit(dx, dy);

    const normalizedX = limited.x / MAX_DISTANCE;
    const normalizedY = limited.y / MAX_DISTANCE;

    const config = SPEED_MODES[mode];

    let vx = (-normalizedY) * config.linear;
    let vy = normalizedX * config.linear;
    let vyaw = normalizedX * config.yaw;

    vx = applyDeadZone(vx);
    vy = applyDeadZone(vy);
    vyaw = applyDeadZone(vyaw);

    vx = clamp(vx, -1, 1);
    vy = clamp(vy, -1, 1);
    vyaw = clamp(vyaw, -3.14159, 3.14159);

    return {
      x: limited.x,
      y: limited.y,
      vx: Number(vx.toFixed(2)),
      vy: Number(vy.toFixed(2)),
      vyaw: Number(vyaw.toFixed(2)),
    };
  };

  const sendMovement = async (dx, dy) => {
    if (disabled || !onMove) return;

    const now = Date.now();

    if (now - lastSentAt.current < SEND_INTERVAL_MS) return;

    lastSentAt.current = now;

    const movement = calculateMovement(dx, dy);

    setValues({
      vx: movement.vx,
      vy: movement.vy,
      vyaw: movement.vyaw,
    });

    setDirection(
      getDirectionLabel(movement.vx, movement.vy, movement.vyaw)
    );

    await onMove(movement.vx, movement.vy, movement.vyaw);
  };

  const resetJoystick = async () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();

    setValues({
      vx: 0,
      vy: 0,
      vyaw: 0,
    });

    setDirection("Detenido");

    if (!disabled && onStop) {
      await onStop();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,

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
    <View style={styles.container}>
      <Text style={styles.title}>Joystick virtual</Text>

      <View style={styles.modeRow}>
        {Object.entries(SPEED_MODES).map(([key, item]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.modeButton,
              mode === key && styles.modeButtonActive,
            ]}
            disabled={disabled}
            onPress={() => setMode(key)}
          >
            <Text
              style={[
                styles.modeText,
                mode === key && styles.modeTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.base, disabled && styles.disabled]}>
        <View style={styles.crossVertical} />
        <View style={styles.crossHorizontal} />
        <View style={styles.innerCircle} />

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.knob,
            {
              transform: position.getTranslateTransform(),
            },
          ]}
        />
      </View>

      <Text style={styles.direction}>{direction}</Text>

      <Text style={styles.help}>
        Arrastrá para mover. Al soltar, el robot se detiene automáticamente.
      </Text>

      <View style={styles.valuesBox}>
        <Text style={styles.value}>vx: {values.vx}</Text>
        <Text style={styles.value}>vy: {values.vy}</Text>
        <Text style={styles.value}>vyaw: {values.vyaw}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#e2e8f0",
    borderRadius: 18,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
  },
  modeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  modeButton: {
    backgroundColor: "#cbd5e1",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  modeButtonActive: {
    backgroundColor: "#0f172a",
  },
  modeText: {
    color: "#334155",
    fontWeight: "bold",
    fontSize: 12,
  },
  modeTextActive: {
    color: "#fff",
  },
  base: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 3,
    borderColor: "#94a3b8",
  },
  disabled: {
    opacity: 0.45,
  },
  crossVertical: {
    position: "absolute",
    width: 2,
    height: 155,
    backgroundColor: "#94a3b8",
  },
  crossHorizontal: {
    position: "absolute",
    width: 155,
    height: 2,
    backgroundColor: "#94a3b8",
  },
  innerCircle: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: "#94a3b8",
  },
  knob: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0f172a",
    borderWidth: 5,
    borderColor: "#fff",
  },
  direction: {
    marginTop: 14,
    color: "#0f172a",
    fontWeight: "bold",
    fontSize: 15,
  },
  help: {
    color: "#475569",
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
  },
  valuesBox: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  value: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "600",
  },
});