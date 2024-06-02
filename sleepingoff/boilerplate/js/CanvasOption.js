class CanvasOption {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.ctx = canvas.getContext("2d");
    this.dpr = window.devicePixelRatio;
    this.fps = 60;
    this.interval = 1000 / this.fps;
    this.cavansWidth = innerWidth;
    this.cavnasHeight = innerHeight;
  }
}

export default CanvasOption;
