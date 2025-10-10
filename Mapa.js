class Mapa {
  constructor(objetosRect, objetosCirc) {
    this.objetosRect = objetosRect;
    this.objetosCirc = objetosCirc;
  }
  dibujar() {
    this.objetosRect.forEach(obj => obj.dibujar());
    this.objetosCirc.forEach(obj => obj.dibujar());
  }
}