import React, { useState, useEffect } from "react";
import Scoreboard from "./Scoreboard";
import Car from "./Car";
import "../CSS/GameScreen.css";

const GameScreen = ({ playerName, onGameEnd }) => {
    const [gamePaused, setGamePaused] = useState(false);
    const [showingScoreboard, setShowingScoreboard] = useState(false);
    const [position, setPosition] = useState({ x: 2, y: 90 });  // Initial car position
    const [fuel, setFuel] = useState(100);
    const [score, setScore] = useState(0);
    const lanes = [10, 30, 50, 70, 90];

    const togglePause = () => setGamePaused(!gamePaused);
    const endGame = () => {
        onGameEnd();
        setGamePaused(false);
        setShowingScoreboard(false);
    };

    const showScoreboard = () => {
        setShowingScoreboard(true);
        setGamePaused(false);
    };

    const restartGame = () => {
        setScore(0);
        setFuel(100);
        setPosition({ x: 2, y: 10 });
        setGamePaused(false);
        setShowingScoreboard(false);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!gamePaused) {
                switch (event.key) {
                    case "ArrowLeft":
                        setPosition((prev) => ({ ...prev, x: Math.max(prev.x - 1, 0) }));
                        break;
                    case "ArrowRight":
                        setPosition((prev) => ({ ...prev, x: Math.min(prev.x + 1, lanes.length - 1) }));
                        break;
                    default:
                        break;
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gamePaused, lanes]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!gamePaused) {
                setScore(score + 1);
                setFuel(fuel - 1);
                if (fuel <= 0) {
                    clearInterval(interval);
                    endGame();
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [score, fuel, gamePaused]);

    return (
        <div className="game-screen">
            <div className="dashboard">
                <div className="score-board">Score: {score}</div>
                <div className="fuel-gauge">Fuel: {fuel}%</div>
            </div>
            <button className="pause-button" onClick={togglePause}>Pause</button>
            {gamePaused ? (
                <div className="pause-menu">
                    <button onClick={() => setGamePaused(false)}>Resume Game</button>
                    <button onClick={endGame}>End Race</button>
                    <button onClick={showScoreboard}>Scoreboard</button>
                    <button onClick={restartGame}>Restart</button>
                </div>
            ) : null}
            <div className="track">
                <Car position={{ x: lanes[position.x], y: position.y }} />
            </div>
        </div>
    );
};

export default GameScreen;
