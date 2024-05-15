import React from 'react';
import '../CSS/Car.css';

const Car = ({ position }) => {
  const carStyle = {
    left: `${position.x}%`,
    bottom: `${position.y}%`
  };

  return (
    <div className="player-car" style={carStyle}>
      {/* This div will use styles from Car.css to show the car image */}
    </div>
  );
};

export default Car;
