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

class UIManager {
  uiLayers = [];
  canvas = null;
  ctx = null;

  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  init() {
    console.log("Scene Manager initialized.");
  }

  update(ctx, step) {
    this.uiLayers.forEach((layer) => {
      if (layer.open) layer.update(ctx, step);
    });
  }

  addLayer(layer) {
    if (!(layer instanceof UILayer)) {
      return console.error("Added layer was not a UILayer.");
    }
    this.uiLayers.add(layer);
  }
}

class UILayer {
  open = true;

  update(ctx, step) {
    if (!open) return;
  }
}

class SceneManager {
  loadedScenes = [];
  canvas = null;
  ctx = null;

  constructor(ctx, canvas) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  init() {
    window.requestAnimationFrame(this.update);

    console.log("Scene Manager initialized.");
  }

  update(ctx, step) {
    this.loadedScenes.forEach((scene) => {
      scene.update(ctx, step);
    });
  };

  loadSingle(scene) {
    this.loadedScenes.forEach((scene) => {
      scene.unload();
    });

    this.loadAdd(scene);
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

    // Construct Scene and UI managers.
    this.sceneManager = new SceneManager(this.canvas, this.ctx);
    this.uiManager = new UIManager(this.canvas, this.ctx);
  }

  init() {
    this.sceneManager.init();

    window.requestAnimationFrame(this.update);
  }

  update = (step) => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.sceneManager.update(ctx, step);
    this.uiManager.update(ctx, step);

    window.requestAnimationFrame(this.update);
  };
}
