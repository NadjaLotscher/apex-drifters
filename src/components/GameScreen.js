import React, { useState, useEffect } from "react";
import Scoreboard from "./Scoreboard";
import Car from "./Car";
import Dashboard from "./Dashboard";
import Obstacle from "./Obstacle";
import "../CSS/GameScreen.css";
import HowToPlayModal from './HowToPlayModal'; // Importation du composant modal How to Play
import backgroundMusic from '../assets/audio.mp3'; // Importation du fichier audio

const GameScreen = ({ playerName, onGameEnd }) => {
    const [gamePaused, setGamePaused] = useState(false);
    const [showingScoreboard, setShowingScoreboard] = useState(false);
    const [position, setPosition] = useState({ x: 2, y: 10 });  // Initial car position
    const [fuel, setFuel] = useState(100);
    const [score, setScore] = useState(0);
    const [obstacles, setObstacles] = useState([]);
    const [carDimensions, setCarDimensions] = useState({ width: 45, height: 70 });
    const [isMusicOn, setIsMusicOn] = useState(true);
    const [showHowToPlay, setShowHowToPlay] = useState(false); // State for displaying How to Play modal
    const lanes = [12.5, 37.5, 62.5, 87.5];

  useEffect(() => {
    const music = document.getElementById('backgroundMusic');
    if (isMusicOn) {
      music.play().catch(error => console.log("Error playing music:", error));
    } else {
      music.pause();
    }
  }, [isMusicOn]);

    const togglePause = () => setGamePaused(!gamePaused);
    const endGame = () => {
        console.log("Game ended");
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
        setObstacles([]);
        setGamePaused(false);
        setShowingScoreboard(false);
    };
  
  const toggleMusic = () => {
    setIsMusicOn(!isMusicOn);
  };

  const handleHowToPlay = () => {
    setShowHowToPlay(true); // Affiche la modal How to Play
  };

  const closeHowToPlay = () => {
    setShowHowToPlay(false); // Ferme la modal How to Play
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
                setFuel((prevFuel) => Math.max(0, prevFuel - 0.1));
                
                if (fuel <= 0) {
                    console.log('Fuel ran out');
                    clearInterval(interval);
                    endGame();
                }

                if (Math.random() < 0.05) {
                    const lane = lanes[Math.floor(Math.random() * lanes.length)];
                    const newObstacle = new Obstacle(lane, 0, 20, 20, 2);
                    setObstacles((prev) => [...prev, newObstacle]);
                }

                setObstacles((prev) =>
                    prev.map((obstacle) => {
                        obstacle.update();
                        return obstacle;
                    }).filter((obstacle) => obstacle.y < 600)
                );
            }
        }, 1000 / 60);
        return () => clearInterval(interval);
    }, [score, fuel, gamePaused, lanes]);

    useEffect(() => {
        let collisionDetected = false;
        obstacles.forEach((obstacle) => {
            const carBottom = 600 - position.y - carDimensions.height;
            const carRect = {
                x: lanes[position.x] - carDimensions.width / 2,
                y: carBottom,
                width: carDimensions.width,
                height: carDimensions.height,
            };

            console.log(`Car Rect: x=${carRect.x}, y=${carRect.y}, width=${carRect.width}, height=${carRect.height}`);
            console.log(`Obstacle: x=${obstacle.x}, y=${obstacle.y}, width=${obstacle.width}, height=${obstacle.height}`);
            if (obstacle.collidesWith(carRect)) {
                console.log('Collision Detected!', obstacle, carRect);
                collisionDetected = true;
            }
        });

        if (collisionDetected) {
            endGame();
        }
    }, [obstacles, position, lanes, carDimensions]);

    return (
        <div className="game-screen">
            <audio id="backgroundMusic" loop>
                <source src={backgroundMusic} type="audio/mpeg" />
            </audio>
            {showHowToPlay && (
                <HowToPlayModal
                    isOpen={showHowToPlay}
                    onClose={() => setShowHowToPlay(false)}
                    text="Instructions..."
                />
            )}
            <Dashboard score={score} fuel={fuel} />
            {gamePaused ? (
                <div className="pause-menu">
                    <button onClick={() => setGamePaused(false)}>Resume Game</button>
                    <button onClick={endGame}>End Race</button>
                    <button onClick={() => setShowHowToPlay(true)}>How to Play</button>
                    <button onClick={showScoreboard}>Scoreboard</button>
                    <button onClick={() => setIsMusicOn(!isMusicOn)}>{isMusicOn ? 'Music On' : 'Music Off'}</button>
                    <button onClick={restartGame}>Restart</button>
                </div>
            ) : null}
            <div className="track">
                <Car position={{ x: lanes[position.x], y: position.y }} setCarDimensions={setCarDimensions} />
                {obstacles.map((obstacle, index) => (
                    <div
                        key={index}
                        className="obstacle"
                        style={{
                            position: "absolute",
                            top: obstacle.y,
                            left: `${obstacle.x}%`,
                            width: `${obstacle.width}px`,
                            height: `${obstacle.height}px`,
                            backgroundColor: "black",
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default GameScreen;