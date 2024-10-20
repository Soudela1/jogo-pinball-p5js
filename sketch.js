let balls = [];
let paddle;
let bricks = [];
let power;

function setup() {
  createCanvas(600, 400);
  initializeGame();
}

function draw() {
  background(0);
  for (let ball of balls) {
    ball.update();
    ball.display();
  }
  paddle.update();
  paddle.display();
  drawBricks();
  if (power) {
    power.update();
    power.display();
    if (paddle.collides(power)) {
      power.collect();
    }
  }
  checkCollision();
}

function initializeGame() {
  balls = [];
  balls.push(new Ball(width / 2, height / 2));
  paddle = new Paddle();
  initializeBricks();
  spawnPower();
}

function mouseMoved() {
  paddle.move(mouseX);
}

function checkCollision() {
  for (let i = balls.length - 1; i >= 0; i--) {
    let ball = balls[i];
    if (ball.y > height) {
      balls.splice(i, 1);
    } else {
      if (ball.collides(paddle)) {
        ball.bounceUp();
      }
      for (let j = bricks.length - 1; j >= 0; j--) {
        let brick = bricks[j];
        if (ball.collides(brick)) {
          ball.bounceUp();
          bricks.splice(j, 1);
          break;
        }
      }
    }
  }
}

function drawBricks() {
  for (let brick of bricks) {
    brick.display();
  }
}

function initializeBricks() {
  let rows = 4;
  let cols = 10;
  let brickWidth = width / cols;
  let brickHeight = 20;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = j * brickWidth;
      let y = i * brickHeight;
      let brick = new Brick(x, y);
      bricks.push(brick);
    }
  }
}

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.dx = random(-5, 5);
    this.dy = -5;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x - this.radius <= 0 || this.x + this.radius >= width) {
      this.dx *= -1;
    }
    if (this.y - this.radius <= 0) {
      this.dy *= -1;
    }
  }

  display() {
    fill(255);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }

  collides(obj) {
    let closestX = constrain(this.x, obj.x, obj.x + obj.width);
    let closestY = constrain(this.y, obj.y, obj.y + obj.height);
    let distanceX = this.x - closestX;
    let distanceY = this.y - closestY;
    let distanceSquared = distanceX * distanceX + distanceY * distanceY;
    return distanceSquared < this.radius * this.radius;
  }

  bounceUp() {
    this.dy *= -1;
  }
}

class Paddle {
  constructor() {
    this.width = 100;
    this.height = 10;
    this.x = width / 2 - this.width / 2;
    this.y = height - this.height;
  }

  update() {
    this.x = constrain(this.x, 0, width - this.width);
  }

  display() {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
  }

  move(targetX) {
    this.x = targetX - this.width / 2;
  }

  collides(obj) {
    return (
      this.x < obj.x + obj.width &&
      this.x + this.width > obj.x &&
      this.y < obj.y + obj.height &&
      this.y + this.height > obj.y
    );
  }
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 20;
  }

  display() {
    fill(255, 0, 0);
    rect(this.x, this.y, this.width, this.height);
  }
}

class Power {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.active = true;
  }

  display() {
    if (this.active) {
      fill(255, 255, 0);
      ellipse(this.x, this.y, this.size, this.size);
    }
  }

  update() {
    if (this.y > height) {
      this.active = false;
    }
    this.y += 1;
  }

  collect() {
    if (this.active) {
      // Duplicar a bolinha
      let newBall = new Ball(balls[0].x, balls[0].y);
      newBall.dx = balls[2].x;
      newBall.dy = balls[2].dy;
      balls.push(newBall);
      this.active = false; // Desativar o poder
      spawnPower(); // Spawn de um novo poder
    }
  }
}

function spawnPower() {
  // Spawn de um novo poder em uma posição aleatória
  power = new Power(random(width), random(height / 2));
}