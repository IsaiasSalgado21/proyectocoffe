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


let objeto = {
  x: 250 ,
  y: 230 ,
  w: 100 ,
  h: 100
};


function preload() {

  cuartoImg = loadImage("recursos/cuarto.png")
  spriteImg = loadImage("recursos/gatito.png");
  cafeteraImg = loadImage("recursos/cafetera.png")
  framesData = loadJSON("recursos/gatito.json");

}


function setup() {
  createCanvas(1200, 600);
  frameRate(60);

 
  framesData = Object.values(framesData.frames);
}

function draw() {
  background(220);

  //aqui estamos dibujando el piso
  image(cuartoImg, 0, 0, 250*2.5, 250*2.5);

  image(cafeteraImg, 230, 235, 64*2, 64*2);

  let gatitoHitbox = {
    x:gatitoX,
    y: gatitoY,
    w: 32,
    h: 64
  };

  let colision =
    gatitoHitbox.x < objeto.x + objeto.w &&
    gatitoHitbox.x + gatitoHitbox.w > objeto.x &&
    gatitoHitbox.y < objeto.y + objeto.h &&
    gatitoHitbox.y + gatitoHitbox.h > objeto.y;

    if (colision) {
    fill(255, 100, 100);
    } else {
    fill(100, 200, 100);
}
  let f = framesData[currentFrame];
  let frame = f.frame;


  if(keyIsDown(87)){
    gatitoY -= speed;
  }
  if(keyIsDown(83)){
    gatitoY += speed;
  }
  if(keyIsDown(65)){
    gatitoX -= speed;
  }
  if(keyIsDown(68)){
    gatitoX += speed;
  }
  rect(objeto.x, objeto.y, objeto.w, objeto.h);
  rect(gatitoX, gatitoY, 32, 64);
  if (showHitbox) {
    noFill();
    stroke(0, 0, 255);
    rect(objeto.x, objeto.y, objeto.w, objeto.h);
    rect(gatitoHitbox.x, gatitoHitbox.y, gatitoHitbox.w, gatitoHitbox.h);
    stroke(0);
  }


  image(
    spriteImg,
    gatitoX, gatitoY, frame.w * 2, frame.h * 2,
    frame.x, frame.y, frame.w, frame.h
  );
  

  
  if (millis() - lastChange > f.duration) {
    currentFrame = (currentFrame + 1) % framesData.length;
    lastChange = millis();
  }
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
