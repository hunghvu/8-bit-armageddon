/**
 * Laser class
 */
class Laser extends Projectile {
    /**
     * Constructor for a Laser entity
     * @param {number} x - The starting x position
     * @param {number} y - The starting y position
     * @param {number} angle - The angle of the firing direction
     * @param {number} power - The force with which to fire the
     *                         projectile. higher is further
     */
    constructor(x, y, angle, power) {
        super(x, y, angle, power * 10); //100 to go straight through terrain, with 10: still see laser beam shooting in air

        this.spritesheet = MANAGER.getAsset('./assets/weapons.png');

        this.animations = [];
        this.loadAnimations();
    }

    /**
     * Update the laser projectile flying through the air.
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

       console.log(hasCollidedWithAPlayer);

       if (world.map.collideWithRectangle(this)) {
         // // Destroy this bullet if we hit something
         // this.active = false;
         // this.projectileCanEndTurn = true;
         // Destroy the map
         world.map.destroyCircle(this.center.x, this.center.y, 15);
         // Find any players in the blast range
         for (let i = 0; i < world.players.length; i++) {
           let playerThisLoop = world.players[i];
           // If we are close enough then damage the player
           let difference = playerThisLoop.center
           difference.sub(this.center);
           if (difference.magnitude < 32) {
             playerThisLoop.damage(world, this.center, 25);
           }
         }
       }

      //Destroy beam if out of bounds or hits moving platform
      if ((this.x > world.map.width ^ this.x < 0)
         || (this.y > world.map.height ^ this.y < 0)
         || world.map.platform.doesCollide(this)
         || hasCollidedWithAPlayer) {
           // Destroy this bullet if we hit something
           this.active = false;
           this.projectileCanEndTurn = true;
           if (hasCollidedWithAPlayer == true)
           {
             for (let i = 0; i < world.players.length; i++) {
               let playerThisLoop = world.players[i];
               // If we are close enough then damage the player
               let difference = playerThisLoop.center
               difference.sub(this.center);
               if (difference.magnitude < 32) {
                 playerThisLoop.damage(world, this.center, 25);
               }
             }
           }
         }
       }

    /**
     * Draw the beam.
     *
     * @param {CanvasRenderingContext2D} ctx - The context to draw to
     */
    draw(ctx){
        this.animations[this.facing].drawFrame(.17, ctx, this.x, this.y, 1);

        // ctx.fillStyle = "white";
        // ctx.rect(this.x, this.y, 16, 16);
    }

    loadAnimations() {
      for (var j = 0; j < 2; j++) { //facing
        this.animations.push([]);
      }
      //facing right = 0,
      this.animations[0] = new Animator(this.spritesheet, 66, 263, 28, 19, 1, 0.5, null, false, true);

      //facing left = 1,
      this.animations[1] = new Animator(this.spritesheet, 66, 263, 28, 19, 1, 0.5, null, false, true);
    }
}
