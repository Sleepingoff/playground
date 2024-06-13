import {
  Bodies,
  Composite,
  World,
  canvasHeight,
  canvasWidth,
  engine,
} from "./index.js";

const groundHeight = 20;
const ground = Bodies.rectangle(
  canvasWidth / 2,
  canvasHeight - groundHeight / 2,
  canvasWidth,
  groundHeight,
  {
    isStatic: true,
  }
);
const rightWall = Bodies.rectangle(
  canvasWidth - groundHeight / 2,
  canvasHeight / 2,
  groundHeight,
  canvasHeight,
  {
    isStatic: true,
  }
);
const leftWall = Bodies.rectangle(
  groundHeight / 2,
  canvasHeight / 2,
  groundHeight,
  canvasHeight,
  {
    isStatic: true,
  }
);
console.log(ground);
Composite.add(engine.world, [ground, leftWall, rightWall]);
