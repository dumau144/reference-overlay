const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Cannot allocate canvas");
}

type Point = {
  x: number;
  y: number;
};

type Mouse = Point & {
  button: boolean[];
};

type ScreenGlobal = {
  x: number;
  y: number;
  w: number;
  h: number;
  scale: number;
};

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

resizeCanvas();

addEventListener("resize", resizeCanvas);

const screenToWorld = (
  mouseScreenSpace: Point,
  screenGlobal: ScreenGlobal
): Point => ({
  x: (mouseScreenSpace.x - screenGlobal.x) / screenGlobal.scale,
  y: (mouseScreenSpace.y - screenGlobal.y) / screenGlobal.scale,
});

const zoom = (
  screenGlobal: ScreenGlobal,
  mouseWorldSpace: Point,
  value: number
) => {
  screenGlobal.scale -= value;

  screenGlobal.x += mouseWorldSpace.x * value;
  screenGlobal.y += mouseWorldSpace.y * value;
};

const canvasScreen: ScreenGlobal = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  w: 640,
  h: 480,
  scale: 1,
};

let mouseSpace: Point;

const mouse: Mouse = {
  x: 0,
  y: 0,
  button: [],
};

onmousemove = (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
  if (mouse.button[0]) {
    canvas.style.cursor = "grabbing";
    canvasScreen.x += event.movementX;
    canvasScreen.y += event.movementY;
  } else {
    canvas.style.cursor = "grab";
  }
};

onmousedown = (event) => {
  mouse.button[event.button] = true;
};

onmouseup = (event) => {
  mouse.button[event.button] = false;
};

const keyboardState: Record<string, boolean> = {};

onkeydown = (e) => {
  keyboardState[e.code] = true;
};

onkeyup = (e) => {
  keyboardState[e.code] = false;
};

const input = () => {
  if (keyboardState.NumpadAdd) {
    zoom(canvasScreen, mouseSpace, -1 * (canvasScreen.scale / 300));
  }

  if (keyboardState.NumpadSubtract) {
    if (canvasScreen.scale > 2) {
      zoom(canvasScreen, mouseSpace, 1 * (canvasScreen.scale / 300));
    }
  }
};

const div = 5;

const isWheelEvent = (event: Event): event is WheelEvent => "deltaY" in event;

addEventListener("mousewheel", (event: Event) => {
  if (isWheelEvent(event)) {
    if (event.deltaY > 1) {
      if (canvasScreen.scale > 1) {
        zoom(
          canvasScreen,
          mouseSpace,
          (event.deltaY / 100) * (canvasScreen.scale / (div + 1))
        );
      }
    } else {
      zoom(
        canvasScreen,
        mouseSpace,
        (event.deltaY / 100) * (canvasScreen.scale / div)
      );
    }
  }
});

ctx.imageSmoothingEnabled = false;

const squareNoise = (
  loop: number,
  radius: number,
  squareSize: number,
  color = ["#000"]
) => {
  const list = [];

  for (let i = 0; i != loop; i++) {
    list.push({
      x: (-1.0 + Math.random() * 2) * radius,
      y: (-1.0 + Math.random() * 2) * radius,
      w: Math.random() * squareSize,
      h: Math.random() * squareSize,
      c: color[i % color.length] as string,
    });
  }

  return list;
};

const draw = squareNoise(500, 200, 40, ["#f008", "#ff08", "#0f08"]);

const loop = () => {
  input();

  //canvasScreen.scale = Math.max(canvasScreen.scale);

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.setTransform(
    canvasScreen.scale,
    0,
    0,
    canvasScreen.scale,
    canvasScreen.x,
    canvasScreen.y
  );

  draw.forEach((item) => {
    ctx.fillStyle = item.c;
    ctx.fillRect(item.x, item.y, item.w, item.h);
  });

  mouseSpace = screenToWorld(mouse, canvasScreen);

  ctx.fillStyle = "#000";
  ctx.font = "0.01px serif";
  ctx.fillText(`${mouse.button[0]}`, 0, 0);

  ctx.resetTransform();

  requestAnimationFrame(loop);
};

loop();
