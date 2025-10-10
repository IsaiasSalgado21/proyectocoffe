function drawIsometricGrid(cols, rows, tileWidth, tileHeight, offsetX, offsetY) {
  fill('#b6f7a0');
  stroke('#99e550');
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let isoX = (x - y) * tileWidth / 2 + offsetX;
      let isoY = (x + y) * tileHeight / 2 + offsetY;
      beginShape();
      vertex(isoX, isoY);
      vertex(isoX + tileWidth / 2, isoY + tileHeight / 2);
      vertex(isoX, isoY + tileHeight);
      vertex(isoX - tileWidth / 2, isoY + tileHeight / 2);
      endShape(CLOSE);
    }
  }
}

// Conversión de pantalla a celda isométrica
function screenToIsoCell(mx, my, tileWidth, tileHeight, offsetX, offsetY) {
  let x = ((mx - offsetX) / (tileWidth / 2) + (my - offsetY) / (tileHeight / 2)) / 2;
  let y = ((my - offsetY) / (tileHeight / 2) - (mx - offsetX) / (tileWidth / 2)) / 2;
  return {col: Math.floor(x), row: Math.floor(y)};
}