import CanvasOption from "./js/CanvasOption.js";
import Particle from "./js/Particle.js";

class Canvas extends CanvasOption {
  constructor(r) {
    super();
    this.r = r;
    this.particles = [];
  }

  drawRing() {
    const gradient = this.ctx.createLinearGradient(
      this.canvasWidth,
      0,
      0,
      this.canvasHeight
    );
    gradient.addColorStop(0, "#ffffff55");
    gradient.addColorStop(0.5, "#ffffff00");
    gradient.addColorStop(1, "#ffffff55");

    this.ctx.strokeStyle = gradient;

    this.ctx.beginPath();
    this.ctx.arc(
      this.canvasWidth / 2,
      this.canvasHeight / 2,
      this.r,
      0,
      Math.PI * 2
    );
    this.ctx.stroke();
    this.ctx.closePath();
  }

  createParticles() {
    const PARTICLE_NUM = 500;
    for (let i = 0; i < PARTICLE_NUM; i++) {
      this.particles.push(new Particle(this.r));
    }
  }

  render() {
    let then = Date.now();
    let now, delta;

    const frame = () => {
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - this.then;
      if (delta < this.interval) return;
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const particle = this.particles[i];
        particle.update();
        particle.draw();

        if (particle.opacity < 0) this.particles.splice(1, 1);
      }
      this.drawRing();

      then = now - (delta % this.interval);
    };

    requestAnimationFrame(frame);
  }
}
const span = document.querySelector("#time");

const r = 100;
const canvas = new Canvas(r);

window.addEventListener("load", () => {
  canvas.init();
  canvas.render();
});

window.addEventListener("resize", () => {
  canvas.init();
});

let invervalID;
const countDown = 3;
window.addEventListener("click", () => {
  let time = 0;
  invervalID = setInterval(
    () => {
      updateTimeStamp(countDown - time);
      if (time === countDown) {
        canvas.createParticles();
        clearInterval(invervalID);
      }
      time++;
    },
    1000,
    time
  );
});

function updateTimeStamp(timeStamp) {
  span.textContent = `${timeStamp}`;
}
