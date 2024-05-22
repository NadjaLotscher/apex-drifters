import React, { useEffect, useRef } from 'react';
import carImage from '../assets/car_03.png';
import '../CSS/Car.css';

const Car = ({ position, setCarDimensions }) => {
  const carRef = useRef();

  useEffect(() => {
    if (carRef.current) {
      const { offsetWidth, offsetHeight } = carRef.current;
      setCarDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [carRef, setCarDimensions]);

  const maxWidth = 70;
  const maxHeight = 70;

  // Load image dimensions
  const image = new Image();
  image.src = carImage;
  const originalWidth = image.width;
  const originalHeight = image.height;

  // Calculate aspect ratio
  const aspectRatio = originalWidth / originalHeight;

  // Calculate scaled dimensions
  let scaledWidth = maxWidth;
  let scaledHeight = maxWidth / aspectRatio;

  if (scaledHeight > maxHeight) {
    scaledHeight = maxHeight;
    scaledWidth = maxHeight * aspectRatio;
  }

  const carStyle = {
    left: `${position.x}%`,
    bottom: `${position.y}%`,
    backgroundImage: `url(${carImage})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    width: `${scaledWidth}px`,
    height: `${scaledHeight}px`
  };

  return (
    <div ref={carRef} className="player-car" style={carStyle}>
      {/* This div will use styles from Car.css to show the car image */}
    </div>
  );
};

export default Car;