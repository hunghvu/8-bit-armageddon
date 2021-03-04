class Portal extends Entity{
  constructor(x,y, portal, teamDesign)
  {
    super(x,y,8,8);

    this.spritesheet = MANAGER.getAsset('./assets/weapons.png');

    this.position = portal;
    this.design = teamDesign;

    this.numOfTurns = 0;

    this.x = x;
    if (this.position == 0) this.y = y - 40;
    else this.y = y;

    // Notes: frame count 4 or 5, testing 4
    // Team 0 (humans) set of portals
    // this.animationsOrangePortalstart = new Animator(this.spritesheet, 6, 96, 26, 31, 4, 0.5, 7, false, false);
    // this.animationsBluePortalstart = new Animator(this.spritesheet, 6, 127, 26, 31, 4, 0.5, 7, false, false);
    this.animationsOrangePortal = new Animator(this.spritesheet, 131, 96, 26, 31, 3, 0.5, 7, false, true);
    this.animationsBluePortal = new Animator(this.spritesheet, 131, 127, 26, 31, 3, 0.5, 7, false, true);
    //Team 1 (food) set of portals
    // this.animationsPurplePortal = new Animator(this.spritesheet, 131, 160, 26, 31, 3, 0.5, 7, false, true);
    // this.animationsYellowPortal = new Animator(this.spritesheet, 131, 192, 26, 31, 3, 0.5, 7, false, true);

    // Since portals are in the entity list and always moving,
    // it'll never end turn without this
    this.projectileCanEndTurn = true;
  }

  // /**
  //  * Update the bullet flying through the air.
  //  *
  //  * @params {World} - The world object that should be referenced
  //  * @params {deltaT} - The number of ms since the last update
  //  */
  update(world, deltaT){
      // this.add(this.desiredMovement(deltaT));
      // while (world.map.collideWithRectangle(this))
      // {
      //   this.y--;
      // }
      if (this.numOfTurns == (world.players.length * 2)){
        this.active = false;
      }
  }

  draw(ctx)
  {
    //human team portals
    if (this.design == 0){
      // if (this.position == 0)
      {
        this.animationsOrangePortal.drawFrame(.1, ctx, this.x, this.y, 1.5);
      }
      // else
      // {
      // this.animationsPurplePortal.drawFrame(.1, ctx, this.x, this.y, 1.5);
      // }
    }
    //food team portals
    else
    {
      // if (this.position == 0)
      // {
      //   this.animationsYellowPortal.drawFrame(.1, ctx, this.x, this.y - 30, 1.5);
      // }
      // else {
        this.animationsBluePortal.drawFrame(.1, ctx, this.x, this.y, 1.5);
      // }
    }
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
}
