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