// module aliases
export const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Mouse = Matter.Mouse,
  Events = Matter.Events,
  Composite = Matter.Composite,
  Runner = Matter.Runner,
  Constraint = Matter.Constraint,
  MouseConstraint = Matter.MouseConstraint;

import {
  createBar,
  createConstraint,
  applyMagneticForce,
  createButton,
} from "./func.js";
import { randomNumBetween } from "./util.js";

export const canvas = document.querySelector("canvas");

// create an engine
export const engine = Engine.create();

export const canvasHeight = 500,
  canvasWidth = 500;

// create a renderer
export const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: canvasWidth,
    height: canvasHeight,
    wireframes: false,
  },
});

export const runner = Runner.create();
Render.run(render);
Runner.run(runner, engine);

// Add mouse control
export const mouse = Mouse.create(render.canvas);
export const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0,
    render: {
      visible: false,
    },
  },
});
World.add(engine.world, mouseConstraint);

for (let i = 0; i < 5; i++) {
  const x = randomNumBetween(20, canvasWidth - 20);
  const y = randomNumBetween(canvasHeight / 2, canvasHeight - 20);
  createButton(x, y, `Button ${i + 1}`);
}
