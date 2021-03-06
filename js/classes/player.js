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