import React, { useState, useEffect, useRef } from "react";
import Dashboard from "./Dashboard";
import HowToPlayModal from "./HowToPlayModal";
import PowerUpsModal from "./PowerUpsModal";
import GameOverModal from "./GameOverModal";
import backgroundMusic from "../assets/audio.mp3";
import "../CSS/GameScreen.css";
import "../CSS/Car.css";
import "../CSS/Obstacle.css";
import "../CSS/Fuel.css"; // Import the Fuel.css

// Initial game settings
const initialFuel = 100;
const fuelConsumptionRate = 0.5;
const collisionFuelPenalty = 10;
const fuelPickupAmount = 20;
const initialGameSpeed = 50;
const initialObstacleMoveSpeed = 2.5;
const carMoveSpeed = 1;
const CarMarginLeft = 10; // Margin for car on the left
const CarMarginRight = 5; // Margin for car on the right
const ObstacleMarginLeft = 5; // Margin for obstacles on the left
const ObstacleMarginRight = 10; // Margin for obstacles on the right
const FuelPickupMarginLeft = 10; // Margin for fuel pickups on the left
const FuelPickupMarginRight = 10; // Margin for fuel pickups on the right
const scoreIncrementPerSecond = 1; // Define the score increment per second

// Speed increase rates
const gameSpeedIncreaseRate = 0.1; // Rate at which the game speed increases
const obstacleSpeedIncreaseRate = 0.01; // Rate at which the obstacle speed increases

// Obstacle classes for random obstacle pictures
const obstacleClasses = ["obstacle1", "obstacle2", "obstacle3", "obstacle4", "obstacle5", "obstacle6"];

