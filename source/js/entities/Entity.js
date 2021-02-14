/**
 * The base entity that other entities like bullets and players extend from
 * TODO: add a function that can either count turns or time
 */
class Entity extends Rectangle {
  /**
   * Constructs the entity based on the hit box.
   *
   * @param {number} x - The x position
   * @param {number} y - The y position
   * @param {number} w - The width of the hitbox
   * @param {number} h - the height of the hitbox
   */
  constructor(x, y, w, h) {
    //Used as hitbox
    //can change x and y but not w and d
    super(x, y, w, h);

    // This variable keeps track of whether an entity is to be
    // removed or not
    this.active = true;

    // The players are locked to a single pixel with no decimal part
    // so when the player moves 1.3pixels the sub pixel position is
    // incremented by 0.3 pixel and the player is moved a single pixel.
    // this subPixel can then be later added to further movement
    this.subPixelPosition = new Point(0, 0);

    this.vel = new Point(0, 0);
    this.acc = new Point(0, 0);

    // Default gravity acceleration
    this.acc.y = 300;

    this.onGround = false;

    this.projectileCanEndTurn = null; // Declare whether a projectile allows a turn to be ended.
                                      // null for non-projectile, true means yes, and false is otherwise.
  }


  /**
   * Draws the hitbox, meant to be overridden but good for debugging
   *
   * @param {CanvasRenderingContext2D} ctx - The context to draw to
   */
  draw(ctx) {
    // Used as hitbox
    ctx.linewidth = "1";
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
  }

  /**
   * Set the acceleration to a specific set of values.
   * @param {Point} newAcc - The new acceleration
   */
  set acceleration(newAcc) {
    this.acc = newAcc;
  }

  /**
   * Set the velocity to a specific set of values.
   * @param {Point} newVel - The new velocity
   */
  set velocity(newVel) {
    this.vel = newVel;
  }

  /**
   * Boiler plate nothing
   */
  update(world, deltaT) {
  }

  /**
   * Returns a point that represents the new offset that the entity should have.
   *
   * @params {number} deltaT - The number of ms since the last update
   * @params {number} windX - The X accleration from wind
   * @params {number} windY - The Y acceleration from wind
   */
  desiredMovement(deltaT, windX = 0, windY = 0) {
    // Update the acceleration
    this.vel.x += (windX + this.acc.x) * deltaT;
    this.vel.y += (windY + this.acc.y) * deltaT;

    let xWholePixels = Math.round(this.vel.x * deltaT + this.subPixelPosition.x);
    let yWholePixels = Math.round(this.vel.y * deltaT + this.subPixelPosition.y);

    let xSubPixels = -xWholePixels + (this.vel.x * deltaT + this.subPixelPosition.x);
    let ySubPixels = -yWholePixels + (this.vel.y * deltaT + this.subPixelPosition.y);

    this.subPixelPosition.x = xSubPixels;
    this.subPixelPosition.y = ySubPixels;

    return new Point(xWholePixels, yWholePixels);
  }

  /** 
   * Move the object until the object hits the ground or we displace 
   * as much as we need to without hitting something
   * @params {World} world - The world object to check collisions with
   * @params {Point} displacement - The vector along which to move this entity
   */
  moveUntilCollision(world, displacement){
    if (Math.abs(displacement.x) > Math.abs(displacement.y)) {
      // If the x side is longer that the y side 
      // then move along the x and adjust for the y
      let slope = displacement.y / displacement.x;
      let xSoFar = 0;
      let ySoFar = 0;

      // Start sliding along the x axis
      while (Math.abs(displacement.x) >= 1 && !world.map.collideWithRectangle(this)) {
        // reduce the x displacement counter by 1 regardless of sign
        displacement.x -= Math.sign(displacement.x);
        // Keep track of how far x we've moved
        xSoFar += Math.sign(displacement.x);
        // Move the actually player
        this.x += Math.sign(displacement.x);
        // If we've gone far enough in the x direction that we need to move 
        // in the y direction as well then do it
        if (xSoFar * slope > ySoFar) {
          // Move up 1
          ySoFar += Math.sign(displacement.y);
          this.y += Math.sign(displacement.y);
        }
      }
    } else {
      // If the y side is longer that the x side 
      // then move along the y and adjust for the x
      let slope = displacement.x / displacement.y;
      let xSoFar = 0;
      let ySoFar = 0;

      // Start sliding along the y axis
      while (Math.abs(displacement.y) >= 1 && !world.map.collideWithRectangle(this)) {
        // reduce the y displacement counter by 1 regardless of sign
        displacement.y -= Math.sign(displacement.y);
        // Keep track of how far y we've moved
        ySoFar += Math.sign(displacement.y);
        // Move the actually player
        this.y += Math.sign(displacement.y);
        // If we've gone far enough in the y direction that we need to move 
        // in the x direction as well then do it
        if (ySoFar * slope > xSoFar) {
          // Move up 1
          xSoFar += Math.sign(displacement.x);
          this.x += Math.sign(displacement.x);
        }
      }
    }
  }
}
