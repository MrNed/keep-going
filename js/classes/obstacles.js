var Obstacles = function (game) {

  Phaser.Group.call(this, game, game.world, 'Obstacles', false, true, Phaser.Physics.ARCADE);

  this.obstacleSpeed = 450;
  this.obstacleDelay = 500;
  this.secondSpawnChance = 0.1;

  this.nextSpawn = 0;

  var i = 0;
  for (i; i < 10; i++) {
    this.add(new Obstacle(game));
  }

  return this;

};

Obstacles.prototype = Object.create(Phaser.Group.prototype);
Obstacles.prototype.constructor = Obstacles;

Obstacles.prototype.spawn = function () {

  this.posArr = [0.25, 0.5, 0.75];

  if (this.game.time.time < this.nextSpawn) {
    return;
  }

  var index = Math.floor(Math.random() * this.posArr.length);
  this.posX = this.posArr[index] * game.world.width;

  this.getFirstExists(false).spawn(this.posX, this.obstacleSpeed);

  if (Math.random() <= this.secondSpawnChance) {
    this.posArr.splice(index, 1);

    this.getFirstExists(false).spawn(this.posArr[Math.floor(Math.random() * this.posArr.length)] * game.world.width, this.obstacleSpeed);
  }

  this.nextSpawn = this.game.time.time + this.obstacleDelay;

  if (this.obstacleSpeed <= 580) {
    this.obstacleSpeed += 2;
  }

  if (this.obstacleDelay >= 300) {
    this.obstacleDelay -= 2.5;
  }

  if (this.secondSpawnChance <= 0.5) {
    this.secondSpawnChance += 0.005;
  }

};

Obstacles.prototype.stop = function() {

  this.forEach(function(obstacle) {
    obstacle.stop();
  });

};