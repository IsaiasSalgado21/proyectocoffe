let pisoImg;
let spriteImg;
let framesData;
let currentFrame = 0;
let lastChange = 0;

let gatitoX = 120;
let gatitoY = 120;
let speed = 2;


function preload() {

  pisoImg = loadImage("recursos/pisoBN.png")
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
  image(pisoImg, 0, 0, 162*4, 88*4);

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
