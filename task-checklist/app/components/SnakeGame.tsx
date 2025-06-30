"use client";
import React, { useRef, useEffect, useState } from "react";

const CANVAS_SIZE = 400;
const SCALE = 20;
const INITIAL_SNAKE = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const FOOD_COLOR = "#e63946";
const SNAKE_HEAD_COLOR = "#2d6a4f";
const SNAKE_BODY_COLOR = "#52b788";
const BG_GRADIENT_START = "#b7e4c7";
const BG_GRADIENT_END = "#40916c";

function getRandomFood(snake: { x: number; y: number }[]): { x: number; y: number } {
  let newFood: { x: number; y: number };
  do {
    newFood = {
      x: Math.floor(Math.random() * (CANVAS_SIZE / SCALE)),
      y: Math.floor(Math.random() * (CANVAS_SIZE / SCALE)),
    };
  } while (snake.some((s) => s.x === newFood.x && s.y === newFood.y));
  return newFood;
}

const SNAKE_SPEED = 180; // ms per move (slower)

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lastMove, setLastMove] = useState(Date.now());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // Animation loop for smoothness
  useEffect(() => {
    let animationId: number;
    function animate() {
      if (gameOver) return;
      if (Date.now() - lastMove > SNAKE_SPEED) {
        setSnake((prev) => {
          const newHead = {
            x: prev[0].x + direction.x,
            y: prev[0].y + direction.y,
          };
          if (
            newHead.x < 0 ||
            newHead.x >= CANVAS_SIZE / SCALE ||
            newHead.y < 0 ||
            newHead.y >= CANVAS_SIZE / SCALE ||
            prev.some((s) => s.x === newHead.x && s.y === newHead.y)
          ) {
            setGameOver(true);
            return prev;
          }
          let newSnake = [newHead, ...prev];
          if (newHead.x === food.x && newHead.y === food.y) {
            setFood(getRandomFood(newSnake));
            setScore((s) => s + 1);
          } else {
            newSnake.pop();
          }
          return newSnake;
        });
        setLastMove(Date.now());
      }
      animationId = requestAnimationFrame(animate);
    }
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [direction, food, gameOver, lastMove]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_SIZE);
    gradient.addColorStop(0, BG_GRADIENT_START);
    gradient.addColorStop(1, BG_GRADIENT_END);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    // Draw food (as a shiny apple)
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      food.x * SCALE + SCALE / 2,
      food.y * SCALE + SCALE / 2,
      SCALE / 2.2,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = FOOD_COLOR;
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
    // Draw snake
    snake.forEach((s, idx) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        s.x * SCALE + SCALE / 2,
        s.y * SCALE + SCALE / 2,
        SCALE / 2.1,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = idx === 0 ? SNAKE_HEAD_COLOR : SNAKE_BODY_COLOR;
      ctx.shadowColor = idx === 0 ? "#081c15" : "#74c69d";
      ctx.shadowBlur = idx === 0 ? 10 : 4;
      ctx.fill();
      ctx.restore();
      // Draw eyes on head
      if (idx === 0) {
        ctx.save();
        ctx.fillStyle = "#fff";
        const eyeOffsetX = direction.x === 0 ? 6 : direction.x * 6;
        const eyeOffsetY = direction.y === 0 ? 6 : direction.y * 6;
        ctx.beginPath();
        ctx.arc(
          s.x * SCALE + SCALE / 2 + eyeOffsetX / 2,
          s.y * SCALE + SCALE / 2 + eyeOffsetY / 2,
          2.2,
          0,
          2 * Math.PI
        );
        ctx.arc(
          s.x * SCALE + SCALE / 2 - eyeOffsetX / 2,
          s.y * SCALE + SCALE / 2 - eyeOffsetY / 2,
          2.2,
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.restore();
      }
    });
  }, [snake, food, gameOver, direction]);

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setLastMove(Date.now());
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ color: '#1b4332', fontWeight: 700, fontSize: 28, marginBottom: 8 }}>Snake Game</h2>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{ border: "3px solid #081c15", borderRadius: 18, background: "#b7e4c7", boxShadow: "0 4px 32px #081c1533" }}
      />
      <div style={{ margin: "10px 0", color: '#081c15', fontWeight: 600, fontSize: 18 }}>Score: {score}</div>
      {gameOver && (
        <div>
          <div style={{ color: "#e63946", fontWeight: "bold", fontSize: 20 }}>Game Over!</div>
          <button onClick={handleRestart} style={{ marginTop: 8, padding: '6px 18px', borderRadius: 8, background: '#52b788', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
