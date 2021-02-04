class Portal extends Entity{
  constructor(x,y, portal, teamDesign)
  {
    super(x,y,8,8);

    this.spritesheet = MANAGER.getAsset('./assets/weapons.png');

    this.x = x;
    this.y = y;

    //frame count 4 or 5, testing 4
    this.animationsOrangePortal = new Animator(this.spritesheet, 131, 96, 26, 31, 3, 0.5, 7, false, true);
    this.animationsBluePortal = new Animator(this.spritesheet, 131, 127, 26, 31, 3, 0.5, 7, false, true)

    this.position = portal;
    this.design = teamDesign;
  }

  draw(ctx)
  {
    if (this.position == 0)
    {
      this.animationsOrangePortal.drawFrame(.1, ctx, this.x, this.y - 30, 1.5);
    }
    else
    {
      this.animationsBluePortal.drawFrame(.1, ctx, this.x, this.y, 1.5);
    }
  }
}
