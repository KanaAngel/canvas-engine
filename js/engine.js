class Scene {
  loaded = false;
  gameObjects = new Array();

  constructor() {}

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

class GameObject {
  vector2 = new Vector2(0,0);
  children = new Array();

  update(ctx, step) {
    children.forEach((obj) => {
      obj.update(ctx, step);
    });
  }

  addChild(obj) {
    children.push(obj);
  }
}

class Vector2 {
  x = 0;
  y = 0;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    if (!(v instanceof Vector2)) return console.error("Cannot combine vector and non-vector.");

    return new Vector2(this.x + v.x, this.y + v.y);
  }

  distanceTo(v) {
    var w = Math.abs(this.x - v.x);
    var h = Math.abs(this.y - v.y);

    return Math.sqrt(w + h);
  }

  divideBy(a) {
    return new Vector2(this.x / a, this.y / a);
  }

  subtract(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  toString() {
    return `(${this.x},${this.y})`;
  }
}

class Input { }

class ArrowInput extends Input {
  up = 0;
  down = 0;
  right = 0;
  left = 0;

  constructor() {
    super();

    document.addEventListener("keydown", (e) => {
      if (e.keyCode == 38) this.up = 1;
      if (e.keyCode == 40) this.down = 1;
      if (e.keyCode == 37) this.left = 1;
      if (e.keyCode == 39) this.right = 1;
    });

    document.addEventListener("keyup", (e) => {
      if (e.keyCode == 38) this.up = 0;
      if (e.keyCode == 40) this.down = 0;
      if (e.keyCode == 37) this.left = 0;
      if (e.keyCode == 39) this.right = 0;
    });
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
    /*this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);*/

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

    // Prevent context menu from opening.
    this.canvas.oncontextmenu = () => { return false };

    this.sceneManager = new SceneManager();
  }

  init() {
    this.sceneManager.init();
  }
}
