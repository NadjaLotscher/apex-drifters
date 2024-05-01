import React from 'react';
import '../CSS/Scoreboard.css'; // Ensure you have the corresponding CSS file for styling

const Scoreboard = ({ score, onRestart }) => {
  return (
    <div className="scoreboard">
      <h2>Game Over!</h2>
      <p>Your score: {score}</p>
      <button onClick={onRestart}>Restart Game</button>
    </div>
  );
};

export default Scoreboard;
