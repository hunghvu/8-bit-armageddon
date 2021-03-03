/**
 * The class that should be the base for all collectable items
 */
class Crate extends Entity {
  constructor(x, y) {
    // All crates are 16x16
    // super(x, y, 16, 16);
    super(x,y,33,44);
    this.projectileCanEndTurn = true;

    this.spritesheet = MANAGER.getAsset('./assets/weapons.png');
    this.crateSprite = new Animator(this.spritesheet, 196, 288, 22, 29, 1, 0.5, null, false, true);
  }

  /**
   * Draws the crate.
   *
   * @param {CanvasRenderingContext2D} ctx - The context to draw to
   */
  draw(ctx) {
    this.crateSprite.drawFrame(.17, ctx, this.x, this.y, 1.5);

    // // Used as hitbox
    // ctx.fillStyle = "brown";
    // ctx.fillRect(this.x, this.y, this.w, this.h);
    //
    // //corner of crates
    // ctx.fillStyle = "black";
    // ctx.fillRect(this.x, this.y, 2, 2);
    // ctx.fillStyle = "red";
    // ctx.fillRect(this.x + this.w, this.y, 2, 2);
    // ctx.fillStyle = "green";
    // ctx.fillRect(this.x, this.y + this.h, 2, 2);
    // ctx.fillStyle = "blue";
    // ctx.fillRect(this.x + this.w, this.y + this.h, 2, 2);


  }

}
