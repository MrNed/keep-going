var Obstacle = function(game) {

  this.posY = -80;

  var obstacle = game.add.bitmapData(40, 40);
  obstacle.ctx.rect(0, 0, 40, 40);
  obstacle.ctx.fillStyle = "#EB586F";
  obstacle.ctx.fill();

  Phaser.Sprite.call(this, game, 0, this.posY, obstacle);
  game.physics.arcade.enable(this);

  this.anchor.set(0.5)
  this.body.static = true;
  this.body.immovable = true;

  this.exists = false;

};

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function() {

  if (this.y - this.body.halfHeight > game.height) {
    this.kill();
  }

};

Obstacle.prototype.stop = function() {

  this.body.velocity.y = 0;

};

Obstacle.prototype.spawn = function(posX, speed) {

  this.reset(posX, this.posY);
  this.body.velocity.y = speed;

};
var Obstacles = function (game) {

  Phaser.Group.call(this, game, game.world, 'Obstacles', false, true, Phaser.Physics.ARCADE);

  this.posArr = [0.25, 0.5, 0.75];
  this.obstacleSpeed = 350;
  this.obstacleDelay = 300;

  this.nextSpawn = 0;
  this.minDelay = 200;
  this.maxDelay = 600;

  var i = 0;
  for (i; i < 10; i++) {
    this.add(new Obstacle(game));
  }

  return this;

};

Obstacles.prototype = Object.create(Phaser.Group.prototype);
Obstacles.prototype.constructor = Obstacles;

Obstacles.prototype.spawn = function () {

  if (this.game.time.time < this.nextSpawn) {
    return;
  }

  this.obstacleDelay = game.rnd.integerInRange(this.minDelay, this.maxDelay);
  this.posX = this.posArr[game.rnd.between(0, 2)] * game.world.width;

  this.getFirstExists(false).spawn(this.posX, this.obstacleSpeed);

  this.obstacleSpeed += 1;
  this.maxDelay -= 2;

  this.nextSpawn = this.game.time.time + this.obstacleDelay;

};

Obstacles.prototype.stop = function() {

  this.forEach(function(obstacle) {
    obstacle.stop();
  });

};

Obstacles.prototype.countOnScreen = function() {

  var test = 0;

  this.forEach(function(obstacle) {
    if (obstacle.exists) {
      test++;
    }
  });

  return test;

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
  this.stop = true;
  this.timer = null;
  this.spawnDelay = 1000;

};

BasicGame.Game.prototype = {

  init: function (config) {

    this.config = config;

    game.renderer.roundPixels = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);

  },

  create: function() {

    var self = this;

    self.player = new Player(game, 0.5, game.world.height - 75);
    self.obstacles = new Obstacles(game);

    game.input.onDown.add(self.player.move, self.player);

    self.timer = new Phaser.Timer(game);
    self.timer.add(self.spawnDelay, function() {
      self.stop = false;
    });
    self.timer.start();

  },

  update: function() {

    var self = this;

    if (!self.stop) {
      self.obstacles.spawn();
    } else {
      self.timer.update(game.time.time);
    }

    game.physics.arcade.collide(self.player, self.obstacles, function() {
      self.stop = true;

      self.player.hit();
      self.obstacles.stop();

      self.state.start('Game', true, false, self.config);
    });

  },

  shutdown: function() {

    game.input.onDown.removeAll();
    game.time.events.remove(self.timer);

    this.player.destroy();
    this.obstacles.destroy();
    this.stop = true;

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