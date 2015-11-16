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