var Obstacle = function(game, type) {

  this.posY = -80;

  var obstacle = game.add.bitmapData(36, 36);
  obstacle.ctx.rect(0, 0, 36, 36);

  if (type === 'point') {
    obstacle.ctx.fillStyle = "#4AA0D5";
    this.obstacleType = 1;
  } else {
    obstacle.ctx.fillStyle = "#EB586F";
    this.obstacleType = 0;
  }

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
var Player = function(game, posX, posY) {

  this.canMove = true;
  this.pos = posX;
  this.moveDuration = 100;

  var player = game.add.bitmapData(18, 18);
  player.ctx.rect(0, 0, 18, 18);
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

      this.moveTween = game.add.tween(this).to({x: game.world.width * this.pos}, this.moveDuration, Phaser.Easing.Linear.None, true);

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

Player.prototype.incraseSpeed = function() {

  if (this.moveDuration > 100) {
    this.moveDuration -= 0.025;
  }

};
var Spawn = function (game) {

  Phaser.Group.call(this, game, game.world, 'Spawn', false, true, Phaser.Physics.ARCADE);

  this.speed = 500;
  this.delay = 375;
  this.chanceForSecond = 0.8;
  this.nextSpawn = 0;

  var i = 0;
  for (i; i < 10; i++) {
    this.add(new Obstacle(game, 'enemy'));
  }

  this.add(new Obstacle(game, 'point'));

  return this;

};

Spawn.prototype = Object.create(Phaser.Group.prototype);
Spawn.prototype.constructor = Spawn;

Spawn.prototype.start = function () {

  this.posArr = [0.25, 0.5, 0.75];

  if (this.game.time.time < this.nextSpawn) {
    return;
  }

  var index = Math.floor(Math.random() * this.posArr.length);
  this.posX = this.posArr[index] * game.world.width;

  this.children.sort(function() { return 0.5 - Math.random() });

  this.getFirstExists(false).spawn(this.posX, this.speed);

  if (Math.random() <= this.chanceForSecond) {
    this.posArr.splice(index, 1);

    this.getFirstExists(false).spawn(this.posArr[Math.floor(Math.random() * this.posArr.length)] * game.world.width, this.speed);
  }

  this.nextSpawn = this.game.time.time + this.delay;

};

Spawn.prototype.stop = function() {

  this.forEach(function(obstacle) {
    obstacle.stop();
  });

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
    this.fontLoad = game.add.text(game.world.centerX, game.world.centerY, " a ", {
        font: "200px",
        fill: "#fff",
    });
    this.fontLoad.visible = false;
    this.fontLoad.font = 'exo';

    this.state.start('Preload');

  }

};
BasicGame.Game = function(game) {

  this.player = null;
  this.spawn = null;
  this.stop = true;
  this.timer = null;
  this.spawnDelay = 1000;
  this.points = 0;

};

BasicGame.Game.prototype = {

  init: function (config) {

    this.config = config;

    game.renderer.roundPixels = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);

  },

  create: function() {

    var self = this;

    self.score = game.add.text(game.world.width - 25, 25, 0 + " ", {
        font: "24px",
        fill: "#D8E9F0",
    });

    self.score.font = 'exo';
    self.score.anchor.setTo(0.5);
    // self.score.smoothed = self.smusso;

    self.player = new Player(game, 0.5, game.world.height - 64);
    self.spawn = new Spawn(game);

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
      self.spawn.start();
      self.player.incraseSpeed();

      game.physics.arcade.collide(self.player, self.spawn, function(player, obstacle) {
        if (obstacle.obstacleType == 1) {
          self.getPoint(obstacle);
        } else {
          self.die();
        }
      });
    } else {
      self.timer.update(game.time.time);
    }
  },

  shutdown: function() {

    game.input.onDown.removeAll();
    game.time.events.remove(this.timer);

    this.player = null;
    this.spawn = null;
    this.stop = true;
    this.points = 0;

  },

  die: function() {

    this.stop = true;

    this.player.hit();
    this.spawn.stop();

    // self.debugProperties();
    this.state.start('Game', true, false, this.config);

  },

  getPoint: function(obstacle) {

    obstacle.kill();
    this.points++;
    this.score.text = this.points.toString();

  },

  debugProperties: function() {

    var self = this;

    console.log(self.spawn.secondSpawnChance);
    console.log(self.spawn.spawnpeed);
    console.log(self.spawn.obstacleDelay);
    console.log(self.player.moveDuration);

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
var game = new Phaser.Game(300, 420, Phaser.AUTO, 'game_cont');

game.state.add('Boot', BasicGame.Boot);
game.state.add('Preload', BasicGame.Preload);
game.state.add('Menu', BasicGame.Menu);
game.state.add('Game', BasicGame.Game);

game.state.start('Boot');