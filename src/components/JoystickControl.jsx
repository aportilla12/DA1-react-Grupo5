import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
} from "react-native";

const MAX_DISTANCE = 60;
const MAX_LINEAR_SPEED = 0.6;
const MAX_YAW_SPEED = 1.2;
const SEND_INTERVAL_MS = 150;

export default function JoystickControl({
  disabled = false,
  onMove,
  onStop,
}) {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const lastSentAt = useRef(0);

  const [values, setValues] = useState({
    vx: 0,
    vy: 0,
    vyaw: 0,
  });

  const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  };

  const calculateMovement = (dx, dy) => {
    const limitedX = clamp(dx, -MAX_DISTANCE, MAX_DISTANCE);
    const limitedY = clamp(dy, -MAX_DISTANCE, MAX_DISTANCE);

    const vx = clamp(
      (-limitedY / MAX_DISTANCE) * MAX_LINEAR_SPEED,
      -1,
      1
    );

    const vy = clamp(
      (limitedX / MAX_DISTANCE) * MAX_LINEAR_SPEED,
      -1,
      1
    );

    const vyaw = clamp(
      (limitedX / MAX_DISTANCE) * MAX_YAW_SPEED,
      -3.14159,
      3.14159
    );

    return {
      x: limitedX,
      y: limitedY,
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

      onPanResponderRelease: () => {
        resetJoystick();
      },

      onPanResponderTerminate: () => {
        resetJoystick();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={[styles.base, disabled && styles.disabled]}>
        <View style={styles.crossVertical} />
        <View style={styles.crossHorizontal} />

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

      <Text style={styles.help}>
        Arrastrá el joystick para mover el robot. Al soltar, se detiene.
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
  base: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  disabled: {
    opacity: 0.45,
  },
  crossVertical: {
    position: "absolute",
    width: 2,
    height: 150,
    backgroundColor: "#94a3b8",
  },
  crossHorizontal: {
    position: "absolute",
    width: 150,
    height: 2,
    backgroundColor: "#94a3b8",
  },
  knob: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#0f172a",
    borderWidth: 4,
    borderColor: "#fff",
  },
  help: {
    color: "#475569",
    textAlign: "center",
    marginTop: 14,
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