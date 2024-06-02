const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");
//dpr: device pixel ratio
//사용되는 장치의 픽셀 수.
const myDPR = window.devicePixelRatio;

let canvasWidth = innerWidth;
let canvasHeight = innerHeight;
function init() {
  //canvas 크기
  //1. canvas 태그에 css 주기
  //2. canvas 태그에 width, height 주기

  canvasWidth = innerWidth;
  canvasHeight = innerHeight;

  // canvas.style.width = 400 + "px";
  // canvas.style.height = 400 + "px";
  //결과: 400, 400의 크기에 300/400 배 확대됨
  //즉, 캔버스의 실제 크기는 300 * 300 이나, css에 의해 크기를 확대 혹은 축소된다.

  // canvas.style.width = canvasWidth + "px";
  // canvas.style.height = canvasHeight + "px";
  // canvas.width = canvasWidth;
  // canvas.height = canvasHeight;

  canvas.style.backgroundColor = "#ccc";

  //개인 dpr에 맞춰 픽셀 수 조절해주기 => 더 선명해지는 효과
  console.log(window.devicePixelRatio); //1

  canvas.width = canvasWidth * myDPR;
  canvas.height = canvasHeight * myDPR;
  ctx.scale(myDPR, myDPR);
}

init();

window.addEventListener("resize", () => {
  init();
});

//dpr=1
//10, 10 좌표에 50, 50 크기의 사각형 그리기
ctx.fillRect(10, 10, 50, 50);

//dpr=2
const Xdpr2 = 80;
const Ydpr2 = 10;
const rectWidth = 25;
const rectHeight = 25;
const rect1Ofdpr2 = { x: Xdpr2, y: Ydpr2 };
const rect2Ofdpr2 = { x: Xdpr2 + rectWidth, y: Ydpr2 };
const rect3Ofdpr2 = { x: Xdpr2, y: Ydpr2 + rectHeight };
const rect4Ofdpr2 = { x: Xdpr2 + rectWidth, y: Ydpr2 + rectHeight };

ctx.strokeRect(rect1Ofdpr2.x, rect1Ofdpr2.y, rectWidth, rectHeight);
ctx.strokeRect(rect2Ofdpr2.x, rect2Ofdpr2.y, rectWidth, rectHeight);
ctx.strokeRect(rect3Ofdpr2.x, rect3Ofdpr2.y, rectWidth, rectHeight);
ctx.strokeRect(rect4Ofdpr2.x, rect4Ofdpr2.y, rectWidth, rectHeight);

export { canvasWidth, canvasHeight };
export default ctx;
