const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Sliders
const circlesSlider = document.getElementById("circlesSlider");
const widthSlider = document.getElementById("widthSlider");
const heightSlider = document.getElementById("heightSlider");

// Valores UI
const circlesValue = document.getElementById("circlesValue");
const widthValue = document.getElementById("widthValue");
const heightValue = document.getElementById("heightValue");
const canvasInfo = document.getElementById("canvasInfo");

// Botón
const randomBtn = document.getElementById("randomBtn");

// Utilidad random
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

class Circle {
  constructor(x, y, radius, color, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.speed = speed;

    const angle = Math.random() * Math.PI * 2;
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;
  }

  draw(context) {
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = this.color;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
    context.stroke();
    context.closePath();

    context.fillStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "14px Arial";
    context.fillText(this.text, this.posX, this.posY);
  }

  update(context) {
    this.draw(context);

    const w = canvas.width;
    const h = canvas.height;

    if (this.posX + this.radius > w) this.dx = -Math.abs(this.dx);
    if (this.posX - this.radius < 0) this.dx = Math.abs(this.dx);

    if (this.posY + this.radius > h) this.dy = -Math.abs(this.dy);
    if (this.posY - this.radius < 0) this.dy = Math.abs(this.dy);

    this.posX += this.dx;
    this.posY += this.dy;
  }
}

let circles = [];

function applyCanvasSize() {
  canvas.width = Number(widthSlider.value);
  canvas.height = Number(heightSlider.value);

  widthValue.textContent = canvas.width;
  heightValue.textContent = canvas.height;
  canvasInfo.textContent = `${canvas.width} × ${canvas.height}`;
}

function getSafeRadius() {
  const maxAllowed = Math.max(8, Math.floor(Math.min(canvas.width, canvas.height) / 4));
  const minR = 8;
  const maxR = Math.min(40, maxAllowed);
  return Math.floor(randomBetween(minR, maxR + 1));
}

function addCirclesUntil(n) {
  const current = circles.length;

  if (n <= current) {
    circles = circles.slice(0, n);
    circlesValue.textContent = n;
    return;
  }

  for (let i = current; i < n; i++) {
    const radius = getSafeRadius();
    const margin = radius + 2;

    const x = randomBetween(margin, canvas.width - margin);
    const y = randomBetween(margin, canvas.height - margin);

    const speed = randomBetween(1, 4);
    const color = `hsl(${Math.random() * 360}, 80%, 45%)`;
    const text = `Tec${i + 1}`;

    circles.push(new Circle(x, y, radius, color, text, speed));
  }

  circlesValue.textContent = n;
}

function regenerateScene() {
  circles = [];
  addCirclesUntil(Number(circlesSlider.value));
}

// Inicialización
applyCanvasSize();
regenerateScene();

// Eventos
widthSlider.addEventListener("input", () => {
  applyCanvasSize();
  regenerateScene();
});

heightSlider.addEventListener("input", () => {
  applyCanvasSize();
  regenerateScene();
});

circlesSlider.addEventListener("input", () => {
  addCirclesUntil(Number(circlesSlider.value));
});

randomBtn.addEventListener("click", () => {
  const randomCount = Math.floor(randomBetween(1, 50));
  const randomW = Math.floor(randomBetween(300, 1200));
  const randomH = Math.floor(randomBetween(200, 800));

  circlesSlider.value = randomCount;
  widthSlider.value = randomW;
  heightSlider.value = randomH;

  applyCanvasSize();
  circlesValue.textContent = randomCount;
  regenerateScene();
});

// Animación
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < circles.length; i++) {
    circles[i].update(ctx);
  }
}

animate();
