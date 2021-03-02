/**
 * This class represents an image that is drawn when a player is hit
 */
class DamageText extends Entity { //Add button to enter portal
  /**
   * The constructor for the player
   * @param {number} x - The x position where the text is spawned
   * @param {number} y - The y position where the text is spawned
   */

  constructor(x, y) {
    super(x, y, 0, 0);
    this.vel.x = (Math.random() * 2 -1) * 200;
    this.vel.y = -Math.random() * 200;
    this.timeAlive = 0;
    this.text = "Hurt";
    this.projectileCanEndTurn = true;
  }

  draw(ctx) {
    // Used as hitbox
    ctx.fillText(this.text, this.x, this.y);
  }

  update(world, deltaT) {
    let positionDelta = this.desiredMovement(deltaT);
    this.timeAlive += deltaT;
    this.x += positionDelta.x;
    this.y += positionDelta.y;
    if (this.timeAlive > 1) {
      this.active = false;
    }
  }
}
