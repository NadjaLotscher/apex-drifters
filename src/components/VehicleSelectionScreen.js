import React, { useState, useEffect } from 'react';
import '../CSS/VehicleSelectionScreen.css';

const VehicleSelectionScreen = ({ vehicles, onSelectVehicle }) => {
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);

  useEffect(() => {
  const handleKeyPress = (event) => {
    if (event.key === 'ArrowRight') {
      setSelectedVehicleIndex((prevIndex) => (prevIndex + 1) % vehicles.length);
    } else if (event.key === 'ArrowLeft') {
      setSelectedVehicleIndex((prevIndex) => (prevIndex - 1 + vehicles.length) % vehicles.length);
    }
  };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [vehicles.length]);

  if (!vehicles || vehicles.length === 0) {
    return <div>Loading vehicles...</div>; // ou une autre gestion d'erreur appropriée
  }

  return (
    <div className="vehicle-selection-screen">
      <h1>Choose Your Vehicle</h1>
      <div className="vehicle-display">
        <img src={vehicles[selectedVehicleIndex].image} alt={vehicles[selectedVehicleIndex].name} />
      </div>
      <button onClick={() => onSelectVehicle(vehicles[selectedVehicleIndex])}>Start Game</button>
    </div>
  );
};

export default VehicleSelectionScreen;
