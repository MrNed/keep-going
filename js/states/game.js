BasicGame.Game = function(game) {

  this.player = null;
  this.obstacles = null;
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

    self.player = new Player(game, 0.5, game.world.height - 75);
    self.obstacles = new Obstacles(game);

    game.input.onDown.add(self.player.move, self.player);

  },

  update: function() {

    var self = this;

    if (!self.stop) {
      self.obstacles.spawn();
    }

    game.physics.arcade.collide(self.player, self.obstacles, function() {
      self.stop = true;

      self.player.hit();
      self.obstacles.stop();

      self.state.start('Game', true, false, self.config);
    });

  },

  shutdown: function() {

    this.player = null;
    this.obstacles = null;
    this.stop = false;

  }

};