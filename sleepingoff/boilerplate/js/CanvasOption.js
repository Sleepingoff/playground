class CanvasOption {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.dpr = window.devicePixelRatio;
    this.fps = 60;
    this.interval = 1000 / this.fps;
    this.canvasWidth = innerWidth;
    this.canvasHeight = innerHeight;
    this.bgColor = "#000000";
  }
}

export default CanvasOption;
