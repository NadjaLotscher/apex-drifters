import React, { useState } from 'react';
import '../CSS/StartScreen.css'; // Make sure to create a CSS file for styling

const StartScreen = ({ onStartGame }) => {
  // State can be used here if needed, for example, to handle form inputs
  const [playerName, setPlayerName] = useState('');

  return (
    <div className="start-screen">
      <h1>Apex Drifters</h1>
      <input
        type="text"
        placeholder="Enter your name..."
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={() => onStartGame(playerName)}>Start Game</button>
    </div>
  );
};

export default StartScreen;