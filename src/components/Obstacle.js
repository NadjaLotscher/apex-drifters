class Obstacle {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  update() {
    this.y += this.speed;
    console.log(`Obstacle updated: x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}`);
  }

  draw(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  collidesWith(rect) {
    return !(
      rect.y > this.y + this.height ||
      rect.y + rect.height < this.y ||
      rect.x > this.x + this.width ||
      rect.x + rect.width < this.x
    );
  }
}

export default Obstacle;
