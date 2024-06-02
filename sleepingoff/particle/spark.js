import CanvasOption from "../boilerplate/js/CanvasOption.js";

export default class Spark extends CanvasOption {
  constructor(x, y, color, opacity) {
    super();
    this.x = x;
    this.y = y;
    this.color = color;
    this.opacity = opacity;
  }

  update() {
    this.opacity -= 0.05;
  }
  draw() {
    this.ctx.fillStyle = `hsla(${this.color}, 100%, 65%, ${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }
}
