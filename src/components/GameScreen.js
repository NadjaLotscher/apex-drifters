import React, { useState, useEffect, useRef } from "react";
import GameLoopController from "../controllers/GameLoopController";
import CarController from "../controllers/CarController";
import Dashboard from "./Dashboard";
import HowToPlayModal from "./HowToPlayModal";
import PowerUpsModal from "./PowerUpsModal";
import GameOverModal from "./GameOverModal";
import backgroundMusic from "../assets/audio.mp3";
import UseMusicController from "../controllers/useMusicController";

import "../CSS/GameScreen.css";
import "../CSS/Car.css";
import "../CSS/Obstacle.css";
import "../CSS/Fuel.css";

const initialFuel = 100;
const fuelConsumptionRate = 0.5;
const collisionFuelPenalty = 5;
const fuelPickupAmount = 20;
const carMoveSpeed = 1;
const obstacleMoveSpeed = 2.5;
const CarMarginLeft = 10;
const CarMarginRight = 5;
const ObstacleMarginLeft = 10;
const ObstacleMarginRight = 15;
const FuelPickupMarginLeft = 10;
const FuelPickupMarginRight = 10;
const scoreIncrementPerSecond = 1;

const obstacleClasses = [
  "obstacle1",
  "obstacle2",
  "obstacle3",
  "obstacle4",
  "obstacle5",
  "obstacle6",
];

