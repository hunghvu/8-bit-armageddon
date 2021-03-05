class Nuke extends Entity{
  constructor(x,y,angle,power) {
    super(x,y + 700,8,0.001);

    this.spritesheet = MANAGER.getAsset('./assets/weapons.png');

    this.x = x;
    this.y = y;
    this.yup = y + 700;

    this.nukeSprite = new Animator(this.spritesheet, 160, 287, 30, 32, 1, 0.5, null, false, true);

    this.projectileCanEndTurn = false;
  }

  // /**
  //  * Update the bullet flying through the air.
  //  *
  //  * @params {World} - The world object that should be referenced
  //  * @params {deltaT} - The number of ms since the last update
  //  */
  update(world, deltaT) {
    if (this.y == this.yup) {
      // Destroy this bullet if we hit something
      this.active = false;
      world.map.destroyCircle(this.center.x, this.center.y, 500);
      // Find any players in the blast range
      for (let i = 0; i < world.players.length; i++) {
        let playerThisLoop = world.players[i];
        // If we are close enough then damage a player
        let difference = playerThisLoop.center
        difference.sub(this.center);
        if (difference.magnitude < 32) {
            playerThisLoop.damage(this.center, 75);
        }
      }
      this.projectileCanEndTurn = true;
    }
  }

  draw(ctx) {
    this.nukeSprite.drawFrame(.1, ctx, this.x, this.y, 5);
  }
}
