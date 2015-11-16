var Obstacles = function (game) {

  Phaser.Group.call(this, game, game.world, 'Obstacles', false, true, Phaser.Physics.ARCADE);

  this.posArr = [0.25, 0.5, 0.75];
  this.obstacleSpeed = 350;
  this.obstacleDelay = 300;

  this.nextSpawn = 0;
/*
  this.minSpawnRate = 1000;
  this.maxSpawnRate = 1800;
  this.minSpeed = 200;
  this.maxSpeed = 400;

  this.spawnSpeed = 0;
  this.spawnRate = 0;
  this.spawnX = 0;
*/

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

  // RANDOMIZE Obstacles - PROBABLY CAN BE DONE BETTER
  // this.children.sort(function() { return 0.5 - Math.random() });

  // this.spawnSpeed = game.rnd.integerInRange(this.minSpeed, this.maxSpeed);
  // this.spawnRate = game.rnd.integerInRange(this.minSpawnRate, this.maxSpawnRate);


  this.posX = this.posArr[game.rnd.between(0, 2)] * game.world.width;

  this.getFirstExists(false).spawn(this.posX, this.obstacleSpeed);

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