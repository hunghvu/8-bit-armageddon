class Entity extends Rectangle {
  constructor(x, y, w, h) {
    //Used as hitbox
    //can change x and y but not w and d
    super(x, y, w, h);

    // The players are locked to a single pixel with no decimal part
    // so when the player moves 1.3pixels the sub pixel position is 
    // incremented by 0.3 pixel and the player is moved a single pixel.
    // this subPixel can then be later added to further movement
    this.subPixelPosition = new Point(0, 0);

    this.vel = new Point(0, 0);
    this.acc = new Point(0, 0);

    // Default gravity acceleration
    this.acc.y = 500;

    this.onGround = false;
  }

  draw(ctx) {
    // Used as hitbox
    ctx.linewidth = "1";
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.x, this.y, this.w + 15, this.h + 15);
  }

  setAcceleration(newAcc) {
    this.acc = newAcc;
  }

  setVelocity(newVel) {
    this.vel = newVel;
  }

  updateOnGround(map) {
    // If the entity is moved down 1px and it collides with something
    // that means the entity is on the ground.
    this.y += 1;
    if (map.collideWithRectangle(this)) {
      this.onGround = true;
    } else {
      this.onGround = false;
    }
    this.y -= 1;
  }

  update(world, deltaT) {
  }

  // return the desired displacement
  desiredMovement(deltaT) {
    // Update the acceleration
    this.vel.x += this.acc.x * deltaT;
    this.vel.y += this.acc.y * deltaT;

    let xWholePixels = Math.round(this.vel.x * deltaT + this.subPixelPosition.x);
    let yWholePixels = Math.round(this.vel.y * deltaT + this.subPixelPosition.y);

    let xSubPixels = -xWholePixels + (this.vel.x * deltaT + this.subPixelPosition.x);
    let ySubPixels = -yWholePixels + (this.vel.y * deltaT + this.subPixelPosition.y);

    this.subPixelPosition.x = xSubPixels;
    this.subPixelPosition.y = ySubPixels;

    return new Point(xWholePixels, yWholePixels);
  }
}
