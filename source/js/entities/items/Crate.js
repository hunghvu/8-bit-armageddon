/**
 * The class that should be the base for all collectable items
 */
class Crate extends Entity {
  constructor(x, y) {
    // All crates are 16x16
    // super(x, y, 16, 16);
    super(x,y,90,90);
    this.projectileCanEndTurn = true;
  }

  /**
   * Draws the crate.
   *
   * @param {CanvasRenderingContext2D} ctx - The context to draw to
   */
  draw(ctx) {
    // Used as hitbox
    ctx.fillStyle = "brown";
    ctx.fillRect(this.x, this.y, this.w, this.h);

    //corner of cretes
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, 2, 2);
    ctx.fillStyle = "red";
    ctx.fillRect(this.x + this.w, this.y, 2, 2);
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y + this.h, 2, 2);
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x + this.w, this.y + this.h, 2, 2);


  }

}
