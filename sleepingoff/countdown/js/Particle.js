import CanvasOption from "./CanvasOption.js";
import { randomNumBetween } from "./util.js";

export default class Particle extends CanvasOption {
  constructor(r) {
    super();
    this.r = r;
    this.rAlpha = randomNumBetween(0, 5);
    this.rFliction = randomNumBetween(0.95, 1.01);

    this.angle = randomNumBetween(0, 360);
    this.angleAlpha = randomNumBetween(1, 2);
    this.angleFriction = randomNumBetween(0.97, 0.99);

    this.x =
      this.canvasWidth / 2 + this.r * Math.cos((Math.PI / 100) * this.angle);
    this.y =
      this.canvasHeight / 2 + this.r * Math.sin((Math.PI / 100) * this.angle);

    this.opacity = 55;
  }

  update() {
    this.rAlpha *= this.rFliction;
    this.r += this.rAlpha;

    this.angleAlpha *= this.angleFriction;
    this.angle += this.angleAlpha;
    this.x =
      this.canvasWidth / 2 + this.r * Math.cos((Math.PI / 100) * this.angle);
    this.y =
      this.canvasHeight / 2 + this.r * Math.sin((Math.PI / 100) * this.angle);

    this.opacity -= 1;
  }

  draw() {
    this.ctx.fillStyle = `#ffffff${String(this.opacity).padStart(2, "0")}`;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }
}
