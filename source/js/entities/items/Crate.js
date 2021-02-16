/**
 * The class that should be the base for all collectable items
 */
class Crate extends Entity {
  constructor(x, y) {
    // All crates are 16x16
    super(x, y, 16, 16);
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
  }
  
}
