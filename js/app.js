const X = 120;
const Y =100;

// Class to represent all objects in game
var PlayObject = function (initX, initY) {
    // body...
    this.x = this.gridXToPixels(initX);
    this.y = this.gridYToPixels(initY);
}

// Grid X prototype
PlayObject.prototype.gridXToPixels = function (gridX) {
    // body...
    return X * gridX;
}

// Grid Y prototype
PlayObject.prototype.gridYToPixels = function (gridY) {
    // body...
    return -20 + Y * gridY;
}

// Random Number
PlayObject.prototype.getRandomNumber = function (min, max) {
    // body...
    return Math.floor((Math.random() * max) + min);
}

// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    PlayObject.call(this,x,y);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // movement speed
    this.speed = this.getRandomNumber(50, 300);
};

// Create Object
Enemy.prototype = Object.create(PlayObject.prototype);
Enemy.prototype.constructor = Enemy; 

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed*dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    // move the enemy
    if (this.x > this.gridXToPixels(5)) {
        this.x = this.gridYToPixels(-1);

        // movement speed
        this.speed = this.getRandomNumber(50, 300);
    }
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
var Hero = function (x,y) {
    // body...
    // Variables applied to each of our instances go here,
    PlayObject.call(this,x,y);

    // The image/sprite for our hero/player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
}

// Create Object
Hero.prototype = Object.create(PlayObject.prototype);
Hero.prototype.constructor = Hero;

// Finished Stage
Hero.prototype.finished = function () {
    // body...
    if (this.y == this.gridYToPixels(0)) {
        return true;
    }
    return false;
}

// Crashed with enemies
Hero.prototype.crashed = function () {
    // body...
    for (zombie of zombies) {
        if (this.gridYToPixels(this.y) != this.gridYToPixels(zombie.y)) {
            continue;
        }
        if (Math.abs(this.x - zombie.x) <= X/2) {
            return true;
        }
    }
    return false;
}

// This class requires an update(), render() and
// a handleInput() method.
// Update the hero on the screen
Hero.prototype.update = function () {
    // body...
    if (this.finished() || this.crashed()) {
        this.x = this.gridXToPixels(2);
        this.y = this.gridYToPixels(4);
    }
}

// Draw the hero on the screen
Hero.prototype.render = function () {
    // body...
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Handle Input Method to control hero
Hero.prototype.handleInput = function (position) {
    // body...
    switch(position) {
        case 'left':
            this.x -= X;
            break;
        case 'up':
            this.y -= Y;
            break;
        case 'right':
            this.x += X;
            break;
        case 'down':
            this.y += Y;
            break;
    }
    if (this.x < this.gridXToPixels(0)) this.x = this.gridXToPixels(0);
    else if (this.x > this.gridXToPixels(4)) this.x = this.gridXToPixels(4);
    else if (this.y < this.gridYToPixels(0)) this.y = this.gridYToPixels(0);
    else if (this.y > this.gridYToPixels(5)) this.y = this.gridYToPixels(5);
    else { /* We are inside the grid bounds. Do nothing */ }
}

// Now instantiate your objects.
// Place all enemy/zombies objects in an array called allEnemies
var zombies =[new Enemy(-2,1), new Enemy(-1,2), new Enemy(-1,3), new Enemy(-5,2)]

// Place the player object in a variable called player
var player = new Hero(2,4);

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