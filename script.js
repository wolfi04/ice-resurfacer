const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const speedDisplay = document.getElementById("speedDisplay");
const percentDisplay = document.getElementById("percentDisplay");
const timerDisplay = document.getElementById("timerDisplay");

let startTime = Date.now();
let gameFinished = false;

const rink = {
  x: 30,
  y: 30,
  w: canvas.width - 60,
  h: canvas.height - 60,
  radius: 95
};

let machine = {
  x: rink.x + 75,
  y: canvas.height / 2,
  angle: 0,
  speedLevel: 0,
  width: 70,
  height: 38
};

const speedValues = [0, 1.2, 2, 2.8, 3.6, 4.5];

const cleanCanvas = document.createElement("canvas");
cleanCanvas.width = canvas.width;
cleanCanvas.height = canvas.height;
const cleanCtx = cleanCanvas.getContext("2d");

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    machine.speedLevel = Math.min(5, machine.speedLevel + 1);
  }

  if (e.key === "ArrowDown") {
    machine.speedLevel = Math.max(0, machine.speedLevel - 1);
  }

  if (!e.repeat && e.key === "ArrowLeft") {
    machine.angle -= Math.PI / 12; // 15°
  }

  if (!e.repeat && e.key === "ArrowRight") {
    machine.angle += Math.PI / 12; // 15°
  }
});

function update() {
  const speed = speedValues[machine.speedLevel];

  const nextX = machine.x + Math.cos(machine.angle) * speed;
  const nextY = machine.y + Math.sin(machine.angle) * speed;

  if (isInsideRink(nextX, nextY)) {
    machine.x = nextX;
    machine.y = nextY;
  } else {
    machine.speedLevel = 0;
  }

  cleanIce();

  const percent = calculateCleanedPercent();

  speedDisplay.textContent = machine.speedLevel;
  percentDisplay.textContent = percent;

  if (percent >= 100 && !gameFinished) {
    gameFinished = true;

    setTimeout(() => {
      alert("🏆 Ice Fully Resurfaced!\n\nTime: " + timerDisplay.textContent);
    }, 100);
  }
}

function updateTimer() {
  if (gameFinished) return;

  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  timerDisplay.textContent =
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");
}

function createRinkPath(context) {
  context.beginPath();
  context.roundRect(rink.x, rink.y, rink.w, rink.h, rink.radius);
}

function drawIceRink() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  createRinkPath(ctx);
  ctx.fillStyle = "#dff7ff";
  ctx.fill();

  ctx.save();
  createRinkPath(ctx);
  ctx.clip();

  ctx.drawImage(cleanCanvas, 0, 0);
  drawRinkLines();

  ctx.restore();

  createRinkPath(ctx);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 10;
  ctx.stroke();

  createRinkPath(ctx);
  ctx.strokeStyle = "#6f8795";
  ctx.lineWidth = 4;
  ctx.stroke();
}

function drawRinkLines() {
  const top = rink.y;
  const bottom = rink.y + rink.h;
  const left = rink.x;
  const right = rink.x + rink.w;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.strokeStyle = "rgba(200, 0, 0, 0.75)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(centerX, top);
  ctx.lineTo(centerX, bottom);
  ctx.stroke();

  ctx.strokeStyle = "rgba(0, 80, 200, 0.75)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(left + rink.w * 0.28, top);
  ctx.lineTo(left + rink.w * 0.28, bottom);
  ctx.moveTo(left + rink.w * 0.72, top);
  ctx.lineTo(left + rink.w * 0.72, bottom);
  ctx.stroke();

  ctx.strokeStyle = "rgba(200, 0, 0, 0.75)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(left + 70, top);
  ctx.lineTo(left + 70, bottom);
  ctx.moveTo(right - 70, top);
  ctx.lineTo(right - 70, bottom);
  ctx.stroke();

  drawFaceoffCircle(centerX, centerY, 70);

  drawFaceoffCircle(left + 210, top + 150, 52);
  drawFaceoffCircle(left + 210, bottom - 150, 52);
  drawFaceoffCircle(right - 210, top + 150, 52);
  drawFaceoffCircle(right - 210, bottom - 150, 52);

  drawFaceoffDot(centerX, centerY);
  drawFaceoffDot(left + 210, top + 150);
  drawFaceoffDot(left + 210, bottom - 150);
  drawFaceoffDot(right - 210, top + 150);
  drawFaceoffDot(right - 210, bottom - 150);

  drawGoalCrease(left + 70, centerY, "left");
  drawGoalCrease(right - 70, centerY, "right");
}

