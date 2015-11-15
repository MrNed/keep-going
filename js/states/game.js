BasicGame.Game = function(game) {

  this.player = null;
  this.obstacles = null;
  this.obstacleSpeed = 250;
  this.obstacleDelay = 500;
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