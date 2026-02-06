let cuartoImg;
let spriteImg;
let cafeteraImg;
let framesData;
let currentFrame = 0;
let lastChange = 0;

let gatitoX = 120;
let gatitoY = 120;
let speed = 2;

let showHitboxes = false; // controla si se dibujan outlines de debug

let tazaImg;
const cupFrameW = 25;
const cupFrameH = 25;
const cupFrameCount = 3;
let cupsOnGround = [];

// Escala para dibujar la taza (ajusta aquí)
const cupDisplayScale = 1.8; // prueba 1.5, 1.8, 2.0 según quieras más grande

// Define ubicación y tamaño de la cafetera (coincide con el dibujo en draw)
const cafeteraObj = { x: 230, y: 235, w: 128, h: 128 };
const radioInteraccionCafetera = 48;


function preload() {
  cuartoImg = loadImage("recursos/cuarto.png");
  spriteImg = loadImage("recursos/gatito.png");
  cafeteraImg = loadImage("recursos/cafetera.png");
  framesData = loadJSON("recursos/gatito.json");

  // sprite sheet de la taza
  tazaImg = loadImage("recursos/taza.png");
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

  // tile size y offset de la cuadrícula que ya usas
  let tileW = 124, tileH = 62;
  let offsetX = 600, offsetY = 100;

  // velocidad más baja:
  gatito = new Gatito(2, 2, 0.04, 16, framesData, spriteImg, frameSets, tileW, tileH, offsetX, offsetY);

  // Array para tazas en el suelo
  cupsOnGround = [];
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
  //objetosRect.forEach(obj => obj.dibujar());
  // objetosCirc.forEach(obj => obj.dibujar());

  // --- DETECCIÓN CERCA DE LA CAFETERA ---
  let cafeteraCentroX = 230 + 64;
  let cafeteraCentroY = 235 + 64;
  let radioInteraccion = 48;

  let distanciaCafetera = dist(gatito.x + 16, gatito.y + 32, cafeteraCentroX, cafeteraCentroY);
  if (distanciaCafetera < radioInteraccion) {
    console.log("estas cerca de la cafetera");
  }

  // Dibuja tazas que estén en el suelo (animadas con los 3 frames)
  let drawW = cupFrameW * cupDisplayScale;
  let drawH = cupFrameH * cupDisplayScale;
  let cupAnimFrame = Math.floor(millis() / 180) % cupFrameCount; // animación común
  for (let c of cupsOnGround) {
    let sx = cupAnimFrame * cupFrameW;
    let sy = 0;
    image(tazaImg, c.x - drawW/2, c.y - drawH, drawW, drawH, sx, sy, cupFrameW, cupFrameH);
  }

  // Si el gatito lleva una taza, dibujarla sobre su cabeza (animada)
  if (gatito.carriedCup) {
    // frame animado: cambia cada 180ms
    let animFrame = Math.floor(millis() / 180) % cupFrameCount;
    let sx = animFrame * cupFrameW;
    let sy = 0;

    // calculamos posicion de la cabeza: centrado horizontalmente sobre el sprite del gatito
    let frames = frameSets[gatito.direccion] || frameSets["quieto"];
    let fIndex = frames[gatito.currentFrame % frames.length];
    let f = framesData[fIndex];
    let spriteW = (f && f.frame) ? f.frame.w * 2 : 64;
    let spriteH = (f && f.frame.h) ? f.frame.h * 2 : 64;

    let headX = gatito.x + spriteW / 2;
    // Ajusta headY si la taza queda muy alta/baja
    let headY = gatito.y - 10; // puedes reducir más (ej. -6) o aumentar (ej. -18)

    // usa la misma escala definida arriba
    let drawW = cupFrameW * cupDisplayScale;
    let drawH = cupFrameH * cupDisplayScale;

    image(tazaImg, headX - drawW/2, headY - drawH/2, drawW, drawH, sx, sy, cupFrameW, cupFrameH);
  }

  // Dibujar outlines de debug solo si está activado
  if (showHitboxes) {
    push();
    noFill();
    stroke(0, 0, 255); // color del borde (azul)
    strokeWeight(2);
    objetosRect.forEach(obj => {
      rect(obj.x, obj.y, obj.w, obj.h);
    });
    objetosCirc.forEach(obj => {
      ellipse(obj.x, obj.y, obj.r * 2);
    });
    pop();
  }
}

function keyPressed(){
  if (key === "h" || key === "H") {
    showHitboxes = !showHitboxes;
    // sincroniza la propiedad del gatito para que su hitbox también se muestre/oculte
    gatito.showHitbox = showHitboxes;
    console.log("Mostrar hitboxes:", showHitboxes);
  }

  // Toggle taza with 'k' (recoger si cerca de cafetera, soltar en el suelo si la lleva)
  if (key === "k" || key === "K") {
    if (gatito.carriedCup) {
      // soltar: agregar una taza en el suelo en la posición de los pies
      let frames = frameSets[gatito.direccion] || frameSets["quieto"];
      let fIndex = frames[gatito.currentFrame % frames.length];
      let f = framesData[fIndex];
      let spriteW = (f && f.frame) ? f.frame.w * 2 : 64;
      let spriteH = (f && f.frame.h) ? f.frame.h * 2 : 64;
      let footX = gatito.x + spriteW / 2;
      let footY = gatito.y + spriteH - 4;
      cupsOnGround.push({ x: footX, y: footY });
      gatito.toggleCup();
    } else {
      // intentar recoger: solo si estamos cerca de la cafetera
      // usamos la función detectarInteraccion (Interacciones.js)
      if (detectarInteraccion(gatito, cafeteraObj, radioInteraccionCafetera)) {
        gatito.toggleCup(); // ahora lleva la taza
      } else {
        // opcional: si quieres permitir recoger de suelo cuando estés cerca de una taza:
        // buscar taza en ground cercana y recogerla
        let foundIndex = -1;
        for (let i = 0; i < cupsOnGround.length; i++) {
          let c = cupsOnGround[i];
          let d = dist(gatito.x + 16, gatito.y + 32, c.x, c.y);
          if (d < 32) { foundIndex = i; break; }
        }
        if (foundIndex >= 0) {
          // recoger del suelo
          cupsOnGround.splice(foundIndex, 1);
          gatito.toggleCup();
        } else {
          // no cerca: opcional mensaje
          console.log("No hay taza cerca para recoger");
        }
      }
    }
  }

  // controles +/- opcionales para ajustar speedWorld en tiempo real:
  if (key === '+') {
    gatito.speedWorld = constrain(gatito.speedWorld + 0.01, 0.01, 1.0);
    console.log("speedWorld:", gatito.speedWorld.toFixed(3));
  }
  if (key === '-') {
    gatito.speedWorld = constrain(gatito.speedWorld - 0.01, 0.01, 1.0);
    console.log("speedWorld:", gatito.speedWorld.toFixed(3));
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

// ecenario2 background removed
