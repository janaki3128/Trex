var trex, trex_running,trex_collided;
var ground, groundImage, invisibleGround;
var cloud_img, cloudsGroup;
var obstacle, ob1, ob2, ob3, ob4, ob5, ob6, obstaclesGroup;
var score =0;
var gameOver, gameOver_Img;
var restart, restart_Img;
var jumpSound, dieSound, cpSound;

const PLAY = 1;
const END = 0;
var state = PLAY;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloud_img = loadImage("cloud.png");
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  ob5 = loadImage("obstacle5.png");
  ob6 = loadImage("obstacle6.png");
  gameOver_Img = loadImage("gameOver.png");
  restart_Img = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  cpSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  //Creating trex
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  //creating ground sprite
  ground = createSprite(300, 180, 600, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  
  //creating gameover sprite
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOver_Img);
  gameOver.scale =0.5;
  gameOver.visible=false;
  
  //creating restart sprite
  restart = createSprite(300,140);
  restart.addImage(restart_Img);
  restart.scale =0.5;
  restart.visible = false;
  
  //creating invisible ground
  invisibleGround = createSprite(300, 190, 600, 10);
  invisibleGround.visible = false;
  
  // creating obstacle and cloud group
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  //Setting collider for trex
  trex.setCollider("circle",0,0,38);
  
  //AI to make trex jump
  //trex.setCollider("rectangle",0,0,400,trex.height);
  //To see the collider while debugging
  trex.debug= true;
}

function draw() {
  //refreshes the screen with white color
  background("white");
  
  //Displaying Scores
  text("Score: " + score, 500,50);
  
  // console.log("this is ",state);
  
  //console.log(frameRate())
  //when game is in play state
  if(state === PLAY){
    //move the ground
    //console.log(ground.velocityX)
    ground.velocityX = -(6 + score/100);
    //console.log(getFrameRate())
    //Increasing score by 1 after every 4 frames;
    score = score + Math.round(getFrameRate()/60);
    
    //adding Sound on every multiple of 100
    if(score>0 && score%100=== 0){
      cpSound.play();
    }
    
    //Infinite scrolling ground
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    
    //trex jump when space key is pressed
    if (keyDown("space") && trex.y >= 161) {
      trex.velocityY = -12;
      jumpSound.play();
    }
    
    //Gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawning Clouds
    spawnClouds();

    //spawning Obstacles
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
     //AI to make trex jump when sees obstacle
      // trex.velocityY = -12;
      // jumpSound.play();
      state = END;
      dieSound.play();
    }
  }
  //when game is in end state
  else if(state === END){
    //Displaying gameOver and restart
    gameOver.visible=true;
    restart.visible = true;
    //stop the ground
    ground.velocityX = 0;
    
    trex.velocityY = 0;
    //change the trex Animation
    trex.changeAnimation("collided",trex_collided);
    
    //set the lifetime to negative number to objects so that are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //stop the obstacle and cloud
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //to restart the game
    if(mousePressedOver(restart)){
     // console.log("This is a Restart button");
      reset();
    }
  }
    
  //testing the trex's y position
  //console.log(trex.y);


  //stop trex from falling off the ground
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnClouds() {
  //creating cloud every 60 frames
  if (frameCount % 70 === 0) {

    //Creating cloud sprite
    cloud = createSprite(600, 20, 40, 10);
    cloud.velocityX = -3;
    cloud.addImage("cloud", cloud_img);
    cloud.scale = 0.5;

    //spawning clouds at different heights
    cloud.y = Math.round(random(10, 60));

    //Adjusting the depths
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //Assigning lifetime to the cloud
    cloud.lifetime = 200;
    
    //add each cloud to the cloud group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    obstacle = createSprite(600, 165, 1, 40);
  //  console.log(obstacle.velocityX)
    obstacle.velocityX = -(6 + score/100);
    
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1:
          obstacle.addImage(ob1);
          break;
      case 2:
          obstacle.addImage(ob2);
          break;
      case 3:
          obstacle.addImage(ob3);
          break;
      case 4:
          obstacle.addImage(ob4);
          break;
      case 5:
          obstacle.addImage(ob5);
          break;
      case 6:
          obstacle.addImage(ob6);
          break;
      default: break;
    }
    
    //scaling assigning lifetime to obstacle
    obstacle.scale=0.5;
    obstacle.lifetime = 160;
    
    //Setting obstacle depth to trex depth
    obstacle.depth = trex.depth;
    
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    //console.log( obstacle.depth)
  }
}

function reset(){
  // resetting the game state
  state = PLAY;
  score = 0;
  
  //hiding the gameover and restart
  gameOver.visible = false;
  restart.visible = false;
  
  //destroying obstacles and clouds
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  //changing animation again to running
  trex.changeAnimation("running",trex_running);
}