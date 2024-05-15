import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import './CSS/App.css';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState('');

  // Function to start the game
  const startGame = (playerName) => {
    console.log('Game started with player:', playerName);
    setPlayerName(playerName); // add save the player's name
    setGameStarted(true); // Update the state to indicate the game has started
  };

  const endGame = () => {
    console.log("Game ended");
    setGameStarted(false); 
    setPlayerName('');
  };

  return (
    <div className="App">
      {gameStarted ? (
        <GameScreen playerName={playerName} onGameEnd={endGame} />
      ) : (
        <StartScreen onStartGame={startGame} />
      )}
    </div>
  );
};

export default App;