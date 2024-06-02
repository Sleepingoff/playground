import ctx, { canvasHeight, canvasWidth } from "./index.js";
//path 그리기를 이용해서 파티클 생성하기
class Particle {
  constructor(x, y, radius, vy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vy = vy;
    this.acc = 1.03;
    //0.9등 1보다 작은 수를 곱하면 서서히 멈춘다. 0 으로 수렴하기 때문
  }
  update() {
    this.vy *= this.acc;
    this.y += this.vy;
  }
  draw() {
    ctx.beginPath();
    //Math.PI / 180 = 1도
    ctx.arc(this.x, this.y, this.radius, 0, (Math.PI / 180) * 360);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }
}

const TOTAL = canvasWidth / 50;
const particles = [];

const randomNumBetween = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

for (let i = 0; i < TOTAL; i++) {
  const x = randomNumBetween(0, canvasWidth);
  const y = randomNumBetween(0, canvasHeight);
  const radius = randomNumBetween(50, 100);
  const vy = randomNumBetween(1, 5);
  const particle = new Particle(x, y, radius, vy);
  particles.push(particle);
}

let interval = 1000 / 60;
let now, delta;
let then = Date.now();

const animate = () => {
  window.requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  now = Date.now();
  delta = now - then;

  if (delta < interval) return;

  particles.forEach((particle) => {
    particle.update();

    particle.draw();

    if (particle.y - particle.radius > canvasHeight) {
      particle.y = -particle.radius;
      particle.x = randomNumBetween(0, canvasWidth);
      particle.radius = randomNumBetween(50, 100);
      particle.vy = randomNumBetween(1, 5);
    }
  });

  then = now - (delta % interval);
};

animate();
