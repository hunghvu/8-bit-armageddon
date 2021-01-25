/** 
 * The base entity that other entities like bullets and players extend from
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
   * @params {deltaT} - The number of ms since the last update
   */
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
