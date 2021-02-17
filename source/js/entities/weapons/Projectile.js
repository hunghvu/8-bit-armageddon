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
    super(x, y, 16, 16);
    this.vel.x = Math.cos(angle) * power;
    this.vel.y = -Math.sin(angle) * power;
    this.x += Math.cos(angle) * 20;
    this.y += -Math.sin(angle) * 20;
  }
  /** 
   * Move the object until the object hits the ground or we displace 
   * as much as we need to without hitting something
   * @params {World} world - The world object to check collisions with
   * @params {Point} displacement - The vector along which to move this entity
   */
  moveUntilCollision(world, displacement, collideWithPlayers = false){
    let hasCollidedWithAPlayer = false;
    if (Math.abs(displacement.x) > Math.abs(displacement.y)) {
      // If the x side is longer that the y side 
      // then move along the x and adjust for the y
      let slope = displacement.y / displacement.x;
      let xSoFar = 0;
      let ySoFar = 0;
   
      // Start sliding along the x axis
      while (Math.abs(displacement.x) >= 1 && 
             !world.map.collideWithRectangle(this) && 
             !hasCollidedWithAPlayer) {
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
        if (collideWithPlayers) {
          // Check if the bullet collides with any of the players
          hasCollidedWithAPlayer = this.collidesWithRects(world.players);
        }
      }
    } else {
      // If the y side is longer that the x side 
      // then move along the y and adjust for the x
      let slope = displacement.x / displacement.y;
      let xSoFar = 0;
      let ySoFar = 0;

      // Start sliding along the y axis
      while (Math.abs(displacement.y) >= 1 && 
             !world.map.collideWithRectangle(this) && 
             !hasCollidedWithAPlayer) {
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
        if (collideWithPlayers) {
          // Check if the bullet collides with any of the players
          hasCollidedWithAPlayer = this.collidesWithRects(world.players);
        }
      }
    }
  }
  /* 
   * Checks if this rectangle collides with any of the given rectangles
   * @param {Rectangle[]} rectangles - the rectangles to check for collision
   * @returns {boolean} Returns true if any of the rectangles collide with this one
   */
  collidesWithRects(rectangles) {
    return rectangles.reduce(
      (currentBoolean, rectangle) => {
        return (currentBoolean || rectangle.doesCollide(this))
      }, false
    );
  }
}
