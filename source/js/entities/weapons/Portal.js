/**
* A portal weapon. When shot, creates one portal (portal2) where it hits land
* and creates a second portal (portal1) on top of the player. If portal doesn't
* hit any ground, no portal is created and the weapon is used once/gone.
*/
class Portal extends Entity{
  /**
  * Constructor for a Portal entity
  * @param {number} x - The starting x position
  * @param {number} y - The starting y position
  * @param {number} angle - The angle of the firing direction
  * @param {number} power - The force with which to fire the
  *                         projectile. higher is further
  */
  constructor(x,y,angle,power) {
    super(x,y,8,8);

    this.portal1x = 0;
    this.portal1y = 0;
    this.portal2x = 0;
    this.portal2y = 0;

    this.portalActivate = true;
    // this.portalActivate = false;

    this.vel.x = Math.cos(angle) * power;
    this.vel.y = -Math.sin(angle) * power;
  }

  /**
   * Update the bullet flying through the air.
   *
   * @params {World} - The world object that should be referenced
   * @params {deltaT} - The number of ms since the last update
   */
  update(world, deltaT){
    this.add(this.desiredMovement(deltaT))

    // update direction/facing
    if (this.vel.x < 0) this.facing = 1;
    if (this.vel.x > 0) this.facing = 0;

    if (world.map.collideWithRectangle(this)) {
      this.active = false;
      this.portalActivate = true;
      this.portal2x = this.x;
      this.portal2y = this.y;
      this.portal1x = world.currentPlayer.x;
      this.portal1y = world.currentPlayer.y;
    }
  }

  /**
   * Draw the bullet of portal2
   *
   * @param {CanvasRenderingContext2D} ctx - The context to draw to
   */
  draw(ctx){
    //Test log: on player -> orange then blue when collision then removes
    //collision -> orange then removes
    //bullet -> black removes when collision
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.fillRect(this.x, this.y, 30, 30);

    if (this.portalActivate == true)
    {
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.fillRect(this.portal1x, this.portal1y, 30, 30);
      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.fillRect(this.portal2x, this.portal2y, 30, 30);
    }
  }
}
