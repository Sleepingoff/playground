// 집게 막대 생성 함수
import {
  Engine,
  Render,
  World,
  Bodies,
  Body,
  Mouse,
  Events,
  Composite,
  MouseConstraint,
  Constraint,
  engine,
  render,
} from "./index.js";

export function createBar(x, y, width, length, angle = 0, option = {}) {
  const bar = Bodies.rectangle(x, y, width, length, {
    ...option,
    inertia: Infinity,
  });
  Body.setAngle(bar, angle);
  return bar;
}

// 집게 제약 조건 생성 함수
export function createConstraint(bodyA, pointA, bodyB, pointB) {
  return Constraint.create({
    bodyA: bodyA,
    pointA: pointA,
    bodyB: bodyB,
    pointB: pointB,
    stiffness: 1,
    length: 0,
  });
}
let attachedButton = null;
// Function to apply magnetic force
export function applyMagneticForce(magnet) {
  const magnetPosition = magnet.position;
  const magnetStrength = 0.005; // Adjust the strength of the magnet
  const attachmentDistance = 50;
  // Iterate through all bodies in the world

  if (attachedButton) {
    // Keep the attached button fixed to the magnet
    Body.setPosition(attachedButton, magnetPosition);
    return;
  }

  engine.world.bodies.forEach((button) => {
    if (button.isButton) {
      // Apply force only to button bodies
      const dx = magnetPosition.x - button.position.x;
      const dy = magnetPosition.y - button.position.y;
      const distance = Math.sqrt(dx * dy + dy * dy);

      if (distance < attachmentDistance && !attachedButton) {
        // Attach button to magnet
        attachedButton = button;
        Body.setPosition(button, magnetPosition);
        Body.setStatic(button, true);
      } else if (distance < 300) {
        // Adjust the range of the magnet
        // Apply magnetic force
        const forceMagnitude =
          magnetStrength * Math.pow((300 - distance) / 300, 2); // Quadratic falloff
        const force = { x: dx * forceMagnitude, y: dy * forceMagnitude };

        Body.applyForce(button, button.position, force);
      } else {
        // If the button is outside the range, ensure it's not static
        Body.setStatic(button, false);
      }
    }
  });
}

export function createButton(x, y, text) {
  const button = document.createElement("button");
  button.innerText = text;
  button.style.left = `${x}px`;
  button.style.top = `${y}px`;

  // Create a Matter.js body for the button
  const buttonBody = Bodies.rectangle(x, y, 100, 50, { restitution: 0.5 });
  buttonBody.isButton = true; // Custom property to identify the button bodies
  World.add(engine.world, buttonBody);

  // Update button position based on the Matter.js body
  Events.on(engine, "afterUpdate", () => {
    button.style.left = `${buttonBody.position.x - 50}px`;
    button.style.top = `${buttonBody.position.y - 25}px`;
  });

  // Add click event listener to the button
  button.addEventListener("click", () => {
    alert(`You clicked: ${text}`);
    // Additional game logic can go here
  });
}
function calcDistance(a, b) {
  return Math.abs(a) + Math.abs(b);
}

export function createLine(pointA, pointB, w, fill = "#ffffff") {
  return Bodies.rectangle(
    calcDistance(pointA.x, pointB.x),
    calcDistance(pointA.y, pointB.y),
    w,
    Math.sqrt(
      (Math.abs(pointA.x) - Math.abs(pointB.x)) ** 2 +
        (Math.abs(pointA.y) - Math.abs(pointB.y)) ** 2
    ),
    {
      render: {
        fillStyle: fill,
      },
      inertia: Infinity,
      angle: Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) + Math.PI / 2,
    }
  );
}

export function createChain(
  target,
  targetConstraintPosition,
  chainPosition,
  chainConstraintPosition,
  width
) {
  const bar = createLine(targetConstraintPosition, chainPosition, width);
  const constraint = createConstraint(
    target,
    targetConstraintPosition,
    bar,
    chainConstraintPosition
  );

  return [bar, constraint];
}
