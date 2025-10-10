function detectarInteraccion(gatito, objeto, radioInteraccion) {
  let distancia = dist(
    gatito.x + 16, gatito.y + 32,
    objeto.x + objeto.w / 2, objeto.y + objeto.h / 2
  );
  return distancia < radioInteraccion;
}