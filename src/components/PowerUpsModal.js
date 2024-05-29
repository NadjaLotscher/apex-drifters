import React from 'react';
import powerUpImage from '../assets/Pictures/PowerupTest.png'; // Assurez-vous que le chemin est correct
import '../CSS/PowerUps.css';

const PowerUpsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>Power-ups</h4>
        <div className="power-ups-list">
          <div className="power-up-item">
            <img src={powerUpImage} alt="Shield" />
            <p>Shield</p>
          </div>
          <div className="power-up-item">
            <img src={powerUpImage} alt="Invincible" />
            <p>Invincible</p>
          </div>
          <div className="power-up-item">
            <img src={powerUpImage} alt="Fuel" />
            <p>Fuel</p>
          </div>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PowerUpsModal;
