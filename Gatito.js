class Gatito {
  constructor(worldX, worldY, speedWorld, radio, framesData, spriteImg, frameSets, tileW = 64, tileH = 32, offsetX = 600, offsetY = 100) {
    this.worldX = worldX;
    this.worldY = worldY;
    this.speedWorld = speedWorld; // velocidad en "tiles" por frame
    this.radio = radio;

    this.tileW = tileW;
    this.tileH = tileH;
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    this.x = 0;
    this.y = 0;

    this.framesData = framesData;
    this.spriteImg = spriteImg;
    this.frameSets = frameSets;
    this.currentFrame = 0;
    this.lastChange = 0;

    this.direccion = "quieto";
    this.showHitbox = false;

    this.moving = false;

    // Estado de la taza (si la tiene en la cabeza)
    this.carriedCup = false;

    const p = this.isoToScreen(this.worldX, this.worldY);
    this.x = p.x;
    this.y = p.y;
  }

  isoToScreen(wx, wy) {
    let sx = (wx - wy) * (this.tileW / 2) + this.offsetX;
    let sy = (wx + wy) * (this.tileH / 2) + this.offsetY;
    return { x: sx, y: sy };
  }

  // transforma vector pantalla -> world: usa la inversa de la matriz isométrica
  screenVecToWorldVec(sx, sy) {
    // matriz M = [[a, -a],[b,b]] donde a = tileW/2, b = tileH/2
    let a = this.tileW / 2;
    let b = this.tileH / 2;
    let det = a * b - (-a * b); // = 2ab
    // inv(M) = (1/det) * [[b, a],[-b, a]]
    let inv00 = b / det;
    let inv01 = a / det;
    let inv10 = -b / det;
    let inv11 = a / det;
    return {
      x: inv00 * sx + inv01 * sy,
      y: inv10 * sx + inv11 * sy
    };
  }

  actualizar(objetosRect, objetosCirc) {
    // Lectura de controles
    let movArriba = keyIsDown(87); // W
    let movAbajo  = keyIsDown(83); // S
    let movIzq    = keyIsDown(65); // A
    let movDer    = keyIsDown(68); // D

    // Determinar dirección de animación (según combinaciones)
    let desiredDir = this.direccion;
    if (movAbajo && movDer) desiredDir = "abajoDerecha";
    else if (movAbajo && movIzq) desiredDir = "abajoIzquierda";
    else if (movArriba && movDer) desiredDir = "arribaDerecha";
    else if (movArriba && movIzq) desiredDir = "arribaIzquierda";
    else if (movAbajo) desiredDir = "abajo";
    else if (movArriba) desiredDir = "arriba";
    else if (movDer) desiredDir = "derecha";
    else if (movIzq) desiredDir = "izquierda";
    else desiredDir = "quieto";

    // Movimiento en coordenadas del MUNDO (alineado a la rejilla isométrica)
    // world axes mapping (tile-based):
    // - W (arriba/norte): worldX--, worldY--
    // - S (abajo/sur):  worldX++, worldY++
    // - D (derecha/este): worldX++
    // - A (izquierda/oeste): worldY++
    // Esto sigue la proyección isométrica usada en el resto del código.
    let vx = 0, vy = 0;
    if (movArriba) { vx -= 1; vy -= 1; }
    if (movAbajo)  { vx += 1; vy += 1; }
    if (movDer)    { vx += 1; }
    if (movIzq)    { vy += 1; }

    // Si no hay entrada, parar (pero conservar último frame)
    if (vx === 0 && vy === 0) {
      this.moving = false;
      return;
    }

    // Normalizar vector en mundo para mantener velocidad constante en cualquier dirección
    let vlen = Math.sqrt(vx * vx + vy * vy);
    vx = vx / vlen;
    vy = vy / vlen;

    // Desplazamiento en unidades del mundo (tiles) por frame
    let dxw = vx * this.speedWorld;
    let dyw = vy * this.speedWorld;

    // Actualizamos dirección y reiniciamos animación si cambia
    if (desiredDir !== this.direccion) {
      this.direccion = desiredDir;
      this.currentFrame = 0;
      this.lastChange = millis();
    }
    this.moving = true;

    // Calcula la siguiente posición en world
    let nextWorldX = this.worldX + dxw;
    let nextWorldY = this.worldY + dyw;
    let screenNext = this.isoToScreen(nextWorldX, nextWorldY);

    // Hitbox en pies (ajusta si necesario)
    let footOffsetX = 0;
    let footOffsetY = this.tileH * 0.5;
    let hitX = screenNext.x + footOffsetX;
    let hitY = screenNext.y + footOffsetY;

    // Colisiones: funciones globales circleRectCollide / circleCircleCollide
    let colRect = objetosRect.some(obj => circleRectCollide(hitX, hitY, this.radio, obj.x, obj.y, obj.w, obj.h));
    let colCirc = objetosCirc.some(obj => circleCircleCollide(hitX, hitY, this.radio, obj.x, obj.y, obj.r));

    if (!colRect && !colCirc) {
      this.worldX = nextWorldX;
      this.worldY = nextWorldY;
      let p = this.isoToScreen(this.worldX, this.worldY);
      this.x = p.x;
      this.y = p.y;
    }
    // si colisiona, no movemos (podemos mejorar con resolución por ejes si quieres)
  }

  dibujar() {
    let frames = (this.frameSets && this.frameSets[this.direccion]) ? this.frameSets[this.direccion] : (this.frameSets ? this.frameSets["quieto"] : [0]);
    if (!frames || frames.length === 0) frames = [0];

    // Asegura índice válido
    this.currentFrame = this.currentFrame % frames.length;

    // Avanzar animación sólo si se está moviendo
    if (this.moving) {
      let idx = frames[this.currentFrame % frames.length];
      let dur = (this.framesData && this.framesData[idx]) ? this.framesData[idx].duration : 100;
      if (millis() - this.lastChange > dur) {
        this.currentFrame = (this.currentFrame + 1) % frames.length;
        this.lastChange = millis();
      }
    } else {
      // no cambiamos currentFrame: se queda en el último frame mostrado
    }

    let frameIndex = frames[this.currentFrame % frames.length];
    let f = this.framesData[frameIndex];
    let frame = f && f.frame ? f.frame : { x:0,y:0,w:32,h:32 };

    image(
      this.spriteImg,
      this.x, this.y, frame.w * 2, frame.h * 2,
      frame.x, frame.y, frame.w, frame.h
    );

    // Hitbox en pies (si activada)
    if (this.showHitbox) {
      noFill();
      stroke(0,255,0);
      let footX = this.x + (frame.w * 2) / 2;
      let footY = this.y + frame.h * 2 - 4;
      ellipse(footX, footY, this.radio * 2);
      stroke(0);
    }
  }

  toggleHitbox() { this.showHitbox = !this.showHitbox; }
  toggleCup() { this.carriedCup = !this.carriedCup; }
}