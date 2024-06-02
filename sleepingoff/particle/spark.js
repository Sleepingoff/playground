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
    this.opacity -= 0.1;
  }
  draw() {
    this.ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }
}