const GameScreen = ({
  playerName,
  selectedVehicle,
  highScores,
  setHighScores,
  onGoHome,
}) => {
  const [gamePaused, setGamePaused] = useState(false);
  const [showingScoreboard, setShowingScoreboard] = useState(false);
  const [score, setScore] = useState(0);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showPowerUpsModal, setShowPowerUpsModal] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [carPosition, setCarPosition] = useState(50);
  const [fuel, setFuel] = useState(initialFuel);
  const [obstacles, setObstacles] = useState([]);
  const [fuelPickups, setFuelPickups] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasShield, setHasShield] = useState(false);

  // Refs
  const trackRef = useRef(null);
  const moveInterval = useRef(null);
  const movingLeft = useRef(false);
  const movingRight = useRef(false);

  const musicController = useRef(null);
  const gameLoopController = useRef(null);
  const carController = useRef(null);

  // Initialize the music controller
  useEffect(() => {
    musicController.current = new UseMusicController("backgroundMusic");
  }, []);

  // Initialize the game loop controller
  useEffect(() => {
    gameLoopController.current = new GameLoopController(
      updateFuel,
      updateScore,
      endGame,
      updateObstacles,
      updateFuelPickups,
      checkCollisions,
      spawnElements
    );
  }, []);

  // Initialize the car controller
  useEffect(() => {
    carController.current = new CarController(
      trackRef,
      setCarPosition,
      carMoveSpeed,
      CarMarginLeft,
      CarMarginRight,
      togglePause
    );
    carController.current.addEventListeners();
    carController.current.startMoving(); // Start moving the car when the controller is initialized

    return () => {
      carController.current.removeEventListeners();
      carController.current.stopMoving(); // Stop moving the car when the component unmounts
    };
  }, []);

  // Toggle music based on isMusicOn state
  useEffect(() => {
    if (musicController.current) {
      musicController.current.toggleMusic(isMusicOn);
    }
  }, [isMusicOn]);

  // Start or stop the game loop based on isPlaying and gamePaused states
  useEffect(() => {
    if (isPlaying && !gamePaused && gameLoopController.current) {
      gameLoopController.current.start();
      carController.current.startMoving(); // Ensure the car starts moving when the game starts or resumes
    } else if (gameLoopController.current) {
      gameLoopController.current.pause();
      carController.current.stopMoving(); // Stop the car moving when the game pauses
    }
    return () => {
      gameLoopController.current?.stop();
      carController.current.stopMoving(); // Ensure the car stops moving when the game stops
    };
  }, [isPlaying, gamePaused]);

  // Function to toggle music
  const toggleMusic = () => {
    setIsMusicOn((prevIsMusicOn) => {
      const newIsMusicOn = !prevIsMusicOn;
      if (musicController.current) {
        musicController.current.toggleMusic(newIsMusicOn);
      }
      return newIsMusicOn;
    });
  };

  // Function to toggle pause
  const togglePause = () => {
    setGamePaused(!gamePaused);
  };

  // Function to end the game
  const endGame = () => {
    console.log("Game ended");
    setIsPlaying(false);
    setGamePaused(true);
    const newHighScores = [
      ...highScores,
      { playerName, score: Math.round(score) },
    ];
    newHighScores.sort((a, b) => b.score - a.score);
    setHighScores(newHighScores.slice(0, 5));
    localStorage.setItem(
      "highScores",
      JSON.stringify(newHighScores.slice(0, 5))
    );
    setShowGameOver(true);
  };

  // Function to restart the game
  const restartGame = () => {
    setScore(0);
    setFuel(initialFuel);
    setGamePaused(false);
    setIsPlaying(true);
    setHasShield(false);
    setObstacles([]);
    setFuelPickups([]);
    setShowGameOver(false);

    if (gameLoopController.current) {
      gameLoopController.current.resetSpeed();
    }
  };

  // Function to show How To Play modal
  const handleHowToPlay = () => {
    setShowHowToPlay(true);
  };

  // Function to close How To Play modal
  const closeHowToPlayModal = () => {
    setShowHowToPlay(false);
    if (gamePaused) setGamePaused(true);
  };

  /*
  // Keydown event handler
  const handleKeyDown = (e) => {
    if (gamePaused && e.key !== " ") return;

    if (e.key === "ArrowLeft") {
      movingLeft.current = true;
      movingRight.current = false;
    } else if (e.key === "ArrowRight") {
      movingRight.current = true;
      movingLeft.current = false;
    } else if (e.key === " ") {
      togglePause();
    }
  };

  // Keyup event handler
  const handleKeyUp = (e) => {
    if (e.key === "ArrowLeft") {
      movingLeft.current = false;
    } else if (e.key === "ArrowRight") {
      movingRight.current = false;
    }
  };
  */

  // Function to show Power-ups modal
  const handlePowerUpsClick = () => {
    setShowPowerUpsModal(true);
    if (gamePaused) setGamePaused(true);
  };

  // Function to close Power-ups modal
  const closePowerUpsModal = () => {
    setShowPowerUpsModal(false);
  };

  // Drag and drop event handlers
  const handleDrop = (event) => {
    event.preventDefault();
    const powerUpType = event.dataTransfer.getData("powerUpType");
    if (powerUpType === "Shield") {
      setHasShield(true);
    } else if (powerUpType === "Invincible") {
      // Activate invincible power-up
    } else if (powerUpType === "Fuel") {
      // Activate fuel power-up
      setFuel((prevFuel) => Math.min(prevFuel + fuelPickupAmount, 100));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  /*
  // Add event listeners for keydown and keyup events
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gamePaused]);

  // Move the car left or right based on the movingLeft and movingRight states
  useEffect(() => {
    if (isPlaying && !gamePaused) {
      moveInterval.current = setInterval(() => {
        const trackWidth = trackRef.current ? trackRef.current.offsetWidth : 700;
        const carWidth = trackRef.current ? trackRef.current.querySelector(".car").offsetWidth : 50;

        if (movingLeft.current) {
          setCarPosition((prev) => Math.max(prev - carMoveSpeed, CarMarginLeft));
        }
        if (movingRight.current) {
          setCarPosition((prev) => Math.min(prev + carMoveSpeed, 100 * (trackWidth - carWidth) / trackWidth - CarMarginRight));
        }
      }, 5);
    } else {
      clearInterval(moveInterval.current);
    }
    return () => clearInterval(moveInterval.current);
  }, [isPlaying, gamePaused]);
*/

  // Define the game loop functions
  const updateFuel = () => {
    setFuel((prev) => {
      const newFuel = Math.max(prev - fuelConsumptionRate, 0);
      if (newFuel === 0) {
        endGame();
      }
      return newFuel;
    });
  };

  const updateScore = () => {
    setScore(
      (prev) =>
        prev +
        (scoreIncrementPerSecond * gameLoopController.current.gameSpeed) / 1000
    );
  };

  const updateObstacles = () => {
    setObstacles((prev) =>
      prev
        .map((obstacle) => ({ ...obstacle, y: obstacle.y + obstacleMoveSpeed }))
        .filter((obstacle) => obstacle.y < 100)
    );
  };

  const updateFuelPickups = () => {
    setFuelPickups((prev) =>
      prev
        .map((fuelPickup) => ({
          ...fuelPickup,
          y: fuelPickup.y + obstacleMoveSpeed,
        }))
        .filter((fuelPickup) => fuelPickup.y < 100)
    );
  };

  // Function to check for collisions
  const checkCollisions = () => {
    const trackWidth = trackRef.current ? trackRef.current.offsetWidth : 700;
    const carWidth = 55;
    const carHeight = 100;
    const carLeft = (carPosition / 100) * trackWidth;
    const carRight = carLeft + carWidth;
    const carTop = trackRef.current ? trackRef.current.offsetHeight - carHeight : 0;
    const carBottom = carTop + carHeight;
  
    const carElement = document.querySelector(".car");
  
    obstacles.forEach((obstacle, index) => {
      const obstacleElement = document.querySelectorAll(".obstacle")[index];
      if (obstacleElement && carElement) {
        const carRect = carElement.getBoundingClientRect();
        const obstacleRect = obstacleElement.getBoundingClientRect();
  
        if (
          carRect.left < obstacleRect.right &&
          carRect.right > obstacleRect.left &&
          carRect.top < obstacleRect.bottom &&
          carRect.bottom > obstacleRect.top
        ) {
          console.log("Collision with obstacle detected!");
          if (hasShield) {
            setHasShield(false);
          } else {
            setFuel((prevFuel) => prevFuel - collisionFuelPenalty);
          }
          setObstacles((prev) => prev.filter((_, i) => i !== index));
        }
      }
    });
  
    fuelPickups.forEach((fuelPickup, index) => {
      const fuelPickupElement = document.querySelectorAll(".fuel-pickup")[index];
      if (fuelPickupElement && carElement) {
        const carRect = carElement.getBoundingClientRect();
        const fuelPickupRect = fuelPickupElement.getBoundingClientRect();
  
        if (
          carRect.left < fuelPickupRect.right &&
          carRect.right > fuelPickupRect.left &&
          carRect.top < fuelPickupRect.bottom &&
          carRect.bottom > fuelPickupRect.top
        ) {
          console.log("Fuel pickup detected!");
          setFuel((prevFuel) => Math.min(prevFuel + fuelPickupAmount, 100));
          setFuelPickups((prev) => prev.filter((_, i) => i !== index));
        }
      }
    });
  };

  // Function to spawn elements
  const spawnElements = () => {
    if (Math.random() < 0.1) {
      const randomObstacleClass =
        obstacleClasses[Math.floor(Math.random() * obstacleClasses.length)];
      setObstacles((prev) => [
        ...prev,
        {
          x:
            Math.random() * (100 - ObstacleMarginLeft - ObstacleMarginRight) +
            ObstacleMarginLeft,
          y: 0,
          className: randomObstacleClass,
        },
      ]);
    }
    if (Math.random() < 0.05) {
      setFuelPickups((prev) => [
        ...prev,
        {
          x:
            Math.random() *
              (100 - FuelPickupMarginLeft - FuelPickupMarginRight) +
            FuelPickupMarginLeft,
          y: 0,
        },
      ]);
    }
  };

  return (
    <div className="game-screen">
      <audio id="backgroundMusic" src={backgroundMusic} loop />
      {showHowToPlay && (
        <HowToPlayModal
          isOpen={showHowToPlay}
          onClose={closeHowToPlayModal}
          text="Use the arrow keys to move the car left and right. Avoid obstacles and collect fuel to keep going!"
        />
      )}
      <PowerUpsModal
        isOpen={showPowerUpsModal}
        onClose={closePowerUpsModal}
        selectedVehicle={selectedVehicle}
        setHasShield={setHasShield}
      />
      <Dashboard score={score} fuel={fuel} />
      {gamePaused &&
      !showingScoreboard &&
      !showPowerUpsModal &&
      !showHowToPlay &&
      !showGameOver ? (
        <div className="pause-menu">
          <button onClick={() => setGamePaused(false)}>Resume Game</button>
          <button onClick={() => setShowPowerUpsModal(true)}>Power-ups</button>
          <button onClick={endGame}>End Race</button>
          <button onClick={() => setShowHowToPlay(true)}>How to Play</button>
          <button onClick={toggleMusic}>
            {isMusicOn ? "Music On" : "Music Off"}
          </button>
          <button onClick={restartGame}>Restart</button>
        </div>
      ) : (
        !showGameOver && (
          <button onClick={togglePause} className="pause-button">
            Pause
          </button>
        )
      )}
      <div
        className="track"
        ref={trackRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div
          className={`car ${hasShield ? "shielded" : ""}`}
          style={{
            left: `${carPosition}%`,
            backgroundImage: `url(${selectedVehicle.image})`,
          }}
        ></div>
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            className={`obstacle ${obstacle.className}`}
            style={{ left: `${obstacle.x}%`, top: `${obstacle.y}%` }}
          />
        ))}
        {fuelPickups.map((fuelPickup, index) => (
          <div
            key={index}
            className="fuel-pickup"
            style={{ left: `${fuelPickup.x}%`, top: `${fuelPickup.y}%` }}
          />
        ))}
      </div>
      <div className="fuel-bar">Fuel: {fuel.toFixed(1)}</div>
      {showGameOver && (
        <GameOverModal
          isOpen={showGameOver}
          playerName={playerName}
          score={score}
          highScores={highScores}
          onTryAgain={restartGame}
          onGoHome={onGoHome}
        />
      )}
    </div>
  );
};

export default GameScreen;
