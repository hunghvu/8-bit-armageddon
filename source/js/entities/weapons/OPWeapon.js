/**
 * OP WEAPON (NUKE), only unlocked by collecting 4 crates
 */
class OPWeapon extends Projectile{
    /**
     * Constructor for the opWeapon that extends the entity class.
     */
    constructor(x, y, angle, power) {
      super(x, y, angle, power / 2);
      this.projectileCanEndTurn = false; // It is not used as of now.
      this.spritesheet = MANAGER.getAsset('./assets/weapons.png');

      this.nukeSprite = new Animator(this.spritesheet, 160, 287, 30, 32, 1, 0.5, null, false, true);

      // this.animations = [];
      // this.loadAnimations();
    }

    /**
     * Update the Nuke flying through the air.
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
         world.map.destroyCircle(this.center.x, this.center.y, 500);
         // Find any players in the blast range
         for (let i = 0; i < world.players.length; i++) {
           let playerThisLoop = world.players[i];

           // If we are close enough then damage the player
           let difference = playerThisLoop.center
           difference.sub(this.center);
           if (difference.magnitude < 300) {
             playerThisLoop.damage(world, this.center, 75);
           }
         }
       }
     }

    /**
     * Draw the NUKE
     *
     * @param {CanvasRenderingContext2D} ctx - The context to draw to
     */
    draw(ctx){
      this.nukeSprite.drawFrame(.17, ctx, this.x, this.y, 1.2);
    }

    drawMinimap(world, ctx, mmX, mmY) {
        if (20 <= (mmX + this.x / 7) && (mmX + this.x /7) <= 20 + world.map.width/7) {
            this.nukeSprite.drawFrame(.17, ctx, mmX + this.x / 7, mmY + this.y / 10, 0.5);
        }
    }


}
