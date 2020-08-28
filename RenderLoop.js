class RenderLoop {
  constructor(callback, fps) {
    this.msLastFrame = null;
    this.callback = callback;
    this.isActive = false;
    this.fps = 0;
    this.msFpsLimit = null;

    this.run = this.run.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    if(fps && fps > 0) {
      this.msFpsLimit = 1000/fps;// How many ms per frame
    }
  }

  run() {
    const msCurrent = performance.now();
    const msDelta = msCurrent - this.msLastFrame;
    const deltaTime = msDelta / 1000.0;

    if(!this.msFpsLimit || msDelta >= this.msFpsLimit) {
      this.fps = Math.floor(1 / deltaTime);
      this.msLastFrame = msCurrent;
      this.callback(deltaTime);
    }

    if(this.isActive) {
      window.requestAnimationFrame(this.run);
    }
  }

  start() {
    this.isActive = true;
    this.msLastFrame = performance.now();
    window.requestAnimationFrame(this.run);
  }

  stop() {
    this.isActive = false;
  }
}