function drawFaceoffCircle(x, y, radius) {
  ctx.strokeStyle = "rgba(200, 0, 0, 0.65)";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - 14, y);
  ctx.lineTo(x + 14, y);
  ctx.moveTo(x, y - 14);
  ctx.lineTo(x, y + 14);
  ctx.stroke();
}

function drawFaceoffDot(x, y) {
  ctx.fillStyle = "rgba(200, 0, 0, 0.85)";
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fill();
}

function drawGoalCrease(x, y, side) {
  ctx.strokeStyle = "rgba(0, 100, 220, 0.8)";
  ctx.fillStyle = "rgba(120, 210, 255, 0.35)";
  ctx.lineWidth = 4;

  ctx.beginPath();

  if (side === "left") {
    ctx.moveTo(x, y - 62);
    ctx.lineTo(x, y + 62);
    ctx.arc(x, y, 62, Math.PI / 2, -Math.PI / 2, true);
  } else {
    ctx.moveTo(x, y - 62);
    ctx.lineTo(x, y + 62);
    ctx.arc(x, y, 62, -Math.PI / 2, Math.PI / 2, true);
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawMachine() {
  ctx.save();

  ctx.translate(machine.x, machine.y);
  ctx.rotate(machine.angle);

  ctx.fillStyle = "#cc2222";
  ctx.fillRect(
    -machine.width / 2,
    -machine.height / 2,
    machine.width,
    machine.height
  );

  ctx.fillStyle = "#77cfff";
  ctx.fillRect(5, -14, 25, 28);

  ctx.fillStyle = "#333";
  ctx.fillRect(30, -18, 10, 36);

  ctx.fillStyle = "#111";
  ctx.fillRect(-28, -25, 20, 8);
  ctx.fillRect(-28, 17, 20, 8);

  ctx.restore();
}

function cleanIce() {
  cleanCtx.save();

  createRinkPath(cleanCtx);
  cleanCtx.clip();

  // Punkt direkt hinter der Maschine
  const backX = machine.x - Math.cos(machine.angle) * 38;
  const backY = machine.y - Math.sin(machine.angle) * 38;

  cleanCtx.fillStyle = "rgba(160, 230, 255, 0.85)";

  // runder Cleaner-Kreis statt gedrehter Fläche
  cleanCtx.beginPath();
  cleanCtx.arc(backX, backY, 24, 0, Math.PI * 2);
  cleanCtx.fill();

  cleanCtx.restore();
}

  cleanCtx.restore();
}

function isInsideRink(x, y) {
  const safety = 18;

  const testCanvas = document.createElement("canvas");
  testCanvas.width = canvas.width;
  testCanvas.height = canvas.height;
  const testCtx = testCanvas.getContext("2d");

  testCtx.beginPath();
  testCtx.roundRect(
    rink.x + safety,
    rink.y + safety,
    rink.w - safety * 2,
    rink.h - safety * 2,
    rink.radius - safety
  );

  return testCtx.isPointInPath(x, y);
}

function calculateCleanedPercent() {
  const imageData = cleanCtx.getImageData(0, 0, canvas.width, canvas.height);
  let cleaned = 0;
  let total = 0;

  const rinkMaskCanvas = document.createElement("canvas");
  rinkMaskCanvas.width = canvas.width;
  rinkMaskCanvas.height = canvas.height;
  const rinkMaskCtx = rinkMaskCanvas.getContext("2d");

  createRinkPath(rinkMaskCtx);
  rinkMaskCtx.fillStyle = "black";
  rinkMaskCtx.fill();

  const maskData = rinkMaskCtx.getImageData(0, 0, canvas.width, canvas.height);

  for (let i = 3; i < imageData.data.length; i += 4) {
    if (maskData.data[i] > 0) {
      total++;
      if (imageData.data[i] > 0) cleaned++;
    }
  }

  return Math.min(100, Math.round((cleaned / total) * 100));
}

function gameLoop() {
  update();
  updateTimer();

  drawIceRink();
  drawMachine();

  requestAnimationFrame(gameLoop);
}

gameLoop();
