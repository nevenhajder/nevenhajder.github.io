/* A single APP object to keep the global namespace
   from becoming cluttered. */
var APP = {};

/* An object to store measurements,
   so we can avoid the Magic Number problem. */
APP.constants = {
  canvasWidth: 505,
  canvasHeight: 606,
  columnWidth: 101,
  rowHeight: 83,
  numEnemies: 8,
  enemyBaseY: 139,
  enemyBaseSpeed: 250,
  enemySpeedFactor: 50,
};

/* Enemy class */
APP.Enemy = function () {
  /* Generate a random starting position and speed */
  this.randX();
  this.randY();
  this.randSpeed();

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = "./images/enemy-bug.png";

  /* Enemy's width and height for collision detection */
  this.width = 90;
  this.height = 60;
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
APP.Enemy.prototype.update = function (dt) {
  /* If the enemy goes off canvas, set new position and speed */
  if (this.x > APP.constants.canvasWidth) {
    /* Position enemy one columnWidth off canvas */
    this.x = -APP.constants.columnWidth;
    this.randY();
    this.randSpeed();
  }

  /* Move the enemy based on dt and its speed */
  this.x += dt * this.speed;
};

/* Choose a random column and position the Enemy */
APP.Enemy.prototype.randX = function () {
  this.x =
    APP.constants.canvasWidth -
    APP.constants.columnWidth * Math.floor(Math.random() * 6);
};

/* Choose a random row and position the Enemy */
APP.Enemy.prototype.randY = function () {
  this.y =
    APP.constants.enemyBaseY +
    APP.constants.rowHeight * Math.floor(Math.random() * 3);
};

/* Choose a random speed and set it on the Enemy */
APP.Enemy.prototype.randSpeed = function () {
  this.speed =
    APP.constants.enemyBaseSpeed -
    Math.floor(APP.constants.enemySpeedFactor * (Math.random() * 3));
};

/* Draw the enemy on the screen */
APP.Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Player Class */
APP.Player = function () {
  /* Set Starting Position */
  this.reset();

  /* Player sprite */
  this.sprite = "./images/char-boy.png";

  /* Player width and height for collision detection */
  this.width = 60;
  this.height = 75;
};

/* Lives */
APP.Player.prototype.lives = 3;

/* Check for win */
APP.Player.prototype.checkWin = function () {
  /* Win Condition */
  if (this.y - APP.constants.rowHeight < 126) {
    /* Alert */
    swal({
      title: "You Win!",
      imageUrl:
        "http://vignette2.wikia.nocookie.net/rift/images/7/7f/AWESOME_FACE!!!.png/revision/latest?cb=20110302225528",
      imageSize: "100x100",
      confirmButtonText: "Huzzah",
    });
    /* Reset player position and lives */
    this.reset();
    this.lives = 3;
    return true;
  }
  return false;
};

/* Check if any enemies are colliding with the player */
APP.Player.prototype.checkCollisions = function (enemies) {
  /* Store the keyword 'this' in a variable
       so it can be used within the forEach method */
  var self = this;

  enemies.forEach(function (en) {
    if (
      self.x < en.x + en.width &&
      self.x + self.width > en.x &&
      self.y < en.y + en.height &&
      self.y + self.height > en.y
    ) {
      self.reset();
      self.lives--;
      self.checkAlive();
    }
  });
};

/* Check if the player is still alive */
APP.Player.prototype.checkAlive = function () {
  if (this.lives === 0) {
    /* Game Over message */
    swal({
      title: "Game Over!",
      imageUrl:
        "http://vignette2.wikia.nocookie.net/fantendo/images/b/b2/Sad_Face.png/revision/latest?cb=20131020025647",
      imageSize: "100x100",
      confirmButtonText: "I'll get 'em next time",
    });
    this.lives = 3;
  }
};

/* Update the player's position */
APP.Player.prototype.update = function (x, y) {
  this.x += x || 0;
  this.y += y || 0;
};

/* Draw the player and lives on to the context */
APP.Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

  /* Lives */
  ctx.fillStyle = "#FF2400";
  ctx.font = "30px Comic Sans";
  for (var i = 0; i < this.lives; i++) {
    ctx.fillText(String.fromCharCode(9829), 10 + 25 * i, 578);
  }
};

/* Reset the player's position */
APP.Player.prototype.reset = function () {
  this.x = 218;
  this.y = 458;
};

/* Respond to user input */
APP.Player.prototype.handleInput = function (direction) {
  switch (direction) {
    case "left":
      if (this.x > 45) {
        this.update(-101, 0);
      }
      break;
    case "up":
      if (!this.checkWin()) {
        this.update(0, -83);
      }
      break;
    case "right":
      if (this.x < 404) {
        this.update(101, 0);
      }
      break;
    case "down":
      if (this.y < 391) {
        this.update(0, 83);
      }
      break;
    default:
      break;
  }
};

/* Instantiate the player and enemies array */
APP.player = new APP.Player();
APP.allEnemies = [];

/* Generate enemies and store them in allEnemies */
for (var i = 0; i < APP.constants.numEnemies; i++) {
  APP.allEnemies[i] = new APP.Enemy();
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function (e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  };

  APP.player.handleInput(allowedKeys[e.keyCode]);
});
