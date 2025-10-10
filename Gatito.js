class Gatito {
  // El constructor inicializa las propiedades del gatito.
  constructor(x, y, speed, radio, framesData, spriteImg, frameSets) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.radio = radio; // Radio para colisiones
    this.direccion = "quieto";
    this.showHitbox = false;

    // Propiedades para la animación
    this.framesData = framesData;
    this.spriteImg = spriteImg;
    this.frameSets = frameSets;
    this.currentFrame = 0;
    this.lastChange = 0;
  }

  // Método para actualizar la posición y la animación del gatito
  actualizar(objetosRect, objetosCirc) {
    let nextX = this.x;
    let nextY = this.y;

    // Lógica de movimiento (W, A, S, D)
    let movArriba = keyIsDown(87); // W
    let movAbajo = keyIsDown(83); // S
    let movIzq = keyIsDown(65); // A
    let movDer = keyIsDown(68); // D

    if (movAbajo && movDer) this.direccion = "abajoDerecha";
    else if (movAbajo && movIzq) this.direccion = "abajoIzquierda";
    else if (movArriba && movDer) this.direccion = "arribaDerecha";
    else if (movArriba && movIzq) this.direccion = "arribaIzquierda";
    else if (movAbajo) this.direccion = "abajo";
    else if (movArriba) this.direccion = "arriba";
    else if (movDer) this.direccion = "derecha";
    else if (movIzq) this.direccion = "izquierda";
    else this.direccion = "quieto";

    if (movArriba) nextY -= this.speed;
    if (movAbajo) nextY += this.speed;
    if (movIzq) nextX -= this.speed;
    if (movDer) nextX += this.speed;

    // Lógica de colisión
    let hitboxX = nextX + 16;
    let hitboxY = nextY + 32;

    let colisionRect = objetosRect.some(obj =>
      circleRectCollide(hitboxX, hitboxY, this.radio, obj.x, obj.y, obj.w, obj.h)
    );

    let colisionCirc = objetosCirc.some(obj =>
      circleCircleCollide(hitboxX, hitboxY, this.radio, obj.x, obj.y, obj.r)
    );

    if (!colisionRect && !colisionCirc) {
      this.x = nextX;
      this.y = nextY;
    }
  }

  // Método para dibujar el gatito y su hitbox
  dibujar() {
    let frames = this.frameSets[this.direccion];
    let frameIndex = 0;
    if (this.direccion !== "quieto") {
      if (millis() - this.lastChange > this.framesData[frames[this.currentFrame % frames.length]].duration) {
        this.currentFrame = (this.currentFrame + 1) % frames.length;
        this.lastChange = millis();
      }
      frameIndex = frames[this.currentFrame % frames.length];
    } else {
      this.currentFrame = 0;
      frameIndex = frames[0];
    }

    let f = this.framesData[frameIndex];
    let frame = f.frame;

    image(
      this.spriteImg,
      this.x, this.y, frame.w * 2, frame.h * 2,
      frame.x, frame.y, frame.w, frame.h
    );

    // Dibujar la hitbox si está activada
    if (this.showHitbox) {
      noFill();
      stroke(0, 255, 0);
      ellipse(this.x + 16, this.y + 32, this.radio * 2);
      stroke(0);
    }
  }

  // Método para alternar la visibilidad de la hitbox
  toggleHitbox() {
    this.showHitbox = !this.showHitbox;
    console.log("Mostrar hitbox:", this.showHitbox);
  }
}