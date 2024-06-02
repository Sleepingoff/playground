import Particle from "../particle/particle.js";
import Spark from "../particle/spark.js";
import Tail from "../particle/tail.js";
import CanvasOption from "./js/CanvasOption.js";
import { randomNumBetween, hypotenuse } from "./js/utils.js";

class Canvas extends CanvasOption {
  constructor() {
    super();
    this.particles = [];
    this.tails = [];
    this.colors = [];
    this.sparks = [];
  }

  init() {
    this.canvasWidth = innerWidth;
    this.canvasHeight = innerHeight;
    this.canvas.width = this.canvasWidth * this.dpr;
    this.canvas.height = this.canvasHeight * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.canvas.style.width = this.canvasWidth + "px";
    this.canvas.style.height = this.canvasHeight + "px";

    this.fillColors();
  }
  fillColors() {
    this.colors = randomNumBetween(0, 360);
    return this.colors;
  }
  createTail(colors) {
    const x = randomNumBetween(this.canvasWidth * 0.2, this.canvasWidth * 0.8);
    const vy = this.canvasHeight * randomNumBetween(-0.01, -0.015);
    const vx = randomNumBetween(-1, 1);
    this.tails.push(new Tail(x, vx, vy, colors));
  }
  createParticles(x, y, colors) {
    const PARTICLE_NUM = 400;
    // const x = randomNumBetween(0, this.canvasWidth);
    // const y = randomNumBetween(0, this.canvasHeight);
    for (let i = 0; i < PARTICLE_NUM; i++) {
      const r =
        randomNumBetween(2, 100) * hypotenuse(innerWidth, innerHeight) * 0.0001;
      const angle = (Math.PI / 100) * randomNumBetween(0, 360);
      const vx = r * Math.cos(angle);
      const vy = r * Math.sin(angle);
      const opacity = randomNumBetween(0.6, 0.9);

      this.particles.push(new Particle(x, y, vx, vy, opacity, colors));
    }
  }

  createSparks(x, y, colors) {
    const SPARK_NUM = 20;
    for (let i = 0; i < SPARK_NUM; i++) {
      this.sparks.push(new Spark(x, y, colors, 0.5));
    }
  }

  render() {
    let now, delta;
    let then = Date.now();

    const frame = () => {
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - then;
      const colors = this.fillColors();
      if (delta < this.interval) return;

      // this.ctx.fillStyle = this.bgColor + "50";
      this.ctx.fillStyle = `rgba(255,255,255,${this.particles.length / 50000})`;
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      if (Math.random() < 0.03) this.createTail(colors);
      this.tails.forEach((tail, index) => {
        tail.update();
        tail.draw();
        if (tail.vy > -0.7) {
          this.tails.splice(index, 1);

          this.createParticles(tail.x, tail.y, colors);
        }
      });

      this.particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        //opacity가 0 이하인 파티클 제거
        if (Math.random() < 0.01)
          this.createSparks(particle.x, particle.y, [200, 200, 200]);
        if (particle.opacity < 0) this.particles.splice(index, 1);
      });

      this.sparks.forEach((spark, index) => {
        spark.update();
        spark.draw();
        if (spark.opacity < 0) this.sparks.splice(index, 1);
      });
      then = now - (delta % this.interval);
    };

    requestAnimationFrame(frame);
  }
}

const canvas = new Canvas();
window.addEventListener("load", () => {
  canvas.init();
  canvas.render();
});

window.addEventListener("resize", () => {
  init();
});
