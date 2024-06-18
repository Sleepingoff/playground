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
import { calcBarLocalPosition, isNearTarget, moveTo } from "./util.js";

const DEG_TO_RAD = Math.PI / 180;
const BAR_INIT_LENGTH = 80;
const BAR_INIT_WIDTH = 5;
const BAR_INIT_ANGLE = 60;
const BAR_SECOND_ANGLE = -90; //음수값으로 고정

const composites = [];
let isMouseOn = false;
let clawState = "stop"; // "up", "down", pending
let isClick = false;

//todo: 각각의 움직임 분리하기
// 1. x 좌표 움직임
let currentX = 100;
let xTargetPosiiton = currentX + 200;
//click -> currentMousePositionX와 비교 -> xMovement 이동

function moveToX(currentX, target) {
  return moveTo(currentX, target);
}
// 2. y 좌표 움직임
//충돌 지점
let currentY = 0;
let yTargetPosition = canvasHeight;
//기본적으로 current가 항상 낮은 값으로 취급.

function moveToY(currentY, target) {
  return moveTo(currentY, target);
}
// 3. 각도 움직임
const MAX_INIT_RAD = BAR_INIT_ANGLE * DEG_TO_RAD;
const MIN_INIT_RAD = -(BAR_INIT_ANGLE - 90) * DEG_TO_RAD;

const MAX_SECOND_RAD = BAR_SECOND_ANGLE * DEG_TO_RAD;
const MIN_SECOND_RAD = -180 * DEG_TO_RAD - MAX_INIT_RAD;
//현재 y좌표 혹은 충돌 여부에 따라 동작
//이 함수가 실행되면 다른 움직임은 취소
let isRotate = clawState === "pending";
//기본은 모두 min으로 설정
//min -> max -> min 순으로 움직임
//증감값은 추후 조정
let isMax = false;
let isEndRotate = false;
function rotateMinToMax([currentInitRad, currentSecondRad]) {
  //min -> max
  if (currentInitRad >= MIN_INIT_RAD)
    currentInitRad = currentInitRad - (1 / 2) * DEG_TO_RAD;
  if (currentSecondRad >= MIN_SECOND_RAD)
    currentSecondRad = currentSecondRad - 2 * DEG_TO_RAD;

  isMax = isNearTarget(currentInitRad, MIN_INIT_RAD);
  return [currentInitRad, currentSecondRad];
}

function rotateMaxToMin([currentInitRad, currentSecondRad]) {
  currentInitRad = add2NumsWhenInRange(
    currentInitRad,
    (1 / 2) * DEG_TO_RAD,
    MIN_INIT_RAD,
    MAX_INIT_RAD
  );
  currentSecondRad = add2NumsWhenInRange(
    currentSecondRad,
    2 * DEG_TO_RAD,
    MIN_SECOND_RAD,
    MAX_SECOND_RAD
  );
  isEndRotate = isNearTarget(currentInitRad, MAX_INIT_RAD);
  return [currentInitRad, currentSecondRad];
}

//AS-IS: rotate함수에서 내부의 if로직이 반복된다.
//TO-BE: moveTo처럼 rotate 내부의 계산 로직만 분리하자.
function add2NumsWhenInRange(num1, num2, minRange, maxRange) {
  let result = 0;
  if (minRange <= num1 && num1 >= maxRange) result = num1 + num2;
  return result;
}

Events.on(mouseConstraint, "mousedown", () => {
  isClick = true;
  xTargetPosiiton = mouse.position.x;
  yTargetPosition = mouse.position.y;
});

render.canvas.addEventListener("mouseover", (event) => {
  isMouseOn = true;
});
render.canvas.addEventListener("mouseleave", () => {
  isMouseOn = false;
});
let initialAngleRad = MAX_INIT_RAD;
let secondAngleRad = MAX_SECOND_RAD;
Events.on(runner, "tick", () => {
  composites.forEach((comp) => {
    Composite.remove(engine.world, comp);
  });
  composites.length = 0; // 배열 초기화
  let currentMousePosition = moveToX(currentX, xTargetPosiiton);
  //if, else if 등으로 하는 것보다 가독성이 좋음
  //if문으로만 했을 때 잘못하면 서로의 동작에 관여하게 됨
  switch (true) {
    case isRotate:
      //회전 중이라면 기다려
      clawState = "pending";
      break;
    case xTargetPosiiton === currentMousePosition && isClick:
      //지정한 x좌표에 도착했으면 움직여
      clawState = "move";
      break;
    case xTargetPosiiton != currentMousePosition && isClick:
      //x좌표가 지정되면 준비해
      clawState = "ready";
      break;
    case !isClick:
      //일이 끝나면 제자리로 가
      clawState = "stop";
  }

  switch (clawState) {
    case "move":
      currentY = moveToY(currentY, yTargetPosition);
      isRotate = yTargetPosition === currentY && yTargetPosition != 0;
      isClick = currentY != 0;
      break;
    case "ready":
      break;
    case "stop":
      xTargetPosiiton = 300;
      break;
    case "pending":
      currentY = moveToY(currentY);
      [initialAngleRad, secondAngleRad] = isMax
        ? rotateMaxToMin([initialAngleRad, secondAngleRad])
        : rotateMinToMax([initialAngleRad, secondAngleRad]);
      if (isEndRotate) {
        isRotate = false;
        yTargetPosition = 0;
        isEndRotate = false;
      }
  }
  console.log(clawState);
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
