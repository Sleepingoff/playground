import {
  Body,
  Composite,
  Constraint,
  Events,
  canvasHeight,
  engine,
  mouse,
  mouseConstraint,
  render,
  runner,
} from "./index.js";
import { createBar } from "./func.js";
import { calcBarLocalPosition } from "./util.js";
const composites = [];

const BAR_INIT_LENGTH = 50;
const BAR_INIT_WIDTH = 5;
const BAR_INIT_ANGLE = 60;
const BAR_SECOND_ANGLE = -90; //음수값으로 고정
let isMove = false;
let isMouseOn = false;
let isDown = true;
let isClick = true;
function createChain(currentMousePosition, index, rads = []) {
  const bar = createBar(
    currentMousePosition,
    BAR_INIT_LENGTH,
    BAR_INIT_WIDTH,
    BAR_INIT_LENGTH + index,
    0,
    {
      render: {
        fillStyle: "#fff",
      },
    }
  );

  const barConstraint = Constraint.create({
    bodyA: bar,
    pointB: { x: currentMousePosition, y: 0 },
    pointA: { x: 0, y: -BAR_INIT_LENGTH / 2 },
    length: 0,
  });
  //두 좌표간 y 좌표의 차이 20 === pointB와 pointA사이의 거리
  const bar_left = createBar(
    currentMousePosition,
    BAR_INIT_LENGTH + BAR_INIT_LENGTH / 2,
    BAR_INIT_WIDTH,
    BAR_INIT_LENGTH / 2,
    Math.PI / 2,
    {
      render: {
        fillStyle: "#fff",
      },
    }
  );
  const localPosition = calcBarLocalPosition(25, rads[0]);

  Body.rotate(bar_left, rads[0]);

  const leftConstraint = Constraint.create({
    pointA: localPosition,
    bodyA: bar_left,
    pointB: { x: currentMousePosition, y: 50 + index / 2 },
    length: 0,
  });
  const bar_left_bar0 = createBar(
    currentMousePosition,
    2 * BAR_INIT_LENGTH + BAR_INIT_LENGTH / 4,
    BAR_INIT_WIDTH,
    BAR_INIT_LENGTH / 4,
    Math.PI / 2 - rads[1],
    {
      render: {
        fillStyle: "#fff",
      },
    }
  );
  Body.rotate(bar_left_bar0, -30);
  const bar_left_bar0_localPosition = calcBarLocalPosition(
    25,
    Math.PI / 2 - rads[1]
  );
  const left_bar0Constraint = Constraint.create({
    bodyA: bar_left,
    pointA: { x: -localPosition.x, y: -localPosition.y },
    bodyB: bar_left_bar0,
    pointB: {
      x: bar_left_bar0_localPosition.x,
      y: bar_left_bar0_localPosition.y - index / 64,
    },
    length: 0,
  });

  composites.push(
    bar,
    barConstraint,
    bar_left,
    leftConstraint,
    bar_left_bar0,
    left_bar0Constraint
  );
}
Events.on(mouseConstraint, "mousedown", () => {
  isClick = !isMove;
  if (isClick) isMove = true;
});

render.canvas.addEventListener("mouseover", (event) => {
  isMouseOn = true;
});
render.canvas.addEventListener("mouseleave", () => {
  isMouseOn = false;
});
let index = 0;
const DEG_TO_RAD = Math.PI / 180;
Events.on(runner, "tick", () => {
  const currentMousePosition = mouse.position.x;
  const currentMousePositionY = mouse.position.y;
  let ceilingBarLength = BAR_INIT_LENGTH + index;

  const initialAngleRad = BAR_INIT_ANGLE * DEG_TO_RAD * 2;
  const secondAngleRad =
    BAR_SECOND_ANGLE * DEG_TO_RAD * 2 -
    initialAngleRad +
    index / (currentMousePositionY / 2); //initialAngle과 일직선보다 넘지 않게 조절

  composites.forEach((comp) => {
    Composite.remove(engine.world, comp);
  });
  composites.length = 0; // 배열 초기화

  if (ceilingBarLength >= currentMousePositionY * 2) isDown = false;
  if (ceilingBarLength < BAR_INIT_LENGTH) isDown = true;

  createChain(currentMousePosition, index, [-initialAngleRad, secondAngleRad]);
  createChain(currentMousePosition, index, [
    Math.PI + initialAngleRad,
    -secondAngleRad,
  ]);

  if (isMove) {
    if (ceilingBarLength < BAR_INIT_LENGTH && isDown) {
      index = BAR_INIT_LENGTH;
      isMove = false;
    }
    index = isDown ? index + 2 : index - 2;
  }

  Composite.add(engine.world, composites);
});
