import React, { useState, useEffect } from 'react';
import '../CSS/VehicleSelectionScreen.css';

// Import des images directement
import blueCarImage from '../assets/Pictures/BlueCar.png';
import orangeCarImage from '../assets/Pictures/OrangeCar.png';
import pinkCarImage from '../assets/Pictures/PinkCar.png';
import greyCarImage from '../assets/Pictures/GreyCar.png';

const vehicles = [
  { name: 'Blue Car', image: blueCarImage },
  { name: 'Orange Car', image: orangeCarImage },
  { name: 'Pink Car', image: pinkCarImage },
  { name: 'Grey Car', image: greyCarImage }
];

const VehicleSelectionScreen = ({ onSelectVehicle }) => {
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
