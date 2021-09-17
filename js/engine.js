class Scene {
  loaded = false;

  constructor() {

  }

  update(ctx) {
    if (!this.loaded) return;

    // Run upon request for an animation frame, or once per frame.

    // This method should be overridden in a scene class which extends this.
  }

  load() {
    this.loaded = true;
    return this;
  }

  unload() {
    this.loaded = false;
    return this;
  }
}

class SceneManager {
  loadedScenes = [];
  canvas = null;
  ctx = null;

  constructor() {

  }

  init() {
    this.ctx = window.engine.ctx;
    this.canvas = this.ctx.canvas;
    window.requestAnimationFrame(this.update);

    console.log("Scene Manager initialized.");
  }

  update = (step) => {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.loadedScenes.forEach((scene) => {
      scene.update(this.ctx, step);
    });
    window.requestAnimationFrame(this.update);
  };

  loadSingle(scene) {
    this.loadedScenes.forEach((scene) => {
      scene.unload();
    });

    var s = this.load(scene);

    this.loadedScenes = [s];
  }

  loadAdd(scene) {
    var s = this.load(scene);

    this.loadedScenes.add(s);
  }

  load(scene) {
    if (!(scene instanceof Scene)) {
      return console.error("Tried to load something that isn't a scene.");
    }

    return scene.load();
  }
}

class Engine {
  canvas = null; // Canvas element that is bound to the engine.
  ctx = null; // Canvas context for short-hand access.

  constructor(canvas) {
    console.log("Starting engine...");

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.sceneManager = new SceneManager();
  }

  init() {
    this.sceneManager.init();
  }
}
