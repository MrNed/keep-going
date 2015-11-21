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