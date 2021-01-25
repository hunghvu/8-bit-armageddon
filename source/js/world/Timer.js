/**
* Copy from Super Marriott World,
* Simple timer to keep track of frames
* for the animations
**/
class Timer
{
  constructor()
  {
  this.gameTime = 0;
  this.maxStep = 0.05;
  this.lastTimestamp = 0;
  };

  tick()
  {
  var current = Date.now();
  var delta = (current - this.lastTimestamp) / 1000;
  this.lastTimestamp = current;

  var gameDelta = Math.min(delta,this.maxStep);
  this.gameTime += gameDelta;
  return gameDelta;
  };
};
