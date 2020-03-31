var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var paddleHeight = 5;
var paddleWidth = 25;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var spacePressed = false;

var missles = [];
var missleHeight = 15;
var missleWidth = 5;

var invaders = [];
var invaderRowCount = 5;
var invaderColumnCount = 5;
var invaderWidth = 20;
var invaderHeight = 5;
var invaderPadding = 5;
var invaderOffsetTop = 5;
var invaderOffsetLeft = 30;
var invaderMovementDirection = -1;
var invaderMovementSpeed = .02;

for(let c=0; c<invaderColumnCount; c++) {
    invaders[c] = [];
    for(let r=0; r<invaderRowCount; r++) {
        invaders[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function detectMisslesHit(){
    for(let m=0; m<missles.length; m++) {
      detectMissleHit(m);
    }
}

function detectMissleHit(m){
    for(let c=0; c<invaderColumnCount; c++) {
        for(let r=0; r<invaderRowCount; r++) {
          let invader = invaders[c][r];
          if(invader.status === 1 && missles[m]) {
            if( 
                missles[m].x > invader.x && 
                missles[m].x < invader.x+invaderWidth &&
                missles[m].y > invader.y &&
                missles[m].y < invader.y+invaderHeight
            ) {
              invader.status = 0;
              missles.splice(m, 1);
            }
          }
        }
    }   
}

function drawInvaders() {
    for(let c=0; c<invaderColumnCount; c++) {
        for(let r=0; r<invaderRowCount; r++) {
            if(invaders[0][0].x <= 0){
                    invaderMovementDirection = 1;
            } else if (invaders[invaderColumnCount-1][0].x + invaderWidth >= canvas.width) {
                    invaderMovementDirection = -1;
            }
            invaderOffsetLeft += invaderMovementSpeed * invaderMovementDirection;
            invaders[c][r].x = (c*(invaderWidth+invaderPadding))+invaderOffsetLeft;
            invaders[c][r].y = (r*(invaderHeight+invaderPadding))+invaderOffsetTop;
            if (invaders[c][r].status === 1){
                ctx.beginPath();
                ctx.rect(invaders[c][r].x, invaders[c][r].y, invaderWidth, invaderHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }  
        }
    }
}

function drawPaddle() {
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}


function drawMissles() {
    for(var i = 0; i<missles.length; i++){
        if (missles[i].y < 0) {
            missles.splice(i, 1);
        } else {
            missles[i].y -= 1;
            drawMissle(missles[i].x, missles[i].y);
        }
    }
}

function drawMissle(x, y){
    ctx.beginPath();
    ctx.rect(x, y, missleWidth, missleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function keyDownHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    } 
    else if(e.key === " ") {
        missles.push({x: paddleX + paddleWidth/2, y:canvas.height-(missleHeight+paddleHeight)} );
    }  
}

function keyUpHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawMissles();
    drawInvaders();
    detectMisslesHit();
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);