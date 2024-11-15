const canvas = document.querySelector('canvas');
const player1score = document.querySelector('#player1score')
const player2score = document.querySelector('#player2score')
const c = canvas.getContext('2d');
canvas.width = 1425;
canvas.height = 625;

const gravity = 0.7;

const backgroundmusic = new Audio('Travis Scott Ft. Playboi Carti – FE!N_(Naijaflavour.com) (1).mp3')
const hiteffect = new Audio('sword.mp3')
const startgame = new Audio('start.mp3')
const hit = new Audio('punch-6-166699.mp3')

// Load the background image
const background = new Image();
background.src = 'background.png'; // Replace with your image path

class Fighter {
    constructor({ position, velocity, color = 'red', width, height, offset }) {
        this.position = position;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
        this.lastKey = null;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset,
            width: 100,
            height: 50,
        };
        this.color = color;
        this.isAttacking = false;
        this.health = 100;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Attack box
        if (this.isAttacking) {
            c.fillStyle = 'green';
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
    
        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    
        // Horizontal boundaries (left and right)
        if (this.position.x <= 0) {
            this.position.x = 0;
        }
        if (this.position.x + this.width >= canvas.width) {
            this.position.x = canvas.width - this.width;
        }
    
        // Vertical boundaries (top and bottom)
        if (this.position.y <= 0) {
            this.position.y = 0; // Prevent going above the top
        }
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0; // Stop when reaching the ground
        } else {
            this.velocity.y += gravity; // Apply gravity if not on the ground
        }
    }
    

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

let isGameOver = false
let score1 = 0
let score2 = 0

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
      document.querySelector('#displayText').innerHTML = 'Tie'
    } else if(timer>=50 && enemy.health===0){
        document.querySelector('#displayText').innerHTML = 'brutal kill ,player 1 won'
    } else if(timer>=50 && player.health===0){
        document.querySelector('#displayText').innerHTML = 'brutal kill ,player 2 won'
    } else if (player.health > enemy.health) {
        score1 +=1
        player1score.innerText = score1
      document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    } else if (player.health < enemy.health) {
        score2 +=1
        player2score.innerText = score2
      document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }
    backgroundmusic.pause()

    isGameOver = true
  }

let timer = 1001;
let timerId;
function decreaseTimer() {
   
    
    if (timer > 0 && !isGameOver) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerId });
    
}
}

    // Create player and enemy instances
const player = new Fighter({
    position: { x: 100, y: 100 },
    velocity: { x: 0, y: 0 },
    color: 'blue',
    width: 50,
    height: 100,
    offset: { x: 0, y: 0 },
});

const enemy = new Fighter({
    position: { x: 1300, y: 100 },
    velocity: { x: 0, y: 0 },
    color: 'red',
    width: 50,
    height: 100,
    offset: { x: -50, y: 0 },
});
 


const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowLeft: { pressed: false },

};

function checkCollision(Ball, player) {
    // Circle properties (ball)
    let cx = Ball.position.x;
    let cy = Ball.position.y;
    let r = Ball.radius;

    // Rectangle properties (player)
    let rx = player.position.x;
    let ry = player.position.y;
    let w = player.width;
    let h = player.height;

    // Find the closest point on the rectangle to the circle's center
    let closest_x = Math.max(rx, Math.min(cx, rx + w));
    let closest_y = Math.max(ry, Math.min(cy, ry + h));

    // Calculate the distance from the circle's center to the closest point
    let dx = cx - closest_x;
    let dy = cy - closest_y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Check if the distance is less than or equal to the circle's radius
    return distance <= r;
}

function handleBallCollision() {
    if (checkCollision(ball, player)) {
        player.health -= 30; // Decrease player health by 30
        document.querySelector('#playerHealth').style.width = player.health + '%'; // Update health bar
        ball = null; // Remove the ball from the game
    } else if (checkCollision(ball, enemy)) {
        enemy.health -= 30; // Decrease enemy health by 30
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'; // Update health bar
        ball = null; // Remove the ball from the game
    }
}


const restartBtn = document.querySelector('#restartbtn'); // Corrected selector

function resetGame() {

    startgame.play();
    backgroundmusic.pause()
    backgroundmusic.currentTime = 0;

    // Reset player and enemy health
    player.health = 100;
    enemy.health = 100;
    document.querySelector('#playerHealth').style.width = '100%';
    document.querySelector('#enemyHealth').style.width = '100%';

    // Reset positions
    player.position = { x: 100, y: 100 };
    enemy.position = { x: 1300, y: 100 };

    // Reset velocities
    player.velocity = { x: 0, y: 0 };
    enemy.velocity = { x: 0, y: 0 };

    // Reset timer
    timer = 191;
    document.querySelector('#timer').innerHTML = timer;

    // Hide the display text
    document.querySelector('#displayText').style.display = 'none';

    // reseting the game over 
    isGameOver = false;
    animate() 
    decreaseTimer()
}

restartBtn.addEventListener('click', resetGame);

backgroundmusic.volume = 0.2

let numberofhit1 = 0
let numberofhit2 = 0

class Ball {
    constructor({ position, velocity, radius, color }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Bouncing off the walls
        if (this.position.x + this.radius > canvas.width || this.position.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
        }

        if (this.position.y + this.radius > canvas.height || this.position.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        }
    }
}

function getRandomPosition() {
    return {
        x: Math.random() * (canvas.width - 500) + 475,  // Random x position within canvas width (50 is ball's radius * 2)
        y: Math.random() * (canvas.height - 500) + 475  // Random y position within canvas height
    };
}

let ball;

    ball = new Ball({
        position:  getRandomPosition(),
        velocity: { x: 3, y: 3 },
        radius: 25,
        color: 'yellow'
    })

function animate() {
    if (isGameOver) return;
    window.requestAnimationFrame(animate);

    backgroundmusic.play();
    c.drawImage(background, 0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();
    
    if (timer <= 30 && ball) {
        ball.update();
        handleBallCollision(); // Check if the ball touches the player or enemy
    }


    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
    }

    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
    }

    // Detect collision & enemy gets hit
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
        hit.play();
        numberofhit1 += 1;
        enemy.health -= 5;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        player.isAttacking = false;
    }

    // Player gets hit
    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
        hit.play();
        numberofhit2 += 1;
        player.health -= 5;
        document.querySelector('#playerHealth').style.width = player.health + '%';
        enemy.isAttacking = false;
    }

    // End game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

window.addEventListener('keydown', (event) => {
    if(isGameOver) return
    switch (event.key) {
        // Player 1 movement
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            player.velocity.y = -20;
            break;
        case 'v':
            hiteffect.play()
            player.attack();
            break;

        // Player 2 movement
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20;
            break;
        case 'ArrowDown':
            hiteffect.play();
            enemy.attack();
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
});
// Completed //