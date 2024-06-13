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

const DEG_TO_RAD = Math.PI / 180;
const BAR_INIT_LENGTH = 80;
const BAR_INIT_WIDTH = 5;
const BAR_INIT_ANGLE = 60;
const BAR_SECOND_ANGLE = -90; //음수값으로 고정

const composites = [];
let isMove = false;
let isMouseOn = false;
let isDown = true;
let isClick = true;

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
//todo: 각각의 움직임 분리하기
// 1. x 좌표 움직임
// 2. y 좌표 움직임
// 3. 각도 움직임
Events.on(runner, "tick", () => {
  const currentMousePosition = mouse.position.x;
  const currentMousePositionY = mouse.position.y;
  let ceilingBarLength = BAR_INIT_LENGTH + index;

  const initialAngleRad =
    BAR_INIT_ANGLE * DEG_TO_RAD - index / currentMousePositionY / 2;
  const secondAngleRad =
    BAR_SECOND_ANGLE * DEG_TO_RAD - index / currentMousePositionY; //initialAngle과 일직선보다 넘지 않게 조절

  composites.forEach((comp) => {
    Composite.remove(engine.world, comp);
  });
  composites.length = 0; // 배열 초기화

  if (ceilingBarLength >= currentMousePositionY * 2) isDown = false;
  if (ceilingBarLength < BAR_INIT_LENGTH) isDown = true;
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
    pointA: { x: 0, y: -BAR_INIT_LENGTH / 2 },
    pointB: { x: currentMousePosition, y: 0 },
    length: 0,
  });

  composites.push(bar, barConstraint);
  createChain(currentMousePosition, index, [-initialAngleRad, secondAngleRad]);
  createChain(currentMousePosition, index, [
    Math.PI + initialAngleRad,
    -secondAngleRad,
  ]);

  if (isMove) {
    if (ceilingBarLength < BAR_INIT_LENGTH && isDown) {
      index = 0;
      isMove = false;
    }
    index = isDown ? index + 2 : index - 2;
  }

  Composite.add(engine.world, composites);
});

function createChain(currentMousePosition, index, rads = []) {
  //두 좌표간 y 좌표의 차이 20 === pointB와 pointA사이의 거리
  const bar = createBar(
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
  const localPosition = calcBarLocalPosition(BAR_INIT_LENGTH / 2, rads[0]);

  Body.rotate(bar, rads[0]);

  const barConstraint = Constraint.create({
    pointA: localPosition,
    bodyA: bar,
    pointB: { x: currentMousePosition, y: BAR_INIT_LENGTH + index / 2 },
    length: 0,
  });
  const bar_bar0 = createBar(
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
  Body.rotate(bar_bar0, -30);
  const bar_bar0_localPosition = calcBarLocalPosition(
    25,
    Math.PI / 2 - rads[1]
  );
  const bar0Constraint = Constraint.create({
    bodyA: bar,
    pointA: { x: -localPosition.x, y: -localPosition.y },
    bodyB: bar_bar0,
    pointB: {
      x: bar_bar0_localPosition.x,
      y: bar_bar0_localPosition.y - index / 64,
    },
    length: 0,
  });

  composites.push(bar, barConstraint, bar_bar0, bar0Constraint);
}
