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

    // Default gravity acceleration
    this.acc.y = .4;

    this.onGround = false;
    
    // The shooting angle is always attached to a player, so this should be 
    // a better place than 'world'. The entity shooting angle bounds are defined
    // by a weapon that a player is holding, it is hard coded now only for testing - Hung Vu
    this.shootingAngle = new ShootingAngle(
      this.x + this.w,
      this.y + this.h,
      100, 0, 90, 45);
    //
    // this.animations = [];
    // this.loadAnimations();

  }

  draw(ctx) {
    ctx.drawImage(this.spritesheet, 59, 65, 23, 61, this.x, this.y, this.w, this.h);
    // ctx.drawImage(this.spritesheet, this.x, this.y, this.w, this.h); //draws everything
    // Used as hitbox
    ctx.linewidth = "1";
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.x,this.y,this.w,this.h);
    
    
    // Draw shooting angle indicator
    // Technically, the origin can be derived from a player position as shown below
    //  but by having a separate query like this, it will increase readability - Hung Vu
    this.shootingAngle.updateOrigin(this.x, this.y);
    ctx.beginPath();
    ctx.moveTo(this.shootingAngle.originX, this.shootingAngle.originY);
    // The coord system of 2D plane in canvas is reversed compared to in reality, so we need a negative angle here
    let radian = -this.shootingAngle.defaultAngle * Math.PI / 180;
    ctx.lineTo(
      this.shootingAngle.originX + this.shootingAngle.radius * Math.cos(radian),
      this.shootingAngle.originY + this.shootingAngle.radius * Math.sin(radian));
    ctx.stroke();
  }

  setAcceleration(newAcc) {
    this.acc = newAcc;
  }

  setVelocity(newVel) {
    this.vel = newVel;
  }

  updateOnGround(map) {
    // If the entity is moved down 1px and it collides with something
    // that means the entity is on the ground.
    this.y += 1;
    if (map.collideWithRectangle(this)) {
      this.onGround = true;
    } else {
      this.onGround = false;
    }
    this.y -= 1;
  }

  update(deltaT, map, entities) {
    this.updateOnGround(map);
    let movement = this.desiredMovement();

    this.privateHandleHorizontalMovement(movement.x, deltaT, map, entities);
    this.privateHandleVerticalMovement(movement.y, deltaT, map, entities);
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
  
  // A helper function to handle x direction movement
  privateHandleHorizontalMovement(movementX, deltaT, map, entities) {
    // If we need to move more than a pixel in either direction
    // then do it pixel by pixel
    while (movementX > 1 || movementX < -1) {
      // The current shift is either a negative or a positive value
      // depending on whether we are going left (-) or right (+)
      let currentShift = 0;

      if (movementX > 1) {
        currentShift = 1;
      } else {
        currentShift = -1;
      }

      movementX -= currentShift;
      this.x += currentShift;

      if (map.collideWithRectangle(this)) {
        // Can we just move the entity up to get over a curb?
        let step = 0
        for (; step < 3; step++) {
          this.y -= 1;
          // If we are no longer colliding then stop going up
          if (!map.collideWithRectangle(this)) {
            break;
          }
        }
        // If we never got up the curb then the curb is too steep
        if (map.collideWithRectangle(this)) {
          this.y += step;
          this.x -= currentShift;
          break;
        }
      }

      if (this.onGround) {
        this.updateOnGround(map);
        // If we have moved off the ground, check if can move the 
        // entity down one pixel to put them back on the ground.
        //
        // This will smooth out walking down slopes.
        if (!this.onGround) {
          this.y += 2;
          if (map.collideWithRectangle(this)) {
            // We can move down a single pixel to get back on the ground
            this.y -= 1
          } else {
            // We have moved of a steep cliff, let nature take its course
            this.y -= 2;
          }
        }
        this.updateOnGround(map);
      }
    }
  }

  // A helper function to handle y direction movement
  privateHandleVerticalMovement(movementY, detalT, map, entities) {
    while (movementY > 1 || movementY < -1) {
      // The current shift is either a negative or a positive value
      // depending on whether we are going down (+) or up (-)
      let currentShift = 0;

      if (movementY > 1) {
        currentShift = 1;
      } else {
        currentShift = -1;
      }

      this.y += currentShift;
      movementY -= currentShift;

      if (map.collideWithRectangle(this)) {
        this.y -= currentShift;
        this.vel.y = 0;
        break;
      }
    }
  }
}
