import CanvasOption from "./js/CanvasOption";

class Canvas extends CanvasOption {
  constructor() {
    super();
  }

  init() {
    this.canvasWidth = innerWidth;
    this.canvasHeight = innerHeight;
    this.canvas.width = this.canvasWidth * this.dpr;
    this.canvas.height = this.canvasHeight * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.canvas.style.width = this.canvasWidth + "px";
    this.canvas.style.height = this.canvasHeight + "px";
  }

  render() {
    let now, delta;
    let then = Date.now();
    const frame = () => {
      requestAnimationFrame(render);
      now = Date.now();
      delta = now - them;
      if (delta < this.interval) return;

      then = now - (delta % this.interval);
    };

    requestAnimationFrame(frame);
  }
}
const cavnas = new Canvas();
window.addEventListener("load", () => {
  cavnas.init();
  cavnas.render();
});

window.addEventListener("resize", () => {
  init();
});
