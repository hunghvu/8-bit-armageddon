/**
* A portal weapon. When shot, creates one portal (portal2) where it hits land
* and creates a second portal (portal1) on top of the player. If portal doesn't
* hit any ground, no portal is created and the weapon is used once/gone.
*/
class PortalGun extends Entity{
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

    // this.spritesheet = MANAGER.getAsset('./assets/weapons.png');
    // this.animationsOrangePortal = new Animator(this.spritesheet, 0, 96, 32, 32, 4, 0.5, 0, false, false);
    // this.animationsBluePortal = new Animator(this.spritesheet, 0, 96, 32, 32, 4, 0.5, 0, false, false)

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
      // this.animationsOrangePortal.drawFrame(.17,ctx, this.x, this.y, 1.5);
      // this.portalActivate = true;
      world.entities[1] = new Portal(this.x, this.y, 0, 0);
      world.entities[2] = new Portal(world.currentPlayer.x, world.currentPlayer.y, 1, 0);
      // world.spawn(new Portal(this.x, this.y, 0, 0));
      // world.spawn(new Portal(world.currentPlayer.x, world.currentPlayer.y, 1, 0));
    }
  }

  /**
   * Draw the bullet of portal2
   *
   * @param {CanvasRenderingContext2D} ctx - The context to draw to
   */
  draw(ctx){
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.fillRect(this.x, this.y, 10, 10);
  }
}
