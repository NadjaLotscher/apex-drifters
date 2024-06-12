class GameLoopController {
  constructor(
    updateFuel,
    updateScore,
    endGame,
    updateObstacles,
    updateFuelPickups,
    checkCollisions,
    spawnElements
  ) {
    this.updateFuel = updateFuel;
    this.updateScore = updateScore;
    this.endGame = endGame;
    this.updateObstacles = updateObstacles;
    this.updateFuelPickups = updateFuelPickups;
    this.checkCollisions = checkCollisions;
    this.spawnElements = spawnElements;
    this.interval = null;
    this.initialGameSpeed = 50;
    this.gameSpeed = this.initialGameSpeed; 
    this.speedIncrement = 0.05;
  }

  start() {
    this.runLoop();
  }

  stop() {
    clearInterval(this.interval);
  }

  pause() {
    clearInterval(this.interval);
  }

  runLoop() {
    this.interval = setInterval(() => {
      this.updateFuel();
      this.updateScore();
      this.updateObstacles();
      this.updateFuelPickups();
      this.checkCollisions();
      this.spawnElements();
      this.incrementSpeed();
    }, this.gameSpeed);
  }

  incrementSpeed() {
    this.gameSpeed = Math.max(1, this.gameSpeed - this.speedIncrement); // Ensure game speed does not drop below 1 ms
    clearInterval(this.interval);
    this.runLoop(); // Restart the loop with the new speed
  }

  resetSpeed() {
      this.gameSpeed = this.initialGameSpeed;
  }
}

export default GameLoopController;