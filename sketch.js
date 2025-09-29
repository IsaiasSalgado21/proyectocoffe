let cuartoImg;
let spriteImg;
let cafeteraImg;
let framesData;
let currentFrame = 0;
let lastChange = 0;

let gatitoX = 120;
let gatitoY = 120;
let speed = 2;

let showHitbox = false;


// Clase para objetos rectangulares
class ObjetoRect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  dibujar() {
    rect(this.x, this.y, this.w, this.h);
  }
}

// Clase para objetos circulares
class ObjetoCirc {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  dibujar() {
    ellipse(this.x, this.y, this.r * 2);
  }
}

// Arreglos de objetos
let objetosRect = [
  new ObjetoRect(250, 230, 50, 50)
];

let objetosCirc = [
  new ObjetoCirc(500, 300, 40),
  new ObjetoCirc(700, 400, 50)
];


function preload() {

  cuartoImg = loadImage("recursos/cuarto.png")
  spriteImg = loadImage("recursos/gatito.png");
  cafeteraImg = loadImage("recursos/cafetera.png")
  framesData = loadJSON("recursos/gatito.json");

}


function setup() {
  createCanvas(1200, 600);
  frameRate(60);

  // Filtra solo los frames válidos y guarda sus nombres
  let framesRaw = Object.entries(framesData.frames)
    .filter(([name, f]) => f.frame);

  framesData = framesRaw.map(([name, f]) => f);
  window.frameNameToIndex = {};
  framesRaw.forEach(([name, f], idx) => window.frameNameToIndex[name] = idx);

  // Inicializa frameSets aquí, usando el mapeo correcto
  frameSets = {
    abajoDerecha: [
      frameNameToIndex["gatito 0.ase"],
      frameNameToIndex["gatito 1.ase"]
    ],
    abajo: [
      frameNameToIndex["gatito 2.ase"],
      frameNameToIndex["gatito 3.ase"],
      frameNameToIndex["gatito 4.ase"],
      frameNameToIndex["gatito 5.ase"]
    ],
    arriba: [
      frameNameToIndex["gatito 6.ase"],
      frameNameToIndex["gatito 7.ase"],
      frameNameToIndex["gatito 8.ase"],
      frameNameToIndex["gatito 9.ase"]
    ],
    abajoIzquierda: [
      frameNameToIndex["gatito 10.ase"],
      frameNameToIndex["gatito 11.ase"]
    ],
    derecha: [
      frameNameToIndex["gatito 12.ase"],
      frameNameToIndex["gatito 13.ase"],
      frameNameToIndex["gatito 14.ase"],
      frameNameToIndex["gatito 15.ase"]
    ],
    izquierda: [
      frameNameToIndex["gatito 16.ase"],
      frameNameToIndex["gatito 17.ase"],
      frameNameToIndex["gatito 18.ase"],
      frameNameToIndex["gatito 19.ase"]
    ],
    arribaDerecha: [
      frameNameToIndex["gatito 20.ase"],
      frameNameToIndex["gatito 21.ase"]
    ],
    arribaIzquierda: [
      frameNameToIndex["gatito 22.ase"],
      frameNameToIndex["gatito 23.ase"]
    ],
    quieto: [frameNameToIndex["gatito 2.ase"]]
  };
}

let gatitoRadio = 16; // Radio del gatito para colisiones

