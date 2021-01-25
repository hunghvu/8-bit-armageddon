class Player extends Entity {
  constructor(spriteSheet, x, y) {
    //Used as hitbox
    //can change x and y but not w and d
    super(x - 3, y, 6, 48);
    this.WALK_SPEED = 100;
    this.JUMP_POWER = 300;
    // super(x + 200, y, 82 - x, 126 - y);

    this.spritesheet = spriteSheet;

    this.facing = 0; // 0 = right, 1 = left
    this.state = 0; // 0 = idle, 1 = walking, 2 = jumping/falling? 3 = shooting
    // this.dead = false; ??

    this.onGround = false;

    // The shooting angle is always attached to a player, so this should be
    // a better place than 'world'. The entity shooting angle bounds are defined
    // by a weapon that a player is holding, it is hard coded now only for testing - Hung Vu
    this.shootingAngle = new ShootingAngle(
      this.x + this.w,
      this.y + this.h,
      100, 0, 90, 45);

    this.animations = [];
    this.loadAnimations();
  }

  draw(ctx) {
    // Used as hitbox
    ctx.linewidth = "1";
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.x,this.y,this.w+15,this.h+15);

    this.animations[this.state][this.facing].drawFrame(.17, ctx, this.x, this.y, 0.8);

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

  set acceleration(newAcc) {
    this.acc = newAcc;
  }

  set velocity(newVel) {
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

  updateActive(world, controls, deltaT) {
    this.updateInputs(world, controls, deltaT);
  }

  update(world, controls, deltaT) {
    this.updateOnGround(world.map);
    let movement = this.desiredMovement(deltaT);

    const MIN_WALK = 1.0;

    //update direction/facing
    if (this.vel.x < 0) this.facing = 1;
    if (this.vel.x > 0) this.facing = 0;

    //update state
    if (Math.abs(this.vel.x) >= MIN_WALK) this.state = 1;
    else this.state = 0;

    this.privateHandleHorizontalMovement(movement.x, deltaT, world.map, world.entities);
    this.privateHandleVerticalMovement(movement.y, deltaT, world.map, world.entities);
  }

  updateInputs(world, controls) {
    if (controls.jump && this.onGround) {
      this.vel.y = -this.JUMP_POWER;
    }

    // If the player move in either direction
    if (controls.left && !controls.right) {
      this.vel.x = -this.WALK_SPEED;
      this.shootingAngle.updateQuadrant(0);
    } else if (!controls.left && controls.right) {
      this.vel.x = this.WALK_SPEED;
      this.shootingAngle.updateQuadrant(1);
    }    
    else {
      // Stop the player and any acceleration in the x direction
      // if they don't want to move.
      this.vel.x = 0;
      this.acc.x = 0;
    }

    /**
     * Adjust shooting angle
     * @todo Have a better handler when pressing multiple button at once
     */

    if (controls.up) {
      this.shootingAngle.right ? this.shootingAngle.increaseAngle() : this.shootingAngle.decreaseAngle();
    } 
    if (controls.down) {
      this.shootingAngle.left ? this.shootingAngle.increaseAngle() : this.shootingAngle.decreaseAngle();
    }

    if(controls.shootingDownThisLoop){
      world.spawn(new Bullet(this.x, this.y, this.shootingAngle.radians, 600));
    }
    // If the user scrolls then zoom in or out
    if (controls.scrollDelta > 0) {
      world.camera.zoomIn();
    } else if (controls.scrollDelta < 0) {
      world.camera.zoomOut();
    }
  }

  loadAnimations() {
    for (var i = 0; i < 3; i++) { //states
      this.animations.push([]);
      for (var j = 0; j < 2; j++) { //facing
        this.animations[i].push([]);
      }
    }
    //idle = 0
    //facing right = 0,
    this.animations[0][0] = new Animator(this.spritesheet, 11, 128, 23, 61, 1, 0.5, null, false, true);

    //facing left = 1,
    this.animations[0][1] = new Animator(this.spritesheet, 11, 193, 23, 61, 1, 0.5, null, false, true);

    //NOTES:
    //Buffer space 1.0 build: 23
    //Buffer space current build: 22

    //walk = 1
    //facing right = 0
    this.animations[1][0] = new Animator(this.spritesheet, 11, 128, 23, 61, 7, 0.5, 25, false, true);

    //facing left = 1
    this.animations[1][1] = new Animator(this.spritesheet, 11, 193, 23, 61, 7, 0.5, 25, true, true);

    //Jumping/Falling = 1?


    //Shooting = 2
    //should have an angle check so function know what angle frame it should be on (should this be another for above?)

  };

  // A helper function to handle x direction movement
  privateHandleHorizontalMovement(movementX, deltaT, map, entities) {
    // If we need to move more than a pixel in either direction
    // then do it pixel by pixel
    while (movementX >= 1 || movementX <= -1) {
      // The current shift is either a negative or a positive value
      // depending on whether we are going left (-) or right (+)
      let currentShift = 0;

      if (movementX > 0) {
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
    while (movementY >= 1 || movementY <= -1) {
      // The current shift is either a negative or a positive value
      // depending on whether we are going down (+) or up (-)
      let currentShift = 0;

      if (movementY > 0) {
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
