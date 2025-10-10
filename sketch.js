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

  gatito = new Gatito(
    120, 120, // posición inicial
    2,        // velocidad
    16,       // radio para colisiones
    framesData,
    spriteImg,
    frameSets
  );
}

let gatitoRadio = 16; // Radio del gatito para colisiones

let direccion = "quieto"; 
function draw() {
  background(220);
  drawIsometricGrid(16, 16, 124, 62, 600, 100);
  image(cuartoImg, 0, 0, 250*2.5, 250*2.5);
  image(cafeteraImg, 230, 235, 64*2, 64*2);

  // Actualiza y dibuja el gatito
  gatito.actualizar(objetosRect, objetosCirc);
  gatito.dibujar();

  // Dibujar objetos
  objetosRect.forEach(obj => obj.dibujar());
  objetosCirc.forEach(obj => obj.dibujar());

  // --- DETECCIÓN CERCA DE LA CAFETERA ---
  let cafeteraCentroX = 230 + 64;
  let cafeteraCentroY = 235 + 64;
  let radioInteraccion = 48;

  let distanciaCafetera = dist(gatito.x + 16, gatito.y + 32, cafeteraCentroX, cafeteraCentroY);
  if (distanciaCafetera < radioInteraccion) {
    console.log("estas cerca de la cafetera");
  }
}

function keyPressed(){
  if (key === "h" || key === "H") {
    gatito.toggleHitbox();
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
  fill('#2d5804');
  stroke('#124900ff'); // Verde claro con transparencia
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

let gatito; // Instancia de la clase Gatito

// Esto sí está bien en sketch.js
let objetosRect = [
  new ObjetoRect(250, 230, 50, 50)
];

let objetosCirc = [
  new ObjetoCirc(500, 300, 40),
  new ObjetoCirc(700, 400, 50)
];
