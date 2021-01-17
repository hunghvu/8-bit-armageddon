class Entity extends Rectangle {
  constructor(spriteSheet, x, y) {
    super(x - 3, y, 6, 48);

    this.vel = new Point(0, 0);
    this.acc = new Point(0, 0);

    this.onGround = false;
  }

  drawEntity(ctx)
  {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  setAcceleration(newAcc) {
    this.acc = newAcc;
  }

  setVelocity(newVel) {
    this.vel = newVel;
  }

  // return the desired displacement
  desiredMovement(deltaT) {
    // Update the acceleration
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;

    return new Point(this.vel.x, this.vel.y);
  }
}
