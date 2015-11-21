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