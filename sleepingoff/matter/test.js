import { Composite, Constraint, engine, mouse } from "./index.js";
import { createBar } from "./func.js";

const bar = createBar(20, 30, 5, 50);
const barConstraint = Constraint.create({
  bodyA: bar,
  pointB: { x: 20, y: 5 }, //bar의 x 좌표, bar의 상단 y 좌표 = 30 - 50 / 2
  pointA: { x: 0, y: -25 }, //bar의 중심 x, y에서 y만큼 25 올라간 위치
});
//두 좌표간 y 좌표의 차이 20 === pointB와 pointA사이의 거리
const bar_bar1 = createBar(20, 30 + 25 + 25 / 2, 5, 25);
const bar1Constraint = Constraint.create({
  bodyA: bar,
  //bar에서 매달고 싶은 위치
  pointA: { x: 0, y: 25 },
  bodyB: bar_bar1,
  //bar1에서 매달리고 싶은 위치
  pointB: { x: 0, y: -25 / 2 },
});

const bar_bar1_bar2 = createBar(20, 30 + 25 + 25 + 25 / 2 / 2, 5, 25 / 2);
const bar2Constraint = Constraint.create({
  bodyA: bar_bar1,
  pointA: { x: 0, y: 25 / 2 },
  bodyB: bar_bar1_bar2,
  pointB: { x: 0, y: -25 / 2 / 2 },
});
Composite.add(engine.world, [
  bar,
  barConstraint,
  bar_bar1,
  bar1Constraint,
  bar_bar1_bar2,
  bar2Constraint,
]);
