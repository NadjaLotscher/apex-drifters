// controllers/CarController.js

class CarController {
    constructor(trackRef, setCarPosition, carMoveSpeed, CarMarginLeft, CarMarginRight, togglePause) {
      this.trackRef = trackRef;
      this.setCarPosition = setCarPosition;
      this.carMoveSpeed = carMoveSpeed;
      this.CarMarginLeft = CarMarginLeft;
      this.CarMarginRight = CarMarginRight;
      this.togglePause = togglePause;
      this.movingLeft = false;
      this.movingRight = false;
      this.moveInterval = null;
  
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleKeyUp = this.handleKeyUp.bind(this);
    }
  
    startMoving() {
      this.moveInterval = setInterval(() => {
        const trackWidth = this.trackRef.current ? this.trackRef.current.offsetWidth : 700;
        const carWidth = this.trackRef.current ? this.trackRef.current.querySelector(".car").offsetWidth : 50;
  
        if (this.movingLeft) {
          this.setCarPosition((prev) => Math.max(prev - this.carMoveSpeed, this.CarMarginLeft));
        }
        if (this.movingRight) {
          this.setCarPosition((prev) => Math.min(prev + this.carMoveSpeed, 100 * (trackWidth - carWidth) / trackWidth - this.CarMarginRight));
        }
      }, 5);
    }
  
    stopMoving() {
      clearInterval(this.moveInterval);
    }
  
    handleKeyDown(e) {
      if (e.key === "ArrowLeft") {
        this.movingLeft = true;
        this.movingRight = false;
      } else if (e.key === "ArrowRight") {
        this.movingRight = true;
        this.movingLeft = false;
      } else if (e.key === " ") {
        this.togglePause();
      }
    }
  
    handleKeyUp(e) {
      if (e.key === "ArrowLeft") {
        this.movingLeft = false;
      } else if (e.key === "ArrowRight") {
        this.movingRight = false;
      }
    }
  
    addEventListeners() {
      window.addEventListener("keydown", this.handleKeyDown);
      window.addEventListener("keyup", this.handleKeyUp);
    }
  
    removeEventListeners() {
      window.removeEventListener("keydown", this.handleKeyDown);
      window.removeEventListener("keyup", this.handleKeyUp);
    }
  }
  
  export default CarController;  