const GameScreen = ({ playerName, selectedVehicle, highScores, setHighScores, onGameEnd }) => {
  const [gamePaused, setGamePaused] = useState(false);
  const [showingScoreboard, setShowingScoreboard] = useState(false);
  const [score, setScore] = useState(0);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showPowerUpsModal, setShowPowerUpsModal] = useState(false);
  const [carPosition, setCarPosition] = useState(50);
  const [fuel, setFuel] = useState(initialFuel);
  const [obstacles, setObstacles] = useState([]);
  const [fuelPickups, setFuelPickups] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasShield, setHasShield] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(initialGameSpeed);
  const [obstacleMoveSpeed, setObstacleMoveSpeed] = useState(initialObstacleMoveSpeed);
  const [showGameOver, setShowGameOver] = useState(false);

  const trackRef = useRef(null);
  const gameLoopInterval = useRef(null);
  const moveInterval = useRef(null);
  const movingLeft = useRef(false);
  const movingRight = useRef(false);

  // Handle music play/pause based on state
  useEffect(() => {
    const music = document.getElementById("backgroundMusic");
    if (isMusicOn) {
      music.play().catch((error) => console.log("Error playing music:", error));
    } else {
      music.pause();
    }
  }, [isMusicOn]);

  // Toggle game pause state
  const togglePause = () => setGamePaused(!gamePaused);

  // End the game and show scoreboard
  const endGame = () => {
    console.log("Game ended");
    setIsPlaying(false);
    setGamePaused(true);
    const newHighScores = [...highScores, { playerName, score: Math.round(score) }];
    newHighScores.sort((a, b) => b.score - a.score);
    setHighScores(newHighScores.slice(0, 5));
    localStorage.setItem('highScores', JSON.stringify(newHighScores.slice(0, 5)));
    setShowGameOver(true);
    onGameEnd();
  };  

  // Show the scoreboard
  const showScoreboard = () => {
    setShowingScoreboard(true);
    setGamePaused(false);
  };

  // Restart the game with initial settings
  const restartGame = () => {
    setScore(0);
    setFuel(initialFuel);
    setGamePaused(false);
    setShowingScoreboard(false);
    setIsPlaying(true);
    setHasShield(false);
    setGameSpeed(initialGameSpeed);
    setObstacleMoveSpeed(initialObstacleMoveSpeed);
    setShowGameOver(false);
  };

  // Toggle music state
  const toggleMusic = () => {
    setIsMusicOn(!isMusicOn);
  };

  // Show the "How to Play" modal
  const handleHowToPlay = () => {
    setShowHowToPlay(true);
  };

  // Close the "How to Play" modal
  const closeHowToPlayModal = () => {
    setShowHowToPlay(false);
    if (gamePaused) setGamePaused(true);
  };

  // Handle key down events for car movement and pause
  const handleKeyDown = (e) => {
    if (gamePaused && e.key !== " ") return;

    if (e.key === "ArrowLeft") {
      movingLeft.current = true;
      movingRight.current = false;
    } else if (e.key === "ArrowRight") {
      movingRight.current = true;
      movingLeft.current = false;
    } else if (e.key === " ") {
      togglePause(); // Toggle pause on spacebar press
    }
  };

  // Handle key up events for car movement
  const handleKeyUp = (e) => {
    if (e.key === "ArrowLeft") {
      movingLeft.current = false;
    } else if (e.key === "ArrowRight") {
      movingRight.current = false;
    }
  };

  // Show the power-ups modal
  const handlePowerUpsClick = () => {
    setShowPowerUpsModal(true);
    if (gamePaused) setGamePaused(true);
  };

  // Close the power-ups modal
  const closePowerUpsModal = () => {
    setShowPowerUpsModal(false);
  };

  // Handle dropping power-ups onto the game screen
  const handleDrop = (event) => {
    event.preventDefault();
    const powerUpType = event.dataTransfer.getData('powerUpType');
    if (powerUpType === 'Shield') {
      setHasShield(true);
    } else if (powerUpType === 'Invincible') {
      // Activate invincible power-up
    } else if (powerUpType === 'Fuel') {
      // Activate fuel power-up
      setFuel((prevFuel) => Math.min(prevFuel + fuelPickupAmount, 100));
    }
  };

  // Handle drag over event for power-ups
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Attach and detach keydown/keyup event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gamePaused]);

  // Start and stop the game loop based on play/pause state
  useEffect(() => {
    if (isPlaying && !gamePaused) {
      gameLoopInterval.current = setInterval(gameLoop, gameSpeed);
    } else {
      clearInterval(gameLoopInterval.current);
    }
    return () => clearInterval(gameLoopInterval.current);
  }, [isPlaying, gamePaused, fuel, obstacles, fuelPickups, gameSpeed]);

  // Handle car movement based on key press state
  useEffect(() => {
    if (isPlaying && !gamePaused) {
      moveInterval.current = setInterval(() => {
        const trackWidth = trackRef.current ? trackRef.current.offsetWidth : 700;
        const carWidth = trackRef.current ? trackRef.current.querySelector('.car').offsetWidth : 50;

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

  // Main game loop
  const gameLoop = () => {
    setFuel((prev) => {
      const newFuel = Math.max(prev - fuelConsumptionRate, 0);
      if (newFuel === 0) {
        endGame(); // Call endGame function if fuel runs out
      }
      return newFuel;
    });

    setScore((prev) => prev + (scoreIncrementPerSecond * gameSpeed) / 1000);

    setObstacles((prev) =>
      prev
        .map((obstacle) => ({ ...obstacle, y: obstacle.y + obstacleMoveSpeed }))
        .filter((obstacle) => obstacle.y < 100)
    );

    setFuelPickups((prev) =>
      prev
        .map((fuelPickup) => ({ ...fuelPickup, y: fuelPickup.y + obstacleMoveSpeed }))
        .filter((fuelPickup) => fuelPickup.y < 100)
    );

    checkCollisions();
    spawnElements();

    // Increase speed over time
    setGameSpeed((prev) => Math.max(prev - gameSpeedIncreaseRate, 10)); // Use variable for game speed increase rate
    setObstacleMoveSpeed((prev) => prev + obstacleSpeedIncreaseRate); // Use variable for obstacle speed increase rate
  };

  // Check for collisions between the car and obstacles/fuel pickups
  const checkCollisions = () => {
    const trackWidth = trackRef.current ? trackRef.current.offsetWidth : 700;
    const carWidth = 55; // Adjusted to match the CSS
    const carHeight = 100; // Adjusted to match the CSS
    const carLeft = (carPosition / 100) * trackWidth;
    const carRight = carLeft + carWidth;
    const carTop = trackRef.current ? trackRef.current.offsetHeight - carHeight : 0;
    const carBottom = carTop + carHeight;
    const carElement = document.querySelector('.car');

    console.log(`Car: left=${carLeft}, right=${carRight}, top=${carTop}, bottom=${carBottom}`);

    obstacles.forEach((obstacle, index) => {
      const obstacleElement = document.querySelectorAll('.obstacle')[index];
      if (obstacleElement && carElement) {
        const carRect = carElement.getBoundingClientRect();
        const obstacleRect = obstacleElement.getBoundingClientRect();

        if (
          carRect.left < obstacleRect.left + obstacleRect.width &&
          carRect.left + carRect.width > obstacleRect.left &&
          carRect.top < obstacleRect.top + obstacleRect.height &&
          carRect.top + carRect.height > obstacleRect.top
        ) {
          console.log("Collision with obstacle detected!");
          if (hasShield) {
            setHasShield(false); // Deactivate shield after collision
          } else {
            setFuel((prevFuel) => prevFuel - collisionFuelPenalty);
          }
          setObstacles((prev) => prev.filter((_, i) => i !== index));
        }
      }
    });

    fuelPickups.forEach((fuelPickup, index) => {
      const fuelPickupLeft = (fuelPickup.x / 100) * trackWidth;
      const fuelPickupRight = fuelPickupLeft + 30;
      const fuelPickupTop = fuelPickup.y;
      const fuelPickupBottom = fuelPickupTop + 30;
      const fuelPickupElement = document.querySelectorAll('.fuel-pickup')[index];

      console.log(`Fuel Pickup ${index}: left=${fuelPickupLeft}, right=${fuelPickupRight}, top=${fuelPickupTop}, bottom=${fuelPickupBottom}`);

      if (fuelPickupElement && carElement) {
        const carRect = carElement.getBoundingClientRect();
        const fuelPickupRect = fuelPickupElement.getBoundingClientRect();

        if (
          carRect.left < fuelPickupRect.left + fuelPickupRect.width &&
          carRect.left + carRect.width > fuelPickupRect.left &&
          carRect.top < fuelPickupRect.top + fuelPickupRect.height &&
          carRect.top + carRect.height > fuelPickupRect.top
        ) {
          console.log("Fuel pickup detected!");
          setFuel((prevFuel) => Math.min(prevFuel + fuelPickupAmount, 100));
          setFuelPickups((prev) => prev.filter((_, i) => i !== index));
        }
      }
    });
  };

  // Spawn new obstacles and fuel pickups at random intervals
  const spawnElements = () => {
    if (Math.random() < 0.1) {
      const randomObstacleClass = obstacleClasses[Math.floor(Math.random() * obstacleClasses.length)];
      setObstacles((prev) => [
        ...prev,
        {
          x: Math.random() * (100 - ObstacleMarginLeft - ObstacleMarginRight) + ObstacleMarginLeft,
          y: 0,
          className: randomObstacleClass,
        },
      ]);
    }
    if (Math.random() < 0.05) {
      setFuelPickups((prev) => [
        ...prev,
        {
          x: Math.random() * (100 - FuelPickupMarginLeft - FuelPickupMarginRight) + FuelPickupMarginLeft,
          y: 0,
        },
      ]);
    }
  };

  // Geolocation success callback
  const successCallback = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    alert(
      "Your coordinates are: " +
        latitude +
        ", " +
        longitude +
        "\n\nOpening Google Maps in a new tab"
    );

    window.open(googleMapsLink, "_blank");
  };

  // Method to get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, (error) => {
        console.error("Error getting location:", error);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
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
      {gamePaused && !showingScoreboard && !showPowerUpsModal && !showHowToPlay && !showGameOver ? (
        <div className="pause-menu">
          <button onClick={() => setGamePaused(false)}>Resume Game</button>
          <button onClick={() => setShowPowerUpsModal(true)}>Power-ups</button>
          <button onClick={endGame}>End Race</button>
          <button onClick={() => setShowHowToPlay(true)}>How to Play</button>
          <button onClick={toggleMusic}>{isMusicOn ? 'Music On' : 'Music Off'}</button>
          <button onClick={restartGame}>Restart</button>
          <button onClick={getCurrentLocation}>Get Current Location</button>
        </div>
      ) : !showGameOver && (
        <button onClick={togglePause} className="pause-button">
          Pause
        </button>
      )}
      <div className="track" ref={trackRef} onDrop={handleDrop} onDragOver={handleDragOver}>
        <div
          className={`car ${hasShield ? 'shielded' : ''}`}
          style={{
            left: `${carPosition}%`,
            backgroundImage: `url(${selectedVehicle.image})`
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
      <div className="fuel-bar">
        Fuel: {fuel.toFixed(1)}
      </div>
      {showGameOver && (
        <GameOverModal
          isOpen={showGameOver}
          playerName={playerName}
          score={score}
          highScores={highScores}
          onTryAgain={restartGame}
          onGoHome={onGameEnd}
        />
      )}
    </div>
  );  
};

export default GameScreen;
