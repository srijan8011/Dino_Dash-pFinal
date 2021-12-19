var PLAY = 1;
var END = 0;
var WIN = 2;
var dino, dino_running, dino_jumping, dino_collided;
var jungle, invisjungle, jungleImg;
var boulder, boulderGroup, coin, coinGroup;
var score = 0;
var gameover, gameoverImg, restart, restartImg;
var eatingSound, jumpSound;
var gameState = PLAY;

function preload() {
    dino_running = loadAnimation("./png/run1.png", "./png/run2.png", "./png/run3.png", "./png/run4.png", "./png/run5.png", "./png/run6.png", "./png/run7.png", "./png/run8.png");
    dino_jumping = loadAnimation("./png/jump1.png", "./png/jump2.png", "./png/jump3.png", "./png/jump4.png", "./png/jump5.png", "./png/jump6.png", "./png/jump7.png", "./png/jump8.png", "./png/jump9.png", "./png/jump10.png", "./png/jump11.png",);
    dino_collided = loadImage("./png/dead.png");
    boulder = loadImage("./png/boulder.png");
    coin = loadImage("./png/coin.png");
    gameoverImg = loadImage("./png/gameOver.png");
    restartImg = loadImage("./png/restart.png");
    eatingSound = loadSound("./png/eating.mp3");
    jumpSound = loadSound("./png/jump.wav");
    jungleImg = loadImage("./png/jungle.png");
}

function setup() {
    createCanvas(1200, 600);

    jungle = createSprite(600, 200, 600, 30);
    jungle.addImage("jungle", jungleImg);
    jungle.scale=0.5;
    jungle.x=width/2;
    dino = createSprite(90, 120, 15, 10);
    dino.addAnimation("running", dino_running);
    dino.addAnimation("jumping", dino_jumping);
    dino.addImage("collided", dino_collided);
    dino.scale = 0.5;
    dino.setCollider("circle", -100, 0, 210);
    // dino.debug = true;

    invisibleGround = createSprite(600, 600, 2400, 30);
    invisibleGround.visible = false;

    coinsGroup = new Group();
    obstaclesGroup = new Group();

    score = 0;

    gameover = createSprite(400, 100);
    gameover.addImage(gameoverImg);
  
    restart = createSprite(550, 140);
    restart.addImage(restartImg);
  
    gameover.scale = 0.5;
    restart.scale = 0.1;
  
    gameover.visible = false;
    restart.visible = false;
}

function draw() {
    background(100);

    dino.x=camera.position.x-200;
    if(gameState === PLAY) {
        jungle.velocityX = -5;

        if(jungle.x<100) {
            jungle.x = 600;
        }
        if(keyDown("space") && dino.y>380) {
            jumpSound.play();
            dino.velocityY = -16;
        }

        dino.velocityY = dino.velocityY + 0.9;
        spawnCoins();
        spawnObstacles();

        dino.collide(invisibleGround);

        if(obstaclesGroup.isTouching(dino)) {
            gameState = 0;
        }

        if(coinsGroup.isTouching(dino)) {
             score = score + 1;
             eatingSound.play();
             coinsGroup.destroyEach();
        }
    }
    else if(gameState === END) {
        dino.velocityY = 0;
        dino.velocityX = 0;
        jungle.velocityX = 0;
        obstaclesGroup.setVelocityXEach(0);
        coinsGroup.setVelocityEach(0);

        dino.changeAnimation("collided", dino_collided);

        obstaclesGroup.setLifetimeEach(-1);
        coinsGroup.setLifetimeEach(-1);

        gameover.visible = true;
        

        if(mousePressedOver(restart)) {
            reset();
        }
    } else if(gameState === WIN) {
        dino.velocityY = 0;
        dino.velocityX = 0;
        jungle.velocityX = 0;
        obstaclesGroup.setVelocityXEach(0);
        coinsGroup.setVelocityEach(0);

        obstaclesGroup.setLifetimeEach(-1);
        coinsGroup.setLifetimeEach(-1);

        gameover.visible=true;

        
    }

    drawSprites();

  textSize(20);
  stroke(3);
  fill("black");
  text("Score: " + score, camera.position.x, 80);

    if(score>=15) {
        dino.visible = false;
        textSize(30);
        stroke(3);
        fill("black");
        text("Congratulations! You won!", 480, 300);
        gameState = WIN;
    }
}

function spawnObstacles() {
    if(frameCount % 160 === 0) {
  
      var obstacle = createSprite(camera.position.x+600,525,40,40);
      obstacle.setCollider("rectangle",0,0,200,200)
      obstacle.addImage(boulder);
      obstacle.velocityX = -(7 + 3*score/100)
      obstacle.scale = 0.25;
               
   
      obstacle.lifetime = 600;
      
      obstaclesGroup.add(obstacle);
      
    }
  }

  function spawnCoins() {
    if(frameCount % 200 === 0) {

        var gold = createSprite(camera.position.x+580, 550, 50, 15);
        gold.addImage(coin);
        gold.setCollider("circle", 0, 0, 75);
        gold.velocityX = -(7+3*score/100);
        gold.scale = 0.7;
        
        
        gold.lifetime = 600;

        coinsGroup.add(gold);
        

    }
  }

