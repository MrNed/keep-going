var Obstacle = function(game, group, speed) {

  this.speed = speed;
  this.posY = -80;

  var posArr = [0.25, 0.5, 0.75];

  this.posX = posArr[game.rnd.between(0, 2)];

  var obstacle = game.add.bitmapData(40, 40);
  obstacle.ctx.rect(0, 0, 40, 40);
  obstacle.ctx.fillStyle = "#EB586F";
  obstacle.ctx.fill();

  Phaser.Sprite.call(this, game, game.world.width * this.posX, this.posY, obstacle);
  game.physics.arcade.enable(this);

  this.anchor.set(0.5)
  this.body.static = true;
  this.body.immovable = true;
  this.body.velocity.y = this.speed;

  group.add(this);

};

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {

  if (this.y - this.body.halfHeight > game.height) {
    this.destroy();
  }

};

Obstacle.prototype.stop = function() {

  this.body.velocity.y = 0;

};
var Player = function(game, posX, posY) {

  this.canMove = true;
  this.pos = posX;

  var player = game.add.bitmapData(20, 20);
  player.ctx.rect(0, 0, 20, 20);
  player.ctx.fillStyle = "#D8E9F0";
  player.ctx.fill();

  Phaser.Sprite.call(this, game, game.world.width * this.pos, posY, player);
  game.physics.arcade.enable(this);

  this.anchor.set(0.5)
  this.body.static = true;
  // this.body.immovable = true;
  this.body.allowRotation = false;
  this.body.moves = false;

  game.world.add(this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.move = function() {

    var moveDirection = game.input.x < game.world.centerX ? 'left' : 'right';

    if (this.canMove) {
      if (moveDirection === 'left' && this.pos !== 0.25) {
        this.pos -= 0.25;
      } else if (moveDirection === 'right' && this.pos !== 0.75) {
        this.pos += 0.25;
      } else {
        return false;
      }

      this.canMove = false;

      this.moveTween = game.add.tween(this).to({x: game.world.width * this.pos}, 200, Phaser.Easing.Linear.None, true);

      this.moveTween.onComplete.add(function() {
        this.canMove = true;
      }, this);
    }

};

Player.prototype.hit = function() {

  if (this.moveTween) {
    this.moveTween.stop();
  }

  this.canMove = false;

};
var BasicGame = {};

BasicGame.Boot = function() {

};

BasicGame.Boot.prototype = {

  init: function() {

    this.input.maxPointers = 1;
    this.stage.disableVisibilityChange = true;

  },

  preload: function() {

    this.load.atlas('preloader', 'res/preloader.png', 'res/preloader.json');

  },

  create: function() {

    this.stage.backgroundColor = '#393E46';

    this.state.start('Preload');

  }

};
BasicGame.Game = function(game) {

  this.player = null;
  this.obstacles = null;
  this.obstacleSpeed = 350;
  this.obstacleDelay = 300;
  this.stop = false;
};

BasicGame.Game.prototype = {

  init: function (config) {

    this.config = config;

    game.renderer.roundPixels = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);

  },

  create: function() {

    var self = this;

    self.player = new Player(game, 0.5, game.world.height - 50);

    self.obstacles = game.add.group();

    game.time.events.loop(self.obstacleDelay, function() {
      new Obstacle(game, self.obstacles, self.obstacleSpeed);
    });

    game.input.onDown.add(self.player.move, self.player);

  },

  update: function() {

    var self = this;

    game.physics.arcade.collide(self.player, self.obstacles, function() {
      game.time.events.stop();

      self.player.hit();
      self.obstacles.forEach(function(obstacle) {
        obstacle.stop();
      });
    });

  },

  shutdown: function() {

    this.player = null;
    this.obstacles = null;

  }

};
BasicGame.Menu = function() {

};

BasicGame.Menu.prototype = {

  init: function(config) {
    if (!config) {
      config = {

      };
    }

    this.config = config;
  },

  create: function() {

    this.startClick();

  },

  update: function() {

  },

  startClick: function() {

    this.state.start('Game', true, false, this.config);

  },

};
BasicGame.Preload = function() {

  this.preloadBar = null;
  this.ready = false;

};

BasicGame.Preload.prototype = {

  preload: function() {

    this.preloadBar = this.add.sprite(game.width * 0.5, game.height * 0.5, 'preloader', 0);
    this.preloadBar.anchor.set(0.5, 0.5);

    var preloaderFrames = [],
        i = 0;

    for (i; i < 33; i++) {
      preloaderFrames[i] = i;
    }

    this.preloadBar.animations.add('loading', preloaderFrames, 60, true);
    this.preloadBar.play('loading');

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

  },

  create: function() {

    this.preloadBar.cropEnabled = false;

  },

  update: function() {

    // if (this.ready) {
      this.state.start('Menu');
    // }

  },

  onLoadComplete: function() {

    this.ready = true;

  }

};
var game = new Phaser.Game(300, 420, Phaser.Canvas, 'game_cont');

game.state.add('Boot', BasicGame.Boot);
game.state.add('Preload', BasicGame.Preload);
game.state.add('Menu', BasicGame.Menu);
game.state.add('Game', BasicGame.Game);

game.state.start('Boot');