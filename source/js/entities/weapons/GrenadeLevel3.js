/**
 * An upgraded weapon, the Grenade Lvl 3 (Rocket), can be spawned from an item crate.
 */
class GrenadeLevel3 extends Projectile{
    /**
     * Constructor for the Rocket that extends the projectile class.
     */
    constructor(x, y, angle, power) {
      super(x, y, angle, power*1.5);
      this.projectileCanEndTurn = false; // It is not used as of now.
      this.spritesheet = MANAGER.getAsset('./assets/weapons.png');

      this.animations = [];
      this.loadAnimations();
    }

    /**
     * Update the rocket flying through the air.
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
         world.map.destroyCircle(this.center.x, this.center.y, 75);
         // Find any players in the blast range
         for (let i = 0; i < world.players.length; i++) {
           let playerThisLoop = world.players[i];

           // If we are close enough then damage the player
           let difference = playerThisLoop.center
           difference.sub(this.center);
           if (difference.magnitude < 50) {
             playerThisLoop.damage(world, this.center, 45);
           }
         }
       }

     }

    /**
     * Draw the Rocket
     *
     * @param {CanvasRenderingContext2D} ctx - The context to draw to
     */
    draw(ctx){
      this.animations[this.facing].drawFrame(.17, ctx, this.x, this.y, 1.2);
    }

    loadAnimations() {
      for (var j = 0; j < 2; j++) { //facing
        this.animations.push([]);
      }
      // Rocket (upgrade lvl 3) = no set number
      //facing right = 0,
      this.animations[0] = new Animator(this.spritesheet, 130, 261, 27, 20, 1, 0.5, null, false, true);

      //facing left = 1,
      this.animations[1] = new Animator(this.spritesheet, 162, 262, 27, 20, 1, 0.5, null, true, true);
    }
}