let direccion = "quieto"; 
function draw() {
  background(220);
  // Dibuja la cuadrícula isométrica como guía
  drawIsometricGrid(16, 16, 124, 62, 600, 100); // Puedes ajustar el offset para centrar la cuadrícula
  image(cuartoImg, 0, 0, 250*2.5, 250*2.5);
  image(cafeteraImg, 230, 235, 64*2, 64*2);

  let nextX = gatitoX;
  let nextY = gatitoY;

  // Detectar dirección y movimiento
  let movArriba = keyIsDown(87); // W
  let movAbajo = keyIsDown(83);  // S
  let movIzq = keyIsDown(65);    // A
  let movDer = keyIsDown(68);    // D

  // Determinar dirección
  if (movAbajo && movDer) direccion = "abajoDerecha";
  else if (movAbajo && movIzq) direccion = "abajoIzquierda";
  else if (movArriba && movDer) direccion = "arribaDerecha";
  else if (movArriba && movIzq) direccion = "arribaIzquierda"; 
  else if (movAbajo) direccion = "abajo";
  else if (movArriba) direccion = "arriba";
  else if (movDer) direccion = "derecha";
  else if (movIzq) direccion = "izquierda";
  else direccion = "quieto";

  // Movimiento
  if (movArriba) nextY -= speed;
  if (movAbajo) nextY += speed;
  if (movIzq) nextX -= speed;
  if (movDer) nextX += speed;

  let hitboxX = nextX + 16;
  let hitboxY = nextY + 32;

  // Colisión con rectángulos
  let colisionRect = objetosRect.some(obj =>
    circleRectCollide(
      hitboxX,
      hitboxY,
      gatitoRadio,
      obj.x, obj.y, obj.w, obj.h
    )
  );

  // Colisión con círculos
  let colisionCirc = objetosCirc.some(obj =>
    circleCircleCollide(
      hitboxX,
      hitboxY,
      gatitoRadio,
      obj.x,
      obj.y,
      obj.r
    )
  );

  if (!colisionRect && !colisionCirc) {
    gatitoX = nextX;
    gatitoY = nextY;
  }

  // Dibujar objetos
  objetosRect.forEach(obj => obj.dibujar());
  objetosCirc.forEach(obj => obj.dibujar());

  if (showHitbox) {
    noFill();
    stroke(0, 255, 0);
    objetosRect.forEach(obj => rect(obj.x, obj.y, obj.w, obj.h));
    objetosCirc.forEach(obj => ellipse(obj.x, obj.y, obj.r * 2));
    ellipse(gatitoX + 16, gatitoY + 32, gatitoRadio * 2);
    stroke(0);
  }
  // --- DETECCIÓN CERCA DE LA CAFETERA ---
  // Coordenadas y radio de interacción de la cafetera
  let cafeteraCentroX = 230 + 64; // centro X de la cafetera
  let cafeteraCentroY = 235 + 64; // centro Y de la cafetera
  let radioInteraccion = 48; // puedes ajustar este valor

  let distanciaCafetera = dist(gatitoX + 16, gatitoY + 32, cafeteraCentroX, cafeteraCentroY);
  if (distanciaCafetera < radioInteraccion) {
    console.log("estas cerca de la cafetera");
  }

  // Animación según dirección
  let frames = frameSets[direccion];
  let frameIndex = 0;
  if (direccion !== "quieto") {
    // Avanza el frame solo si está en movimiento
    if (millis() - lastChange > framesData[frames[currentFrame % frames.length]].duration) {
      currentFrame = (currentFrame + 1) % frames.length;
      lastChange = millis();
    }
    frameIndex = frames[currentFrame % frames.length];
  } else {
    currentFrame = 0; // Siempre el primer frame de quieto
    frameIndex = frames[0];
  }

  let f = framesData[frameIndex];
  let frame = f.frame;

  image(
    spriteImg,
    gatitoX, gatitoY, frame.w * 2, frame.h * 2,
    frame.x, frame.y, frame.w, frame.h
  );
}

function keyPressed(){
  if(key === "k"|| key === "k" ){
    console.log("se presiono la tecla k");
  }
  if (key === "h" || key === "H") {
    showHitbox = !showHitbox;
    console.log("Mostrar hitbox:", showHitbox);
  }
}

function circleRectCollide(cx, cy, radius, rx, ry, rw, rh) {

  let closestX = constrain(cx, rx, rx + rw);
  let closestY = constrain(cy, ry, ry + rh);

  let dx = cx - closestX;
  let dy = cy - closestY;
  return (dx * dx + dy * dy) < (radius * radius);
}


function circleCircleCollide(x1, y1, r1, x2, y2, r2) {
  let dx = x1 - x2;
  let dy = y1 - y2;
  let distancia = sqrt(dx * dx + dy * dy);
  return distancia < (r1 + r2);
}

// Función para dibujar la cuadrícula isométrica
function drawIsometricGrid(cols, rows, tileWidth, tileHeight, offsetX, offsetY) {
  fill(200, 255, 200, 50);
  stroke(100, 255, 100, 150); // Verde claro con transparencia
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Coordenadas isométricas
      let isoX = (x - y) * tileWidth / 2 + offsetX;
      let isoY = (x + y) * tileHeight / 2 + offsetY;

      // Dibuja el rombo (loseta)
      beginShape();
      vertex(isoX, isoY);
      vertex(isoX + tileWidth / 2, isoY + tileHeight / 2);
      vertex(isoX, isoY + tileHeight);
      vertex(isoX - tileWidth / 2, isoY + tileHeight / 2);
      endShape(CLOSE);
    }
  }
}
