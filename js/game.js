class MainMenu extends Scene {
  update(ctx, step) {
    ctx.fillStyle = `rgb(${ (step / 10) % 255 },0,0)`;
    ctx.fillRect(10, 10, 100, 100);

    ctx.fillStyle = `rgb(0,0,${ (step / 10) % 255 })`;
    ctx.fillRect(120, 10, 100, 100);
  }
}

// Bind the game engine to a canvas element.
function bind(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    return console.error("Could not bind to canvas: given object was not a canvas.");
  }

  window.engine = new Engine(canvas);
  window.engine.init();
  console.log("Engine bound to", canvas);

  init();
}

function init() {
  window.engine.sceneManager.loadSingle(new MainMenu());
}

function fixAspectRatio() {
  if (!window.engine) {
    return console.error("Couldn't fix aspect ratio on non-existent game.");
  }

  window.engine.canvas.width = window.innerWidth;
  window.engine.canvas.height = 9*window.innerWidth/16;
}

window.onload = () => {
  bind(document.getElementById('canvas'));
  fixAspectRatio();
};

window.onresize = fixAspectRatio;
