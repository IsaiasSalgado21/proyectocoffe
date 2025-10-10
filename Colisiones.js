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