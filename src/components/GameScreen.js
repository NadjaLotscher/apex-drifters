
import PowerUpsModal from './PowerUpsModal';

import React, { useState, useEffect, useRef } from "react";
import Dashboard from "./Dashboard";
import HowToPlayModal from "./HowToPlayModal";
import backgroundMusic from "../assets/audio.mp3";
import carImage from "../assets/car_03.png";
import "../CSS/GameScreen.css";
import "../CSS/Car.css";
import "../CSS/Obstacle.css";

const initialFuel = 100;
const fuelConsumptionRate = 0.1;
const collisionFuelPenalty = 0.5;
const fuelPickupAmount = 20;
const gameSpeed = 50; 
const carMoveSpeed = 1; // Increased speed of the car's smooth movement
const obstacleMoveSpeed = 2.5; // Decreased obstacle/fuel movement speed


const GameScreen = ({ playerName, onGameEnd }) => {
  const [gamePaused, setGamePaused] = useState(false);
  const [showingScoreboard, setShowingScoreboard] = useState(false);
  const [score, setScore] = useState(0);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [carPosition, setCarPosition] = useState(50); // Initial car position (percentage)
  const [fuel, setFuel] = useState(initialFuel);
  const [obstacles, setObstacles] = useState([]);
  const [fuelPickups, setFuelPickups] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);

  const trackRef = useRef(null);
  const gameLoopInterval = useRef(null);
  const moveInterval = useRef(null);
  const movingLeft = useRef(false);
  const movingRight = useRef(false);

  useEffect(() => {
    const music = document.getElementById("backgroundMusic");
    if (isMusicOn) {
      music.play().catch((error) => console.log("Error playing music:", error));
    } else {
      music.pause();
    }
  }, [isMusicOn]);


  const togglePause = () => {
    setGamePaused(!gamePaused);
  };

  const [showPowerUpsModal, setShowPowerUpsModal] = useState(false);

const handlePowerUpsClick = () => {
  setShowPowerUpsModal(true); // Pour afficher la modal
};



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
    setGamePaused(false);
    setShowingScoreboard(false);
  };

  const toggleMusic = () => {
    setIsMusicOn(!isMusicOn);
  };

  const handleHowToPlay = () => {
    setShowHowToPlay(true); 
  };

  const closeHowToPlay = () => {
    setShowHowToPlay(false); 
  };

  const handleKeyDown = (e) => {
    if (gamePaused) return;

    if (e.key === "ArrowLeft") {
      movingLeft.current = true;
      movingRight.current = false;
    } else if (e.key === "ArrowRight") {
      movingRight.current = true;
      movingLeft.current = false;
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "ArrowLeft") {
      movingLeft.current = false;
    } else if (e.key === "ArrowRight") {
      movingRight.current = false;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gamePaused]);

  useEffect(() => {
    if (isPlaying && !gamePaused) {
      gameLoopInterval.current = setInterval(gameLoop, gameSpeed);
    } else {
      clearInterval(gameLoopInterval.current);
    }
    return () => clearInterval(gameLoopInterval.current);
  }, [isPlaying, gamePaused, fuel, obstacles, fuelPickups]);

  useEffect(() => {
    if (isPlaying && !gamePaused) {
      moveInterval.current = setInterval(() => {
        const trackWidth = trackRef.current ? trackRef.current.offsetWidth : 700;
        const carWidth = trackRef.current ? trackRef.current.querySelector('.car').offsetWidth : 50;

        if (movingLeft.current) {
          setCarPosition((prev) => Math.max(prev - carMoveSpeed, 0));
        }
        if (movingRight.current) {
          setCarPosition((prev) => Math.min(prev + carMoveSpeed, 100 * (trackWidth - carWidth) / trackWidth));
        }
      }, 5); // Adjust this value for smoother movement
    } else {
      clearInterval(moveInterval.current);
    }
    return () => clearInterval(moveInterval.current);
  }, [isPlaying, gamePaused]);

  const gameLoop = () => {
    setFuel((prev) => Math.max(prev - fuelConsumptionRate, 0));

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
  };

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
          setFuel((prevFuel) => prevFuel - collisionFuelPenalty);
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
          setFuelPickups((prev) => prev.filter((fp) => fp !== fuelPickup));
        }
      }
    });
  };

  const spawnElements = () => {
    if (Math.random() < 0.1) {
      setObstacles((prev) => [...prev, { x: Math.random() * 100, y: 0 }]);
    }
    if (Math.random() < 0.05) {
      setFuelPickups((prev) => [...prev, { x: Math.random() * 100, y: 0 }]);
    }
  };

  return (
    <div className="game-screen">

      <PowerUpsModal isOpen={showPowerUpsModal} onClose={() => setShowPowerUpsModal(false)} />
     
      <audio id="backgroundMusic" src={backgroundMusic} loop />
      {showHowToPlay && (
        <HowToPlayModal
          isOpen={showHowToPlay}
          onClose={closeHowToPlay}
          text="Use the arrow keys to move the car left and right. Avoid obstacles and collect fuel to keep going!"
        />
      )}
      <Dashboard score={score} fuel={fuel} />
      {gamePaused ? (
        <div className="pause-menu">
          <button onClick={togglePause}>Resume Game</button>
          <button onClick={endGame}>End Race</button>
          <button onClick={handleHowToPlay}>How to Play</button>
          <button onClick={toggleMusic}>
            {isMusicOn ? "Music On" : "Music Off"}
          </button>
          <button onClick={restartGame}>Restart</button>
        </div>
      ) : (
        <button onClick={togglePause} className="pause-button">
          Pause
        </button>
      )}
      <div className="track" ref={trackRef}>
        <div
          className="car"
          style={{ left: `${carPosition}%` }}
        ></div>
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            className="obstacle"
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
    </div>
  );
};

export default GameScreen;
