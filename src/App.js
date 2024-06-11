import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import VehicleSelectionScreen from './components/VehicleSelectionScreen';
import GameOverModal from './components/GameOverModal';
import './CSS/App.css';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start', 'selectVehicle', 'game', 'gameOver'
  const [playerName, setPlayerName] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [highScores, setHighScores] = useState(() => {
    const savedScores = localStorage.getItem('highScores');
    return savedScores ? JSON.parse(savedScores) : [];
  });

  const handleStartGame = (playerName) => {
    setPlayerName(playerName);
    setCurrentScreen('selectVehicle');
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentScreen('game');
  };

  const handleGameEnd = (score) => {
    const newHighScores = [...highScores, { playerName, score: Math.round(score) }];
    newHighScores.sort((a, b) => b.score - a.score);
    const topScores = newHighScores.slice(0, 5);
    setHighScores(topScores);
    localStorage.setItem('highScores', JSON.stringify(topScores));
    setCurrentScreen('gameOver');
  };

  const handleTryAgain = () => {
    setCurrentScreen('game');
  };

  const handleGoHome = () => {
    setPlayerName('');
    setSelectedVehicle(null);
    setCurrentScreen('start');
  };

  return (
    <div className="App">
      {currentScreen === 'start' && <StartScreen onStartGame={handleStartGame} />}
      {currentScreen === 'selectVehicle' && (
        <VehicleSelectionScreen onSelectVehicle={handleSelectVehicle} />
      )}
      {currentScreen === 'game' && (
        <GameScreen
          playerName={playerName}
          selectedVehicle={selectedVehicle}
          onGameEnd={handleGameEnd}
          highScores={highScores}
          setHighScores={setHighScores}
          onGoHome={handleGoHome}
        />
      )}
      {currentScreen === 'gameOver' && (
        <GameOverModal
          isOpen={true}
          score={highScores.length ? highScores[0].score : 0}
          playerName={playerName}
          highScores={highScores}
          onTryAgain={handleTryAgain}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
};

export default App;
