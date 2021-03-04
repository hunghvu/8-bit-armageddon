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

    this.spritesheet = MANAGER.getAsset('./assets/weapons.png');

    this.team;

    this.vel.x = Math.cos(angle) * power;
    this.vel.y = -Math.sin(angle) * power;

    this.animations = [];
    this.loadAnimations();
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

    //Crate collision
    for(var i = 0; i < world.entities.length; i++) {
      if (world.entities[i] instanceof Crate &&
        ((this.x < (world.entities[i].x + world.entities[i].w)) && (this.x > world.entities[i].x)) &&
        ((this.y > world.entities[i].y) && (this.y < (world.entities[i].y + world.entities[i].h)))) {
          world.currentPlayer.upgraded++;
          world.currentPlayer.opWeaponUnlock++;
          world.entities[i].active = false;
          if (world.currentPlayer.upgraded > 3) {
            world.currentPlayer.upgraded = 1; //reset level
          }
        }
      }

    if (this.y > world.map.height)
    {
      // Destroy this bullet if we hit something
      this.active = false;
    }
    else if (world.map.collideWithRectangle(this)) {
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
    // if (this.team) {
      // ctx.fillStyle = "purple";
      // ctx.beginPath();
      // ctx.fillRect(this.x, this.y, 10, 10);
      this.animations[this.team][this.facing].drawFrame(.17, ctx, this.x, this.y, 0.9);
    // }
    // else {
      // ctx.fillStyle = "orange";
      // ctx.beginPath();
      // ctx.fillRect(this.x, this.y, 10, 10);
      // this.animations[this.facing].drawFrame(.17, ctx, this.x, this.y, 0.9);
    // }
  }

  loadAnimations() {
    for (var j = 0; j < 2; j++) { //facing
      this.animations.push([]);
    }

    //Human = 0 Orange
    //facing right = 0,
    this.animations[0][0] = new Animator(this.spritesheet, 165, 232, 26, 13, 1, 0.5, null, false, true);

    //facing left = 1,
    this.animations[0][1] = new Animator(this.spritesheet, 197, 232, 26, 13, 1, 0.5, null, false, true);

    //Food = 1 Blue
    //facing right = 0,
    this.animations[1][0] = new Animator(this.spritesheet, 101, 232, 26, 13, 1, 0.5, null, false, true);

    //facing left = 1,
    this.animations[1][1] = new Animator(this.spritesheet, 133, 232, 26, 13, 1, 0.5, null, false, true);
  }
}
