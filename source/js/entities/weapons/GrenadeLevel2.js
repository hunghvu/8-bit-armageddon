/**
 * An upgraded weapon, the Grenade Level 2, can be spawned from an item crate.
 */
class GrenadeLevel2 extends Projectile{
    /**
     * Constructor for the grenade laucher that extends the entity class.
     */
    constructor(x, y, angle, power) {
      super(x, y, angle, power);
      this.projectileCanEndTurn = false; // It is not used as of now.
      this.spritesheet = MANAGER.getAsset('./assets/weapons.png');

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
        // update direction/facing
        if (this.vel.x < 0) this.facing = 1;
        if (this.vel.x > 0) this.facing = 0;

        //Crate collision
        for(var i = 0; i < world.entities.length; i++) {
          if (world.entities[i] instanceof Crate &&
            ((this.x < (world.entities[i].x + world.entities[i].w)) && (this.x > world.entities[i].x)) &&
            ((this.y > world.entities[i].y) && (this.y < (world.entities[i].y + world.entities[i].h)))) // &&
            // world.currentPlayer.upgradedOnce == 0)
            {
              world.currentPlayer.upgraded++;
              world.entities[i].active = false;
              if (world.currentPlayer.upgraded > 3) {
                world.currentPlayer.upgraded = 1; //reset level
              }
              // world.currentPlayer.upgradedOnce = 1;
            }
          }

        this.moveUntilCollision(world, this.desiredMovement(deltaT, Wind.x, Wind.y));
        if (world.map.collideWithRectangle(this) || this.y > world.map.height) {
            // Destroy this bullet if we hit something
            this.active = false;
            this.projectileCanEndTurn = true;
            world.map.destroyCircle(this.center.x, this.center.y, 50);
            // Find any players in the blast range
            for (let i = 0; i < world.players.length; i++) {
                let playerThisLoop = world.players[i];
                // If we are close enough then damage a player
                let difference = playerThisLoop.center
                difference.sub(this.center);
                if (difference.magnitude < 32) {
                    playerThisLoop.damage(this.center, 4);
                }
            }
        }
    }

    /**
     * Draw the grenade launcher
     *
     * @param {CanvasRenderingContext2D} ctx - The context to draw to
     */
    draw(ctx){
      this.animations[this.facing].drawFrame(.17, ctx, this.x, this.y, 1.2);

      ctx.fillStyle = "white";
      ctx.strokeRect(this.x, this.y, 16, 16);
    }

    loadAnimations() {
      for (var j = 0; j < 2; j++) { //facing
        this.animations.push([]);
      }
      // Dynomite (upgrade lvl 2) = no set number
      //buffer padding current build =
      //facing right = 0,
      this.animations[0] = new Animator(this.spritesheet, 0, 34, 29, 28, 4, 0.5, 14, false, true);

      //facing left = 1,
      this.animations[1] = new Animator(this.spritesheet, 0, 34, 29, 28, 4, 0.5, 14, true, true);
    }
}
