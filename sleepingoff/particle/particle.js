import CanvasOption from "../boilerplate/js/CanvasOption.js";

export default class Particle extends CanvasOption {
  constructor(x, y, vx, vy, opacity, color) {
    super();
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.opacity = opacity;
    this.gravity = 0.12;
    this.friction = 0.93;
    this.color = color;
    this.r = 1.5;
  }

  update() {
    this.vy += this.gravity;
    this.vy *= this.friction;
    this.vx *= this.friction;

    this.y += this.vy;
    this.x += this.vx;

    this.opacity -= 0.02;
    this.r -= 0.02;
  }

  draw() {
    this.ctx.fillStyle = `hsla(${this.color}, 100%, 65%, ${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }
}
