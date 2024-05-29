import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import VehicleSelectionScreen from './components/VehicleSelectionScreen'; // Assurez-vous d'importer le nouveau composant
import './CSS/App.css';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start', 'selectVehicle', 'game'
  const [playerName, setPlayerName] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const vehicles = [
    { name: 'Blue Car', image: '/images/BlueCar.png' },
    { name: 'Grey Car', image: '/images/GreyCar.png' },
    { name: 'Orange Car', image: '/images/OrangeCar.png' },
    { name: 'Pink Car', image: '/images/PinkCar.png' }
  ];
  
  
  

  const handleStartGame = (playerName) => {
    setPlayerName(playerName);
    setCurrentScreen('selectVehicle');
  };


  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle); // Suppose que vehicle est l'objet ou l'ID du véhicule sélectionné
    setCurrentScreen('game');
  };

  const handleGameEnd = () => {
    setCurrentScreen('start'); // Retour à l'écran de démarrage pour recommencer
  };

  return (
    <div className="App">
      {currentScreen === 'start' && (
        <StartScreen onStartGame={handleStartGame} />
      )}
      {currentScreen === 'selectVehicle' && (
        <VehicleSelectionScreen vehicles={vehicles} onSelectVehicle={handleSelectVehicle} />
      )}
      {currentScreen === 'game' && (
        <GameScreen playerName={playerName} onGameEnd={handleGameEnd} />

const endGame = () => {
    console.log("Game ended"); // Logging the game end
    setGameStarted(false); // Réinitialiser pour montrer `StartScreen`
    setPlayerName(''); // Clear the player name
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
