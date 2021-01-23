class Entity extends Rectangle {
  constructor(spriteSheet, x, y) {
    //Used as hitbox
    // super(x - 3, y, 6, 48);
    super(x + 200, y, 82 - x, 126 - y);

    this.spritesheet = spriteSheet;


    this.facing = 0; // 0 = right, 1 = left
    this.state = 0; // 0 = idle, 1 = walking, 2 = jumping/falling? 3 = shooting
    // this.dead = false; ??

    this.vel = new Point(0, 0);
    this.acc = new Point(0, 0);

    this.onGround = false;
    //
    // this.animations = [];
    // this.loadAnimations();

  }

  drawEntity(ctx)
  {
    //82,126
    ctx.drawImage(this.spritesheet, 59, 65, 23, 61, this.x, this.y, this.w, this.h);
    // ctx.drawImage(this.spritesheet, this.x, this.y, this.w, this.h); //draws everything
    // Used as hitbox
    ctx.linewidth = "1";
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.x,this.y,this.w,this.h);
  }

  setAcceleration(newAcc) {
    this.acc = newAcc;
  }

  setVelocity(newVel) {
    this.vel = newVel;
  }

  // return the desired displacement
  desiredMovement(deltaT) {
    // Update the acceleration
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;

    return new Point(this.vel.x, this.vel.y);
  }

  // loadAnimations() {
  //   for (var i = 0; i < 3; i++) { //states
  //     this.animations.push([]);
  //     for (var j = 0; j < 2; j++) { //facing
  //       this.animations[i].push([]);
  //     }
  //   }
  //   //idle = 0
  //   //facing right, double check NULL
  //   this.animations[0][0] = new Animator(this.spritesheet, 59, 65, 23, 61, 1, 0.5, NULL, false, true);
  //
  //   //Buffer space current build: 23
  //   //Note: seperate spritesheet into respected motions (eg one line walking right, another walking left, etc)
  //   //walk = 1
  //   //facing right
  //   this.animation[1][0] = new Animatior(this.spritesheet, 59, 65, 23, 61, 4, 0.5, 23, false, true);
  //
  //   //Jumping/Falling = 1?
  //
  //
  //   //Shooting = 2
  //   //should have an angle check so function know what angle frame it should be on (should this be another for above?)
  //
  // }
}
