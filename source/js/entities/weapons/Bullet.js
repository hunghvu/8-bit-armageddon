/**
 * A generic bullet that is spawned when the player shoots
 */
class Bullet extends Projectile {
  /**
   * Constructor for a bullet entity
   * @param {number} x - The starting x position
   * @param {number} y - The starting y position
   * @param {number} angle - The angle of the firing direction
   * @param {number} power - The force with which to fire the
   *                         projectile. higher is further
   */
  constructor(x, y, angle, power) {
    super(x, y, angle, power);
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
    this.moveUntilCollision(world, this.desiredMovement(deltaT, Wind.x, Wind.y));

    // update direction/facing
    if (this.vel.x < 0) this.facing = 1;
    if (this.vel.x > 0) this.facing = 0;

    // Add y-threshold for the bullet so that i can end turns.
    if (world.map.collideWithRectangle(this) || this.y > world.map.height) {
      // Destroy this bullet if we hit something
      this.active = false;
      this.projectileCanEndTurn = true;
      //let destructionRect = new Rectangle(this.x, this.y, 20, 20);
      //destructionRect.center = this.center;
      //world.map.destroyRectangle(destructionRect);
      world.map.destroyCircle(this.center.x, this.center.y, 10);
      // Find any players in the blast range
      for (let i = 0; i < world.players.length; i++) {
        let playerThisLoop = world.players[i];
        // console.log(playerThisLoop);
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
   * Draw the bullet.
   *
   * @param {CanvasRenderingContext2D} ctx - The context to draw to
   */
  draw(ctx){
    this.animations[this.facing].drawFrame(.17, ctx, this.x, this.y, 0.9);

    ctx.fillStyle = "white";
    ctx.strokeRect(this.x, this.y, 16, 16);

  }

  loadAnimations() {
    for (var j = 0; j < 2; j++) { //facing
      this.animations.push([]);
    }
    //buffer padding current build =
    //facing right = 0,
    this.animations[0] = new Animator(this.spritesheet, 70, 74, 20, 9, 1, 0.5, null, false, true);
        //fix and add load animation
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

    loadAnimations() {
      for (var j = 0; j < 2; j++) { //facing
        this.animations.push([]);
      }
      //buffer padding current build =
      //facing right = 0,
      this.animations[0] = new Animator(this.spritesheet, 9, 7, 12, 14, 4, 0.5, 17, false, true);

      //facing left = 1,
      this.animations[1] = new Animator(this.spritesheet, 137, 7, 12, 14, 4, 0.5, 17, true, true);

    }
}
