class Projectile extends Entity {
  /**
   * Constructor for a bullet entity
   * @param {number} x - The starting x position
   * @param {number} y - The starting y position
   * @param {number} angle - The angle of the firing direction
   * @param {number} power - The force with which to fire the
   *                         projectile. higher is further
   */
  constructor(x, y, angle, power) {
    super(x, y, 8, 8);
    this.vel.x = Math.cos(angle) * power;
    this.vel.y = -Math.sin(angle) * power;
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
        if (Math.abs(xSoFar * slope) >= Math.abs(ySoFar)) {
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
        if (Math.abs(ySoFar * slope) >= Math.abs(xSoFar)) {
          // Move up 1
          xSoFar += Math.sign(displacement.x);
          this.x += Math.sign(displacement.x);
        }
      }
    }
  }
}
