class Entity {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.width = 80;
        this.height = 80;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY);
    }
}

class Enemy extends Entity {
    constructor(posX, posY, speed, sprite) {
        super(posX, posY);
        this.speed = speed;
        this.sprite = sprite;
    }

    update(dt) {
        this.posX = this.posX + (this.speed * dt);

        if (Enemy.checkCollisions(player)) {
            //player lose, and we return them to the inicio
            player.returnToStart();
            player.updateLives();
        }

        if (this.posX > 550) {
            //get enemy to the start
            this.posX = Enemy.randomX();
            this.posY = Enemy.randomY();
            createEnemy(this);
        }
    }

    static randomX() {
        //return Math.random() * (-500);
        const x = 101 * Math.floor(Math.random() * 5);
        return -x;
    }

    static randomY() {
        return 125 + (83 * Math.floor(Math.random() * 3));
    }

    static checkCollisions(target) {
        let isCollision = false;
        let index = allEnemies.indexOf(target);
        
        allEnemies.forEach(function (enemy) {
            if (index == -1 && enemy.posX < target.posX + target.width &&
                enemy.posX + enemy.width > target.posX &&
                enemy.posY < target.posY + target.height &&
                enemy.height + enemy.posY > target.posY) {
                isCollision = true;
            }
        });
        return isCollision;
    }
    static incrementDifficulty5() {
        for (let i = 0; i < 2; i++) {
            createEnemy(new Enemy(Enemy.randomX(), Enemy.randomY(), 200, 'images/ant.png'));
        }
    }

    static incrementDifficulty8() {
        createEnemy(new Enemy(Enemy.randomX(), Enemy.randomY(), 300, 'images/bee.png'));
    }
}

class Player extends Entity {
    constructor() {
        super(202, 375);
        this.sprite = "images/char-boy.png";
        this.changeX = 0;
        this.changeY = 0;
        this.score = 0;
        this.lives = 3;
    }

    update() {
        this.posX += this.changeX;
        this.posY += this.changeY;
        this.changeX = 0;
        this.changeY = 0;

        //check if player reach the water of want to go out of bounds
        if(this.posY < 80) {
            //Player reach the water and score, go to initial position
            this.returnToStart();
            this.updateScore();
        } else if (this.posY > 500) {
            this.posY -= 80;
        } else if (this.posX < 0) {
            this.posX += 100;
        } else if (this.posX > 500) {
            this.posX -= 100;
        }
    }

    returnToStart() {
        this.posX = 202;
        this.posY = 375;
        console.log("Hola colision");
    }

    handleInput(key) {
        switch(key) {
            case 'left':
                this.changeX = -101;
                break;
            case 'up':
                this.changeY = -83;
                break;
            case 'right':
                this.changeX = 101;
                break;
            case 'down':
                this.changeY = 83;
        }
    }

    updateScore() {
        this.score++;
        UI.scoreData.textContent = this.score;
        if(this.score === 5) {
            Enemy.incrementDifficulty5();
            star.show();
        } else if(this.score === 8) {
            Enemy.incrementDifficulty8();
        } else if (this.score === 10) {
            //Won game!!!
            UI.winScreen.style.display = 'flex';
        }
    }

    updateLives() {
        console.log(this.lives);
        this.lives--;
        if (this.lives === 2) {
            UI.stars.lastElementChild.style.color = '#ddddd9';
            console.log(UI.thirdStar);
        } else if (this.lives === 1) {
            
            UI.stars.firstElementChild.nextElementSibling.style.color = '#ddddd9';
            console.log(UI.secondStarColor);
        } else if (this.lives === 0) {
            UI.stars.firstElementChild.style.color = '#ddddd9';
            //lost game!!
            UI.loseScreen.style.display = 'flex';
        }
    }

    restoreLivesAndScore(restore) {
        if(restore === 3) {
            UI.scoreData.textContent = this.score;
            UI.stars.firstElementChild.style.color = '#aeb529';
            UI.stars.firstElementChild.nextElementSibling.style.color = '#aeb529';
            UI.stars.lastElementChild.style.color = '#aeb529';
        } else if (restore === 1) {
            this.lives++;
            if (this.lives === 4) {
                this.lives = 3;
            } else if (this.lives === 3) {
                UI.stars.lastElementChild.style.color = '#aeb529';
            } else if (this.lives === 2) {
                UI.stars.firstElementChild.nextElementSibling.style.color = '#aeb529';
            }
        }

    }
}

class Star extends Entity {
    constructor() {
        super(-999, -999);
        this.sprite = "images/Star.png";
    }

    update() {
        if (this.checkCollisionWithPlayer()) {
            this.hide();

            player.restoreLivesAndScore(1);
        }
    }

    show() {
        this.posX = - Enemy.randomX();
        this.posY = Enemy.randomY();
    }

    hide() {
        this.posX = -999;
        this.posY = -999;
    }

    checkCollisionWithPlayer() {
        if (this.posX < player.posX + player.width &&
            this.posX + this.width > player.posX &&
            this.posY < player.posY + player.height &&
            this.height + this.posY > player.posY) {
            return true;
        }
    }
}

const UI = {
    scoreData: document.querySelector('.scoreData'),
    winScreen: document.querySelector('.winScreen'),
    loseScreen: document.querySelector('.loseScreen'),
    stars : document.querySelector('.stars')
}

// // Enemies our player must avoid
// var Enemy = function() {
//     // Variables applied to each of our instances go here,
//     // we've provided one for you to get started

//     // The image/sprite for our enemies, this uses
//     // a helper we've provided to easily load images
//     this.sprite = 'images/enemy-bug.png';
// };

// // Update the enemy's position, required method for game
// // Parameter: dt, a time delta between ticks
// Enemy.prototype.update = function(dt) {
//     // You should multiply any movement by the dt parameter
//     // which will ensure the game runs at the same speed for
//     // all computers.
// };

// // Draw the enemy on the screen, required method for game
// Enemy.prototype.render = function() {
//     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
let player;
let star;

function innit() {
    if (allEnemies.length != 0) {
        allEnemies = [];
        //We let garbage collections to delete past enemies
    }
    if (player) {
        player.posX = 202;
        player.posY = 375;
        player.score = 0;
        player.lives = 3;
        player.restoreLivesAndScore(3);
    } else {
        player = new Player();
    }
    star = new Star();
    for (let i = 0; i < 3; i++) {
        createEnemy(new Enemy(Enemy.randomX(), Enemy.randomY(), 150, 'images/enemy-bug.png'));
    }
}

innit();

function createEnemy(enemy) {

    while(Enemy.checkCollisions(enemy)) {
        enemy.posX = Enemy.randomX();
        enemy.posY = Enemy.randomY();
    }
    if(allEnemies.indexOf(enemy) == -1) {
        allEnemies.push(enemy);
    }
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

document.querySelector('.winButton').addEventListener('click', function() {
    innit();
    UI.winScreen.style.display = 'none';
});

document.querySelector('.loseButton').addEventListener('click', function () {
    innit();
    UI.loseScreen.style.display = 'none';
});


