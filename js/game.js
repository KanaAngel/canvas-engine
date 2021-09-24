class MainMenu extends Scene {
  update(ctx, step) {
    if (step / 10 >= 255) return;

    ctx.fillStyle = `rgb(${ (step / 10) % 255 },0,0)`;
    ctx.fillRect(10, 10, 100, 100);

    ctx.fillStyle = `rgb(0,0,${ (step / 10) % 255 })`;
    ctx.fillRect(120, 10, 100, 100);
  }
}

class TestScene extends Scene {
  moving;

  draw = false;

  compareToStep;

  inputDebug;

  constructor() {
    super();

    var input = new ArrowInput();

    this.moving = new Array();
    this.moving.push(new MovingObject(input));

    this.inputDebug = new ArrowInputDebug(input);
  }

  update(ctx, step) {
    ctx.fillStyle = `white`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (var i = 0; i < this.moving.length; i++) {
      this.moving[i].update(ctx, step);
    }

    this.inputDebug.update(ctx, step);
  }
}

class ArrowInputDebug {
  viewportPosition = new Vector2(0, 0);
  input;

  constructor(input) {
    if (!(input instanceof ArrowInput)) {
      return console.error("Cannot debug non-ArrowInput class.");
    }

    this.input = input;
  }

  update(ctx, step) {
    this.viewportPosition.x = 10;
    this.viewportPosition.y = ctx.canvas.height - 60;

    // Up key
    ctx.fillStyle = `rgb(${this.input.up * 255},0,0)`;
    ctx.fillRect(this.viewportPosition.x + 70, this.viewportPosition.y - 60, 60, 50);

    // Left key
    ctx.fillStyle = `rgb(${this.input.left * 255},0,0)`;
    ctx.fillRect(this.viewportPosition.x, this.viewportPosition.y, 60, 50);

    // Down key
    ctx.fillStyle = `rgb(${this.input.down * 255},0,0)`;
    ctx.fillRect(this.viewportPosition.x + 70, this.viewportPosition.y, 60, 50);

    // Right key
    ctx.fillStyle = `rgb(${this.input.right * 255},0,0)`;
    ctx.fillRect(this.viewportPosition.x + 140, this.viewportPosition.y, 60, 50);
  }
}

class MovingObject {
  position = new Vector2(50, 50);
  size = 10;

  constructor(input) {
    this.input = input;
  }

  update(ctx, step) {
    this.updatePosition();

    ctx.fillStyle = `red`;
    ctx.fillRect(this.position.x - (this.size / 2), this.position.y - (this.size / 2), this.size, this.size);
  }

  updatePosition() {
    var v = this.getInputVector();
    this.position = this.position.add(v);
  }

  getInputVector() {
    var x = 0;
    var y = 0;

    y -= this.input.up;
    y += this.input.down;
    x -= this.input.left;
    x += this.input.right;

    return new Vector2(x, y);
  }
}

// Bind the game engine to a canvas element.
function bind(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    return console.error("Could not bind to canvas: given object was not a canvas.");
  }

  window.engine = new Engine(canvas);
  engine.init();
  console.log("Engine bound to", canvas);

  init();
}

function init() {
  engine.sceneManager.loadSingle(new TestScene());
}

function fixAspectRatio() {
  if (!engine) {
    return console.error("Couldn't fix aspect ratio on non-existent game.");
  }

  var w = window.innerWidth;
  var h = 9.0 * window.innerWidth / 16.0;

  if (h > window.innerHeight) {
    w = 16.0 * window.innerHeight / 9.0;
    h = window.innerHeight;
  }

  engine.canvas.width = w + 1;
  engine.canvas.height = h;
}

window.onload = () => {
  bind(document.getElementById('canvas'));
  fixAspectRatio();
};

window.onresize = fixAspectRatio;
