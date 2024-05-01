import React, { useState } from 'react';
import Scoreboard from './Scoreboard';
import StartScreen from './StartScreen'; // Ensure you import StartScreen for navigation
import '../CSS/GameScreen.css';

const GameScreen = ({ playerName, onGameEnd }) => {
  const [gamePaused, setGamePaused] = useState(false);
  const [score, setScore] = useState(0);
  const [showingScoreboard, setShowingScoreboard] = useState(false);

  const togglePause = () => {
    setGamePaused(!gamePaused);
  };

  const endGame = () => {
    onGameEnd(); // Assuming onGameEnd resets the game and navigates back to StartScreen
    setGamePaused(false);
    setShowingScoreboard(false);
  };

  const showScoreboard = () => {
    setShowingScoreboard(true);
    setGamePaused(false); // Optionally close the pause menu
  };

  const restartGame = () => {
    console.log("Game restarted");
    setScore(0);
    setGamePaused(false);
    setShowingScoreboard(false); // Ensure scoreboard is not displayed when restarting
  };

  const openSettings = () => {
    console.log("Settings opened");
  };

  const showHelp = () => {
    console.log("Help/How to Play displayed");
  };

  return (
    <div className="game-screen">
      {gamePaused && !showingScoreboard ? (
        <div className="pause-menu">
          <button onClick={() => setGamePaused(false)}>Resume Game</button>
          <button onClick={endGame}>End Race</button>
          <button onClick={showScoreboard}>Scoreboard</button>
          <button onClick={openSettings}>Settings</button>
          <button onClick={showHelp}>Help/How to Play</button>
          <button onClick={restartGame}>Restart</button>
        </div>
      ) : showingScoreboard ? (
        <Scoreboard score={score} onBack={() => setShowingScoreboard(false)} />
      ) : (
        <div>
          <div className="dashboard">
            <div className="score-board">Score: {score}</div>
            <div className="fuel-gauge">Fuel: 100%</div>
          </div>
          <div className="track">
            <div className="player-car"></div>
            <button onClick={togglePause}>Pause</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
