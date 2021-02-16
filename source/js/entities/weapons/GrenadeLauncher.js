/**
 * An upgraded weapon, the Grenade Launcher, can be spawned from an item crate.
 */
class GrenadeLauncher extends Entity{
    /**
     * Constructor for the grenade laucher that extends the entity class.
     */
    constructor(x, y, angle, power) {
        super(x,y,8,8);
        this.x = x;
        this.y = y;
        this.vel.x = Math.cos(angle) * power;
        this.vel.y = -Math.sin(angle) * power;
        // this.upgrade = upgrade;

        this.spritesheet = MANAGER.getAsset('./assets/weapons.png');

        this.animations = [];
        this.loadAnimations();

        this.projectileCanEndTurn = false; // It is not used as of now.
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

        this.add(this.desiredMovement(deltaT, Wind.x, Wind.y))

        if (world.map.collideWithRectangle(this)) {
          // this.vel.x = (this.vel.x * .5);
          // this.vel.y = (this.vel.y * -1);
          // if (this.vel.x < 0) this.facing = 1;
          // if (this.vel.x > 0) this.facing = 0;
          // if (world.map.collideWithRectangle(this)) {
            // Destroy this bullet if we hit something
            this.active = false;
            this.projectileCanEndTurn = true;
            world.map.destroyCircle(this.center.x, this.center.y, 30);
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
      // Grenade = no set number
      //buffer padding current build = 17
      //facing right = 0,
      this.animations[0] = new Animator(this.spritesheet, 9, 7, 12, 14, 4, 0.5, 17, false, true);

      //facing left = 1,
      this.animations[1] = new Animator(this.spritesheet, 137, 7, 12, 14, 4, 0.5, 17, true, true);

      // // Dynomite (upgrade lvl 2) = no set number
      // //buffer padding current build =
      // //facing right = 0,
      // this.animations[0] = new Animator(this.spritesheet, 2, 35, 28, 28, 4, 0.5, 14, false, true);
      //
      // //facing left = 1,
      // this.animations[1] = new Animator(this.spritesheet, 2, 35, 28, 28, 4, 0.5, 14, true, true);
    }
}
