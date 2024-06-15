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
const VELOCITY_LENGTH = 30;
const composites = [];
let isMove = false;
let isMouseOn = false;
let isDown = false;
let downState = "stop"; // "up", "down"
let isClick = false;

let index = 0;

//todo: 각각의 움직임 분리하기
// 1. x 좌표 움직임
let currentX = 100;
let xTargetPosiiton = currentX + 200;
//click -> currentMousePositionX와 비교 -> xMovement 이동

function moveTo(current, target) {
  const threshold = 2; // 목표 근처로 간주할 거리
  const movement = target - current;
  //근접하지만 target까지 갈 수 없음
  if (Math.abs(movement) < threshold) {
    return target;
  }

  const velocity = movement / VELOCITY_LENGTH;
  return current + velocity;
}
function moveToX(target) {
  return (currentX = moveTo(currentX, target));
}
// 2. y 좌표 움직임
//충돌 지점
let currentY = 0;
let yTargetPosition = canvasHeight;
//기본적으로 current가 항상 낮은 값으로 취급.
//즉, moveToY의 기본 동작은 down

function moveToY(target) {
  return (currentY = moveTo(currentY, target));
}
// 3. 각도 움직임
const MAX_INIT_RAD = 90 * DEG_TO_RAD;
const MIN_INIT_RAD = 0 * DEG_TO_RAD;

const MAX_SECOND_RAD = -90 * DEG_TO_RAD;
const MIN_SECOND_RAD = -180 * DEG_TO_RAD;
//현재 y좌표 혹은 충돌 여부에 따라 동작
//이 함수가 실행되면 다른 움직임은 취소
let isRotateMinToMax = false;
function rotateTo([currentInitRad, currentSecondRad]) {
  //기본은 모두 min으로 설정
  //min -> max -> min 순으로 움직임
  if (isRotateMinToMax) {
    //증감값은 추후 조정
    currentInitRad < MAX_INIT_RAD && currentInitRad++;
    currentSecondRad < MAX_SECOND_RAD && currentSecondRad--;
  } else {
    currentInitRad < MAX_INIT_RAD && currentInitRad--;
    currentSecondRad < MAX_SECOND_RAD && currentSecondRad++;
  }

  return [currentInitRad, currentSecondRad];
}

Events.on(mouseConstraint, "mousedown", () => {
  isClick = !isClick;
  xTargetPosiiton = mouse.position.x;
  yTargetPosition = mouse.position.y;
});

render.canvas.addEventListener("mouseover", (event) => {
  isMouseOn = true;
});
render.canvas.addEventListener("mouseleave", () => {
  isMouseOn = false;
});

Events.on(runner, "tick", () => {
  const initialAngleRad = BAR_INIT_ANGLE * DEG_TO_RAD;
  const secondAngleRad = BAR_SECOND_ANGLE * DEG_TO_RAD;

  composites.forEach((comp) => {
    Composite.remove(engine.world, comp);
  });
  composites.length = 0; // 배열 초기화
  const currentMousePosition = moveToX(xTargetPosiiton);
  //if, else if 등으로 하는 것보다 가독성이 좋음
  //if문으로만 했을 때 잘못하면 서로의 동작에 관여하게 됨
  switch (true) {
    case yTargetPosition === currentY && !isRotateMinToMax:
      downState = "up";
      isClick = false;
      break;
    case xTargetPosiiton === currentMousePosition && isClick:
      downState = "down";
      break;
    case isRotateMinToMax && !isClick:
      downState = "stop";
      break;
  }

  switch (downState) {
    case "up":
      currentY = moveToY(0);
      break;
    case "down":
      currentY = moveToY(yTargetPosition);
      break;
    default:
      currentY = moveToY(currentY);
  }
  const bar = createBar(
    currentMousePosition,
    BAR_INIT_LENGTH,
    BAR_INIT_WIDTH,
    BAR_INIT_LENGTH + currentY,
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
  createChain(currentMousePosition, currentY, [
    -initialAngleRad,
    secondAngleRad,
  ]);
  createChain(currentMousePosition, currentY, [
    Math.PI + initialAngleRad,
    -secondAngleRad,
  ]);

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
