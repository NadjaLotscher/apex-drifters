import React from 'react';
import '../CSS/GameOverModal.css';

const GameOverModal = ({ isOpen, score, highScores, playerName, onTryAgain, onGoHome }) => {
  if (!isOpen) return null;

  return (
    <div className="modal game-over-modal">
      <div className="modal-content">
        <h1 style={{ color: 'red' }}>GAME OVER!</h1>
        <p style={{ color: 'green' }}>CURRENT SCORE: {Math.round(score)}</p>
        <h2>HIGH SCORES</h2>
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>SCORE</th>
            </tr>
          </thead>
          <tbody>
            {highScores.map((entry, index) => (
              <tr key={index}>
                <td>{entry.playerName}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-buttons">
          <button onClick={onTryAgain}>Try Again</button>
          <div className="spacer"></div>
          <button onClick={onGoHome}>Home</button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
