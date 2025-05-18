const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

const playerSquare = { x: 0, y: 100, w: 50, h: 50 };
let playerMovingUp = false;
let playerMovingDown = false;
let playerMovingRight = false;
let playerMovingLeft = false;
let playerSquareSpeed = 12;

let enemyGenerationTimePassed = 0;
let enemyGenerationTimeMS = 500;
let enemySquaresSpeed = 6;

class enemySquare {
    constructor(x, y, w, h, speed) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

const enemySquaresList = [];

window.addEventListener("keydown", (e) => {
    if (e.key === "w" || e.key === "ArrowUp") {
        playerMovingUp = true;
    }
    if (e.key === "s" || e.key === "ArrowDown") {
        playerMovingDown = true;
    }
    // if (e.key === "a") {
    //     playerMovingLeft = true;
    // }
    // if (e.key === "d") {
    //     playerMovingRight = true;
    // }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "w" || e.key === "ArrowUp") {
        playerMovingUp = false;
    }
    if (e.key === "s" || e.key === "ArrowDown") {
        playerMovingDown = false;
    }
    if (e.key === "a") {
        playerMovingLeft = false;
    }
    if (e.key === "d") {
        playerMovingRight = false;
    }
    if (e.key === "r") {
        if (gameOver) {
            window.location.reload();
        }
    }
});

setInterval(() => {
    if (!gameOver) {
        enemyGenerationTimePassed += 16;

        if (playerMovingUp) {
            if (playerSquare.y - playerSquareSpeed < 0) {
                playerSquare.y = 0;
            } else {
                playerSquare.y -= playerSquareSpeed;
            }
        }
        if (playerMovingDown) {
            if (playerSquare.y + playerSquare.h + playerSquareSpeed > canvas.height) {
                playerSquare.y = canvas.height - playerSquare.h;
            } else {
                playerSquare.y += playerSquareSpeed;
            }
        }
        if (playerMovingLeft) {
            if (playerSquare.x - playerSquareSpeed < 0) {
                playerSquare.x = 0;
            } else {
                playerSquare.x -= playerSquareSpeed;
            }
        }
        if (playerMovingRight) {
            if (playerSquare.x + playerSquare.w + playerSquareSpeed > canvas.width) {
                playerSquare.x = canvas.width - playerSquare.w;
            } else {
                playerSquare.x += playerSquareSpeed;
            }
        }

        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // render playerSquare
        renderPlayerSquare("red");

        // render score
        renderScore();

        renderHighScore();

        // render enemies
        if (enemySquaresList.length > 0) {
            for (let i = 0; i < enemySquaresList.length; i++) {
                if (enemySquaresList[i].x + enemySquaresList[i].w < 0) {
                    enemySquaresList.splice(i, i + 1);

                    if (enemyGenerationTimeMS > 150) {
                        enemyGenerationTimeMS -= 1.25;
                    }
                    if (enemySquaresSpeed < 40) {
                        enemySquaresSpeed += 0.1;
                    }
                    if (playerSquareSpeed < 40) {
                        playerSquareSpeed += 0.1;
                    }
                    score++;

                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem("highScore", highScore);
                    }




                    console.log("s: " + score);
                    console.log("timegen: " + enemyGenerationTimeMS);
                    console.log("e speed: " + enemySquaresSpeed);
                    console.log("p speed: " + playerSquareSpeed);
                } else if (
                    playerSquare.x < enemySquaresList[i].x + enemySquaresList[i].w &&
                    playerSquare.x + playerSquare.w > enemySquaresList[i].x &&
                    playerSquare.y < enemySquaresList[i].y + enemySquaresList[i].h &&
                    playerSquare.y + playerSquare.h > enemySquaresList[i].y
                ) {
                    gameOver = true;
                } else {
                    renderEnemySquare(
                        enemySquaresList[i].x,
                        enemySquaresList[i].y,
                        enemySquaresList[i].w,
                        enemySquaresList[i].h,
                        "lime"
                    )

                    // move enemy square forward to player
                    enemySquaresList[i].x -= enemySquaresSpeed;
                }
            }
        }

        if (enemyGenerationTimePassed > enemyGenerationTimeMS) {
            enemySquaresList.push(new enemySquare(canvas.width - 50, Math.floor(Math.random() * canvas.height), 50, 50));
            enemyGenerationTimePassed = 0;
        }
    }
}, 16);

function renderPlayerSquare(color) {
    ctx.fillStyle = color;
    ctx.fillRect(
        playerSquare.x,
        playerSquare.y,
        playerSquare.w,
        playerSquare.h
    );
}

function renderEnemySquare(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function renderScore() {
    ctx.font = "46px Arial";

    ctx.fillStyle = "white";

    ctx.fillText(score, 30, 70);
}

function renderHighScore() {
    ctx.font = "32px Arial";

    ctx.fillStyle = "white";

    ctx.fillText("high score: " + highScore, 30, 100);
}