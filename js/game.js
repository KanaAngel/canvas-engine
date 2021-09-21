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

  pointOne;
  pointTwo;

  draw = false;

  compareToStep;

  constructor() {
    super();

    alert("Using your left and right mouse buttons, set two points to draw a line between them.\n\nTry getting the line to cross the red square!");

    this.moving = new Array();
    this.moving.push(new MovingObject());

    this.pointOne = new Point("green");
    this.pointTwo = new Point("blue");

    engine.canvas.addEventListener("mousedown", (e) => {
      e.preventDefault();

      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var position = new Vector2(x, y);

      if (e.button == 0) this.pointOne.position = position;
      if (e.button == 2) this.pointTwo.position = position;

      if (this.pointOne.position.x >= 0 && this.pointTwo.position.y >= 0) this.draw = true;
    });
  }

  update(ctx, step) {
    ctx.fillStyle = `white`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.pointOne.update(ctx, step);
    this.pointTwo.update(ctx, step);

    if (!this.draw) this.compareToStep = step;

    if (this.pointOne.position.x != -1 && this.pointTwo.position.x != -1) {
      ctx.fillStyle = this.draw ? "black" : "green";
      ctx.beginPath();
      ctx.moveTo(this.pointOne.position.x, this.pointOne.position.y);

      if (!this.draw) {
        ctx.lineTo(this.pointTwo.position.x, this.pointTwo.position.y);
      } else {
        var distance = this.pointOne.position.distanceTo(this.pointTwo.position);
        var deltaStep = this.pointTwo.position.subtract(this.pointOne.position).divideBy(distance * 60);

        var x = this.pointOne.position.x + ((step - this.compareToStep) % (distance * 60) * deltaStep.x);
        var y = this.pointOne.position.y + ((step - this.compareToStep) % (distance * 60) * deltaStep.y);

        ctx.lineTo(x, y);

        if (
          x > this.moving[0].position.x - (this.moving[0].size / 2) &&
          x < this.moving[0].position.x + (this.moving[0].size / 2) &&
          y > this.moving[0].position.y - (this.moving[0].size / 2) &&
          y < this.moving[0].position.y + (this.moving[0].size / 2)
        ) {
          alert("The line crossed the square!");
        }

        if (step - this.compareToStep > distance * 59) {
          this.draw = false;
        }
      }

      ctx.stroke();
    }

    for (var i = 0; i < this.moving.length; i++) {
      this.moving[i].update(ctx, step);
    }
  }
}

class Point {
  position = new Vector2(-1, -1);
  color;

  constructor(color) {
    this.color = color;
  }

  update(ctx, step) {
    if (this.position.x == -1 && this.position.y == -1) return;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.font = "16px sans-serif";
    ctx.fillText(this.position.toString(), this.position.x + 10, this.position.y + 10);
  }
}

class ArrowInput {
  up = 0;
  down = 0;
  right = 0;
  left = 0;

  constructor() {
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

class MovingObject {
  position = new Vector2(50, 50);
  input = new ArrowInput();
  size = 10;

  update(ctx, step) {
    this.updatePosition();

    ctx.fillStyle = `red`;
    ctx.fillRect(this.position.x - (this.size / 2), this.position.y - (this.size / 2), this.size, this.size);
  }

  updatePosition() {
    var v = this.getInputVector();
    //this.position = this.position.add(v);
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
