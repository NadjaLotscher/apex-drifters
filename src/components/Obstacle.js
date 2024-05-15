import React from 'react';
import '../CSS/Obstacle.css'; // Add your obstacle styles here

const Obstacle = ({ position }) => {
  const obstacleStyle = {
    left: `${position.x}%`,
    top: `${position.y}%`
  };

  return <div className="obstacle" style={obstacleStyle}></div>;
};

export default Obstacle;
