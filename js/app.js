
/**
 * Objuect use for accessing easily elements on the UI
 */
const UI = {
    scoreData: document.querySelector('.scoreData'),
    winScreen: document.querySelector('.winScreen'),
    loseScreen: document.querySelector('.loseScreen'),
    stars: document.querySelector('.stars'),
    secondsStar: document.querySelector('.secondsStar')
}

/**
 * Parent Class for Enemies, player and collectibles
 */
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

    /**
     * Update position and state of a given enemy
     * 
     * First, update the position and check for collsions with the player
     * Then check if the enemy is out of bounds and if so, return him to the start with
     * a new random position
     */
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

    /**
     * Get a new random position x inside a cell
     */
    static randomX() {
        //return Math.random() * (-500);
        const x = 101 * Math.floor(Math.random() * 5);
        return -x;
    }

    /**
     * Get a new random position y inside a cell
     */
    static randomY() {
        return 125 + (83 * Math.floor(Math.random() * 3));
    }

    /**
     * Method that checkCollision between a target and all the enemies in the array allEnemies
     */
    static checkCollisions(target) {
        let isCollision = false;
        let index = allEnemies.indexOf(target);
        
        /**
         * Algorithm for collision detection:
         * https://developer.mozilla.org/es/docs/Games/Techniques/2D_collision_detection
         */
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

    /**
     * Add new enemies when required
     */
    static incrementDifficulty5() {
        for (let i = 0; i < 2; i++) {
            createEnemy(new Enemy(Enemy.randomX(), Enemy.randomY(), 200, 'images/ant.png'));
        }
    }

    /**
     * Add new and faster enemy
     */
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

    /**
     * Update position and state of player object
     * First, update position
     * Then if player has tried to moved out of bounds, or it has reached the water,
     * and take the aproppiate measures
     */
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
            this.posY -= 83;
        } else if (this.posX < 0) {
            this.posX += 101;
        } else if (this.posX > 500) {
            this.posX -= 101;
        }
    }

    /**
     * Change sprite of the object with the appropiate one when choosed.
     */
    changeSprite(sprite) {
        switch (sprite) {
            case 'catGirl':
                this.sprite = 'images/char-cat-girl.png';
                break;
            case 'hornGirl':
                this.sprite = 'images/char-horn-girl.png';
                break;
            case 'pinkGirl':
                this.sprite = 'images/char-pink-girl.png';
                break;
            case 'princessGirl':
                this.sprite = 'images/char-princess-girl.png';
                break;
            default:
                this.sprite = 'images/char-boy.png';
                break;
        }
    }

    /**
     * Return player to start when scored or losing a live
     */
    returnToStart() {
        this.posX = 202;
        this.posY = 375;
    }

    /**
     * Handle input from the user key presses
     */
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

    /**
     * Update score of the game and increase difficulty when reached certain levels
     */
    updateScore() {
        this.score++;
        UI.scoreData.textContent = this.score;
        if(this.score === 5) {
            Enemy.incrementDifficulty5();
            star.show();
        } else if(this.score === 8) {
            Enemy.incrementDifficulty8();
            star.show();
        } else if (this.score === 10) {
            //Won game!!!
            UI.winScreen.style.display = 'flex';
        }
    }

    /**
     * Update lives in the UI when the player lose one
     */
    updateLives() {
        this.lives--;
        if (this.lives === 2) {
            UI.stars.lastElementChild.style.color = '#ddddd9';
        } else if (this.lives === 1) {
            
            UI.stars.firstElementChild.nextElementSibling.style.color = '#ddddd9';
        } else if (this.lives === 0) {
            UI.stars.firstElementChild.style.color = '#ddddd9';
            //lost game!!
            UI.loseScreen.style.display = 'flex';
        }
    }

    /**
     * Update lives in the UI when player restore them
     * 
     * There are two functions, restore the three stars when starting a new game and
     * restore one, or do nothing if the player has already 3, when player collect the start in game
     */
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
    /**
     * When initiliaze the star way out of bound and only move it inside the board
     * when we want the user to interact with it
     */
    constructor() {
        super(-999, -999);
        this.sprite = "images/Star.png";
        this.myTimer;
        this.seconds = 5;
    }

    /**
     * Update state of the star and check collision with the player
     */
    update() {
        if (this.checkCollisionWithPlayer()) {
            this.hide();

            player.restoreLivesAndScore(1);
        }
    }

    /**
     * Move the star to the board, star the timer for the countdown and show it
     */
    show() {
        this.posX = - Enemy.randomX();
        this.posY = Enemy.randomY();

        this.seconds = 5;
        UI.secondsStar.innerHTML = '<p>' + star.getFormattedSeconds() + '</p>';
        this.startTimer();

        UI.secondsStar.style.display = 'flex';
    }

    /**
     * Move the star again out of bounds and hide the timer
     */
    hide() {
        this.posX = -999;
        this.posY = -999;

        this.stopTimer();
        UI.secondsStar.style.display = 'none';
    }

    /**
     * Check collision between star and player
     */
    checkCollisionWithPlayer() {
        if (this.posX < player.posX + player.width &&
            this.posX + this.width > player.posX &&
            this.posY < player.posY + player.height &&
            this.height + this.posY > player.posY) {
            return true;
        }
    }

    /**
     * Methods for the timer
     */
    startTimer() {
        this.myTimer = setInterval(timer, 1000);
    }

    stopTimer() {
        window.clearInterval(this.myTimer);
    }

    /**
    * Return a string of two digit seconds
    */
    getFormattedSeconds() {

        return ("0" + this.seconds).slice(-2);
    }

}

/**
    * Function that is call every 1 second and updates the UI and the logic of the star
    */
function timer() {
    star.seconds--;
    UI.secondsStar.innerHTML = '<p>' + star.getFormattedSeconds() +'</p>';

    if (star.seconds === 0) {
        star.hide();
    }
}

/**
 * Inicilize variables and function innit that take care of update the state of the game to start it
 */


let allEnemies = [];
let player;
let star;

function innit() {
    //If allEnemis already exists assign it to an empty array
    if (allEnemies.length != 0) {
        allEnemies = [];
        //We let garbage collections to delete past enemies
    }
    //If palyer already exist update his position and state
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
    //Create 3 enemies to start the game
    for (let i = 0; i < 3; i++) {
        createEnemy(new Enemy(Enemy.randomX(), Enemy.randomY(), 150, 'images/enemy-bug.png'));
    }
}

innit();

/**
 * Helper function to create enemies checking random init positions to try to not initialize them
 * one on top of other
 */
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

/**
 * Listener for the button in the win and lose screens, restart the game
 */
document.querySelector('.winButton').addEventListener('click', function() {
    innit();
    UI.winScreen.style.display = 'none';
});

document.querySelector('.loseButton').addEventListener('click', function () {
    innit();
    UI.loseScreen.style.display = 'none';
});


