/**
 * A Sniper bullet that is spawned when the player shoots
 * Player must be at upgrade level 2 to use
 */
class Sniper extends Projectile {
  /**
   * Constructor for a sniper entity
   * @param {number} x - The starting x position
   * @param {number} y - The starting y position
   * @param {number} angle - The angle of the firing direction
   * @param {number} power - The force with which to fire the
   *                         projectile. higher is further
   */
  constructor(x, y, angle, power) {
    super(x, y, angle, power*2);
    this.spritesheet = MANAGER.getAsset('./assets/weapons.png');

    this.animations = [];
    this.projectileCanEndTurn = false;
    this.loadAnimations();
  }

  /**
   * Update the bullet flying through the air.
   *
   * @params {World} - The world object that should be referenced
   * @params {deltaT} - The number of ms since the last update
   */
   update(world, deltaT){
     this.moveUntilCollision(world, this.desiredMovement(deltaT, Wind.x, Wind.y), true);

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

     // Check if the bullet collides with any of the players
     let hasCollidedWithAPlayer = this.collidesWithRects(world.players);


     // Add y-threshold for the bullet so that i can end turns.
     if (world.map.collideWithRectangle(this) ||
         this.y > world.map.height ||
         hasCollidedWithAPlayer) {
       // Destroy this bullet if we hit something
       this.active = false;
       this.projectileCanEndTurn = true;
       // Destroy the map
       world.map.destroyCircle(this.center.x, this.center.y, 5);
       // Find any players in the blast range
       for (let i = 0; i < world.players.length; i++) {
         let playerThisLoop = world.players[i];

         // If we are close enough then damage the player
         let difference = playerThisLoop.center
         difference.sub(this.center);
         if (difference.magnitude < 32) {
           playerThisLoop.damage(world, this.center, 20);
         }
       }
     }
   }

  /**
   * Draw the bullet.
   *
   * @param {CanvasRenderingContext2D} ctx - The context to draw to
   */
  draw(ctx){
    this.animations[this.facing].drawFrame(.17, ctx, this.x, this.y, 0.9);

    // ctx.fillStyle = "white";
    // ctx.strokeRect(this.x, this.y, 16, 16);

  }
  drawMinimap(world, ctx, mmX, mmY) {
    if ((20 <= (mmX + this.x / 7) && (mmX + this.x /7) <= 20 + world.map.width / 7) &&
        (600 <= (mmY + this.y / 10) && (mmY + this.y / 10) <= 600 + world.map.height / 10)) {
      this.animations[this.facing].drawFrame(.17, ctx, mmX + this.x / 7, mmY + this.y / 10, 0.5);
    }
  }

  loadAnimations() {
    for (var j = 0; j < 2; j++) { //facing
      this.animations.push([]);
    }
    //facing right = 0,
    this.animations[0] = new Animator(this.spritesheet, 130, 74, 29, 9, 1, 0.5, null, false, true);

    //facing left = 1,
    this.animations[1] = new Animator(this.spritesheet, 162, 74, 29, 9, 1, 0.5, null, false, true);
  }
}
