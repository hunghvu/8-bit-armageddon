/**
* A portal weapon. When shot, creates one portal (portal2) where it hits land
* and creates a second portal (portal1) on top of the player. If portal doesn't
* hit any ground, no portal is created and the weapon is used once/gone.
*/
class PortalGun extends Projectile {
  /**
  * Constructor for a Portal entity
  * @param {number} x - The starting x position
  * @param {number} y - The starting y position
  * @param {number} angle - The angle of the firing direction
  * @param {number} power - The force with which to fire the
  *                         projectile. higher is further
  */
  constructor(x,y,angle,power) {
    super(x, y, angle, power);

    // this.spritesheet = MANAGER.getAsset('./assets/weapons.png');
    // this.animationsOrangePortal = new Animator(this.spritesheet, 0, 96, 32, 32, 4, 0.5, 0, false, false);
    // this.animationsBluePortal = new Animator(this.spritesheet, 0, 96, 32, 32, 4, 0.5, 0, false, false)

    this.team;

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
    this.moveUntilCollision(world, this.desiredMovement(deltaT, Wind.x, Wind.y));

    //sets this.team, needed for drawing
    this.team = world.currentPlayer.team;

    // update direction/facing
    if (this.vel.x < 0) this.facing = 1;
    if (this.vel.x > 0) this.facing = 0;

    if (world.map.collideWithRectangle(this)) {
      //get rid of bullet
      this.active = false;
      //Keeps track if a portal was found inside world.entities[]
      var isPortalCreate = 0;
      for(var i = 0; i < world.entities.length; i++)
      {
        if (world.entities[i] instanceof Portal &&
          this.team == 0 &&
          world.entities[i].design == 0) {
            // replace team 0 old portal with new portal
            world.entities[i] = new Portal(this.x, this.y, 0, 0);
            world.entities[i+1] = new Portal(world.currentPlayer.x, world.currentPlayer.y, 1, 0);
            isPortalCreate = 1;
            break;
        }
        else if (world.entities[i] instanceof Portal &&
          this.team == 1 &&
          world.entities[i].design == 1) {
            world.entities[i] = new Portal(this.x, this.y, 0, 1);
            world.entities[i+1] = new Portal(world.currentPlayer.x, world.currentPlayer.y, 1, 1);
            isPortalCreate = 1;
            break;
        }
      }
      //If no portal is on the ctx/playfield
      if (isPortalCreate == 0)
      {
        //if human team
        if(this.team == 0)
        {
          //create a set of human portals
          world.spawn(new Portal(this.x, this.y, 0, 0));
          world.spawn(new Portal(world.currentPlayer.x, world.currentPlayer.y, 1, 0));
        }
        //else food team
        else {
          //create a set of food portals
          world.spawn(new Portal(this.x, this.y, 0, 1));
          world.spawn(new Portal(world.currentPlayer.x, world.currentPlayer.y, 1, 1));
        }
      }
    }
  }

  /**
   * Draw the bullet of portal
   *
   * @param {CanvasRenderingContext2D} ctx - The context to draw to
   */
  draw(ctx){
    if (this.team) {
      ctx.fillStyle = "purple";
      ctx.beginPath();
      ctx.fillRect(this.x, this.y, 10, 10);
    }
    else {
      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.fillRect(this.x, this.y, 10, 10);
    }
  }

  drawMinimap(ctx, mmX, mmY) {
    //let miniBulletRect = new Rectangle(mmX + this.x / 7, mmY+ this.y / 10, 8, 8);
    //destructionRect.center = this.center;
    //world.map.destroyRectangle(destructionRect);
    ctx.fillStyle = "Green";

    ctx.fillRect(mmX + this.x / 7, mmY + this.y / 10, 8, 8);
    // if ((mmX+this.x/7) > world.map.width/7 || (mmX+this.x/7) < 0) {
    //     ctx.clearRect(mmX + this.x / 7, mmY + this.y / 10, 8, 8);
    // }
  }
}
