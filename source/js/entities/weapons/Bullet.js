/**
 * A generic bullet that is spawned when the player shoots
 */
class Bullet extends Entity{
    /**
     * Constructor for a bullet entity
     * @param {number} x - The starting x position
     * @param {number} y - The starting y position
     * @param {number} angle - The angle of the firing direction
     * @param {number} power - The force with which to fire the
     *                         projectile. higher is further
     */
    constructor(x, y, angle, power) {
        super();
        this.x = x;
        this.y = y;
        this.vel.x = Math.cos(angle) * power;
        this.vel.y = -Math.sin(angle) * power;

        //this.type = 0; Type of weapon gun = 0, grenade = 1, teleport gun = 2, portal gun = 3

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
        this.add(this.desiredMovement(deltaT))

        // update direction/facing
        if (this.vel.x < 0) this.facing = 1;
        if (this.vel.x > 0) this.facing = 0;
    }

    /**
     * Draw the bullet.
     *
     * @param {CanvasRenderingContext2D} ctx - The context to draw to
     */
    draw(ctx){
        // ctx.drawImage(this.spritesheet, 9, 7, 12, 14, this.x, this.y, 12, 14);
        this.animations[this.facing].drawFrame(.17, ctx, this.x, this.y, 0.8);

        ctx.fillStyle = "white";
        ctx.strokeRect(this.x, this.y, 16, 16);

        //fix and add load animation
    }
    loadAnimations() {
      for (var j = 0; j < 2; j++) { //facing
        this.animations.push([]);
      }
      //buffer padding current build =
      //facing right = 0,
      this.animations[0] = new Animator(this.spritesheet, 9, 7, 12, 14, 4, 0.5, 17, false, true);

      //facing left = 1,
      this.animations[1] = new Animator(this.spritesheet, 137, 7, 12, 14, 1, 0.5, 17, true, true);

    }
}
