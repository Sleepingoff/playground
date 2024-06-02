import CanvasOption from "../boilerplate/js/CanvasOption.js";

export default class Tail extends CanvasOption {
  constructor(x, vx, vy, color) {
    super();
    this.x = x;
    this.y = this.canvasHeight;
    this.vy = vy;
    this.vx = vx;
    this.color = color;
    this.friction = 0.985;
  }

  update() {
    this.vy *= this.friction;
    this.y += this.vy;
    this.x += this.vx;
    this.opacity = -this.vy;
  }
  draw() {
    this.ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }
}
