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