let cuartoImg;
let spriteImg;
let framesData;
let currentFrame = 0;
let lastChange = 0;

let gatitoX = 120;
let gatitoY = 120;
let speed = 2;


function preload() {

  cuartoImg = loadImage("recursos/cuarto.png")
  spriteImg = loadImage("recursos/gatito.png");
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
}
