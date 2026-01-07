import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  TextInput,
} from "react-native";

const { width, height } = Dimensions.get("window");

const PLAYER_SIZE = 40;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 140;

export default function App() {
  const [screen, setScreen] = useState("LOGIN"); // LOGIN | GAME
  const [username, setUsername] = useState("");

  const [timeActive, setTimeActive] = useState(false);
  const [obstacleX, setObstacleX] = useState(width);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Skills
  const [shield, setShield] = useState(false);
  const [slowTime, setSlowTime] = useState(false);

  // Player fixed at center
  const playerX = width / 2 - PLAYER_SIZE / 2;
  const playerY = height / 2 - PLAYER_SIZE / 2;

  useEffect(() => {
    if (screen !== "GAME") return;

    const loop = setInterval(() => {
      if (!timeActive || gameOver) return;

      const speed = slowTime ? 2 : 4;

      setObstacleX((x) => x - speed);
      setScore((s) => s + 1);

      if (score % 60 === 0) {
        setCoins((c) => c + 1);
      }

      if (obstacleX < -OBSTACLE_WIDTH) {
        setObstacleX(width + Math.random() * 200);
      }

      // Collision
      if (
        obstacleX < playerX + PLAYER_SIZE &&
        obstacleX + OBSTACLE_WIDTH > playerX
      ) {
        if (shield) {
          setShield(false);
          setObstacleX(width + 200);
        } else {
          setGameOver(true);
        }
      }
    }, 16);

    return () => clearInterval(loop);
  }, [timeActive, obstacleX, gameOver, slowTime, shield, screen]);

  const restartGame = () => {
    setObstacleX(width);
    setScore(0);
    setCoins(0);
    setShield(false);
    setSlowTime(false);
    setGameOver(false);
    setTimeActive(false);
  };

  /* ---------------- LOGIN ---------------- */
  if (screen === "LOGIN") {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.title}>⏳ TimeTap</Text>

        <TextInput
          placeholder="Enter username"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <Pressable
          style={styles.startBtn}
          onPress={() => username && setScreen("GAME")}
        >
          <Text style={styles.startText}>START</Text>
        </Pressable>
      </View>
    );
  }

  /* ---------------- GAME ---------------- */
  return (
    <Pressable
      style={styles.container}
      onPressIn={() => setTimeActive(true)}
      onPressOut={() => setTimeActive(false)}
    >
      {/* HUD */}
      <View style={styles.hud}>
        <Text style={styles.hudText}>👤 {username}</Text>
        <Text style={styles.hudText}>⭐ {score}</Text>
        <Text style={styles.hudText}>🪙 {coins}</Text>
      </View>

      {/* Ball (Fixed Center) */}
      <View
        style={[
          styles.player,
          {
            left: playerX,
            top: playerY,
            backgroundColor: shield ? "#00ff99" : "#E94560",
          },
        ]}
      />

      {/* Obstacle */}
      <View
        style={[
          styles.obstacle,
          {
            left: obstacleX,
            top: playerY - 50,
          },
        ]}
      />

      {/* Skills */}
      <View style={styles.skills}>
        <Pressable
          style={styles.skillBtn}
          onPress={() => {
            if (!slowTime) {
              setSlowTime(true);
              setTimeout(() => setSlowTime(false), 3000);
            }
          }}
        >
          <Text style={styles.skillText}>🐢 Slow</Text>
        </Pressable>

        <Pressable
          style={styles.skillBtn}
          onPress={() => {
            if (coins > 0 && !shield) {
              setCoins((c) => c - 1);
              setShield(true);
            }
          }}
        >
          <Text style={styles.skillText}>🛡 Shield</Text>
        </Pressable>
      </View>

      {/* Game Over */}
      {gameOver && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Pressable style={styles.restartBtn} onPress={restartGame}>
            <Text style={styles.restartText}>RESTART</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3E2F5B",
  },
  loginContainer: {
    flex: 1,
    backgroundColor: "#3E2F5B",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: 42,
    marginBottom: 40,
  },
  input: {
    width: "70%",
    borderBottomWidth: 1,
    borderColor: "#ffffff",
    color: "#ffffff",
    fontSize: 18,
    marginBottom: 30,
    padding: 10,
  },
  startBtn: {
    borderWidth: 1,
    borderColor: "#ffffff",
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
  startText: {
    color: "#ffffff",
    fontSize: 18,
  },
  hud: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  hudText: {
    color: "#ffffff",
    fontSize: 16,
  },
  player: {
    position: "absolute",
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius: PLAYER_SIZE / 2,
  },
  obstacle: {
    position: "absolute",
    width: OBSTACLE_WIDTH,
    height: OBSTACLE_HEIGHT,
    backgroundColor: "#111",
  },
  skills: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  skillBtn: {
    borderWidth: 1,
    borderColor: "#ffffff",
    padding: 12,
    width: 100,
    alignItems: "center",
  },
  skillText: {
    color: "#ffffff",
    fontSize: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverText: {
    color: "#ffffff",
    fontSize: 32,
    marginBottom: 20,
  },
  restartBtn: {
    borderWidth: 1,
    borderColor: "#ffffff",
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  restartText: {
    color: "#ffffff",
    fontSize: 18,
  },
});
