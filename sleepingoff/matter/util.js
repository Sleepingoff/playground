export function randomNumBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function calcNextPoint(point, length, theta) {
  return {
    x: parseInt(length * Math.cos(theta) + point.x),
    y: parseInt(length * Math.sin(theta) + point.y),
  };
}

export function calcBarLocalPosition(len, theta) {
  return {
    x: parseInt((len * Math.cos(theta)) / 2),
    y: parseInt((len * Math.sin(theta)) / 2),
  };
}
export function hangChains(CHAIN_LENGTH, length, rads) {
  let currentLength = length;
  const chains = [];
  for (let i = 0; i < CHAIN_LENGTH; i++) {
    const currentRad = rads[i];
    const position = calcBarLocalPosition(currentLength, currentRad);
    if (i % 2 != 0) {
      chains.push({ x: position.y, y: position.x });
    } else {
      chains.push(position);
    }
    currentLength /= 2;
  }

  return chains;
}

export function initMousePosition(mouseX, initPosition) {
  return initPosition === mouseX
    ? 0
    : (initPosition - mouseX) / Math.abs(initPosition - mouseX);
}
