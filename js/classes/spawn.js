var Spawn = function (game) {

  Phaser.Group.call(this, game, game.world, 'Spawn', false, true, Phaser.Physics.ARCADE);

  this.speed = 500;
  this.delay = 375;
  this.chanceForSecond = 0.8;
  this.nextSpawn = 0;

  var i = 0;
  for (i; i < 10; i++) {
    this.add(new Obstacle(game, 'enemy'));
  }

  this.add(new Obstacle(game, 'point'));

  return this;

};

Spawn.prototype = Object.create(Phaser.Group.prototype);
Spawn.prototype.constructor = Spawn;

Spawn.prototype.start = function () {

  this.posArr = [0.25, 0.5, 0.75];

  if (this.game.time.time < this.nextSpawn) {
    return;
  }

  var index = Math.floor(Math.random() * this.posArr.length);
  this.posX = this.posArr[index] * game.world.width;

  this.children.sort(function() { return 0.5 - Math.random() });

  this.getFirstExists(false).spawn(this.posX, this.speed);

  if (Math.random() <= this.chanceForSecond) {
    this.posArr.splice(index, 1);

    this.getFirstExists(false).spawn(this.posArr[Math.floor(Math.random() * this.posArr.length)] * game.world.width, this.speed);
  }

  this.nextSpawn = this.game.time.time + this.delay;

};

Spawn.prototype.stop = function() {

  this.forEach(function(obstacle) {
    obstacle.stop();
  });

};