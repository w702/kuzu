var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;

var dx = 2;
var dy = -2;

var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 75;
//台の初期位置を真ん中にするための変数
var paddleX = (canvas.width - paddleWidth) / 2

var rightPressed = false;
var leftPressed = false;

var score = 0;
//レンガの定義
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];

for(var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }
}
//レンガとボールの衝突判定
function collisionDetection() {
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];

            if(b.status == 1) {
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    //ボールの反射
                    dy = -dy;
                    //レンガを消す
                    b.status = 0;
                    //スコアを1加算する
                    score++;

                    if(score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("Score:" + score, 8, 20);
}
//ボールの描写
function drawBall () {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

//ブロックの描写
function drawBricks() {
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {

            if(bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//ボールを打ち返す台
function drawPaddle () {
    ctx.beginPath();
    ctx.rect( paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

//ボールの衝突判定、反射、残像が残らないようにする
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();


    if(y + dy < ballRadius) {
        dy=-dy;
    }
    //ボールが下についた時の判定
    else if(y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            if(y = y - paddleHeight) {
                dy = -dy;
            }
        }
        else {
            alert("GAME OVER");
            document.location.reload();
        }
    }
    if(x + dx < ballRadius | x + dx > canvas.width  - ballRadius){
        dx=-dx;
    }

    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX +=  7;
    }

    else if(leftPressed && paddleX > 0) {
        paddleX -=  7;
    }

    x += dx;
    y += dy;

}

//キーボードに入力があった時にイベントを発生させる
document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)

//台を左右キーで左右に動かす(true)
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;

    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
        
    }
}

//台が左右の端に位置しているときの関数,画面よりも左右に出ていかないようにしている(false)
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
//一定時間ごとに特定の処理を繰り返す。台とボールの残像が消える関数を10単位で実行している
setInterval(draw, 10);
