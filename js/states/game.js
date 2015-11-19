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
      self.player.incraseSpeed();

      game.physics.arcade.collide(self.player, self.obstacles, function() {
        self.stop = true;

        self.player.hit();
        self.obstacles.stop();

        // self.debugProperties();
        self.state.start('Game', true, false, self.config);
      });
    } else {
      self.timer.update(game.time.time);
    }
  },

  shutdown: function() {

    game.input.onDown.removeAll();
    game.time.events.remove(self.timer);

    this.player.destroy();
    this.obstacles.destroy();
    this.stop = true;

  },

  debugProperties: function() {

    var self = this;

    console.log(self.obstacles.secondSpawnChance);
    console.log(self.obstacles.obstacleSpeed);
    console.log(self.obstacles.obstacleDelay);
    console.log(self.player.moveDuration);

  }

};