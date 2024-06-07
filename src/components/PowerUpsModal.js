import React from 'react';
import shieldImage from '../assets/Pictures/shield.png';
import invincibleImage from '../assets/Pictures/invincible.png';
import fuelImage from '../assets/Pictures/fuel.png';
import '../CSS/PowerUps.css';

const PowerUpsModal = ({ isOpen, onClose, selectedVehicle, setHasShield }) => {
  if (!isOpen) return null;

  const handleDragStart = (event, powerUpType) => {
    event.dataTransfer.setData('powerUpType', powerUpType);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const powerUpType = event.dataTransfer.getData('powerUpType');
    if (powerUpType === 'Shield') {
      setHasShield(true);
    }
    onClose();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>Power-ups</h4>
        <div className="power-ups-list">
          <div className="power-up-item" draggable onDragStart={(e) => handleDragStart(e, 'Shield')}>
            <img src={shieldImage} alt="Shield" />
            <p>Shield</p>
          </div>
          <div className="power-up-item" draggable onDragStart={(e) => handleDragStart(e, 'Invincible')}>
            <img src={invincibleImage} alt="Invincible" />
            <p>Invincible</p>
          </div>
          <div className="power-up-item" draggable onDragStart={(e) => handleDragStart(e, 'Fuel')}>
            <img src={fuelImage} alt="Fuel" />
            <p>Fuel</p>
          </div>
        </div>
        <div className="vehicle-display">
          <img 
            src={selectedVehicle.image} 
            alt={selectedVehicle.name} 
            style={{ width: '100px', height: 'auto' }}
            className="vehicle-in-modal" 
            onDrop={handleDrop} 
            onDragOver={handleDragOver}
          />
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PowerUpsModal;
