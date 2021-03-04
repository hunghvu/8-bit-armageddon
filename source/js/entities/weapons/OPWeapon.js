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
       //       // if (world.map.collideWithRectangle(this)) {
       //       //     // Destroy this bullet if we hit something
       //       //     this.active = false;
       //       //     // Remove opWeapon from myWeaponBag
       //       //     for (let j = 0; j < world.currentPlayer.currentWeapon.myWeaponBag.length; j++)
       //       //     {
       //       //       if (world.currentPlayer.currentWeapon.myWeaponBag[j] === OPWeapon)
       //       //       {
       //       //         world.currentPlayer.currentWeapon.myWeaponBag.splice(j,1);
       //       //         break;
       //       //       }
       //       //     }
       //       //
       //       //     if (!(this.y > world.map.height))
       //       //     {
       //       //       world.spawn(new Nuke(this.x, this.y, 0, 0));
       //       //       this.projectileCanEndTurn = true;
       //       //     }
       //       // }
     }

    /**
     * Draw the NUKE
     *
     * @param {CanvasRenderingContext2D} ctx - The context to draw to
     */
    draw(ctx){
      // this.animations[this.facing].drawFrame(.17, ctx, this.x, this.y, 1.2);
      this.nukeSprite.drawFrame(.17, ctx, this.x, this.y, 1.2);


      // ctx.fillStyle = "white";
      // ctx.strokeRect(this.x, this.y, 16, 16);
    }

    // loadAnimations() {
    //   for (var j = 0; j < 2; j++) { //facing
    //     this.animations.push([]);
    //   }
    //   //facing right = 0,
    //   this.animations[0] = new Animator(this.spritesheet, 1, 298, 30, 11, 1, 0.5, null, false, true);
    //
    //   //facing left = 1,
    //   this.animations[1] = new Animator(this.spritesheet, 32, 298, 30, 11, 1, 0.5, null, true, true);
    // }
}
