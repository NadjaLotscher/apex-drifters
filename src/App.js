import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import VehicleSelectionScreen from './components/VehicleSelectionScreen';
import './CSS/App.css';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [playerName, setPlayerName] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleStartGame = (playerName) => {
    setPlayerName(playerName);
    setCurrentScreen('selectVehicle');
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentScreen('game');
  };

  const handleGameEnd = () => {
    setCurrentScreen('start');
    setPlayerName('');
    setSelectedVehicle(null);
  };

  return (
    <div className="App">
      {currentScreen === 'start' && <StartScreen onStartGame={handleStartGame} />}
      {currentScreen === 'selectVehicle' && <VehicleSelectionScreen onSelectVehicle={handleSelectVehicle} />}
      {currentScreen === 'game' && <GameScreen playerName={playerName} selectedVehicle={selectedVehicle} onGameEnd={handleGameEnd} />}
    </div>
  );
};

export default App;
