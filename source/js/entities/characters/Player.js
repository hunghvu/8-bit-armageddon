/**
 * The class for player characters
 */
class Player extends Entity {
  /**
   * The constructor for the player
   * @param {Image} spriteSheet - The players spritesheet
   * @param {number} x - The x position where the player is spawned
   * @param {number} y - The y position where the player is spawned
   */
  constructor(spriteSheet, x, y) {
    //Used as hitbox
    //can change x and y but not w and d
    super(x - 3, y, 6, 48);
    this.WALK_SPEED = 100;
    this.JUMP_POWER = 300;

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
    this.currentWeapon = new CurrentWeapon(this.x, this.y, this.shootingAngle.radians, 600);
  }

  /**
   * Draws the player and any parts of the player to the context.
   * @param {CanvasRenderingContext2D} ctx - The context to draw to.
   */
  draw(ctx) {
    // Used as hitbox
    ctx.linewidth = "1";
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.x, this.y, this.w, this.h);

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

  /**
   * Set the acceleration to a specific set of values.
   * @param {Point} newAcc - The new acceleration
   */
  set acceleration(newAcc) {
    this.acc = newAcc;
  }

  /**
   * Set the velocity to a specific set of values.
   * @param {Point} newVel - The new velocity
   */
  set velocity(newVel) {
    this.vel = newVel;
  }

  /**
   * Updates the onGround status of the player.
   * Set to true if the player is one pixel from 
   * colliding with the ground downward.
   * @param {DestructibleMap} - The map to collide with
   */
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

  /**
   * If this is the active player then call this function to update 
   * based on the user's inputs.
   *
   * @params {World} - The world object that should be referenced
   * @params {Controls} - The controls to get the user input from
   * @params {deltaT} - The number of ms since the last update
   */
  updateActive(world, controls, deltaT) {
    this.updateInputs(world, controls, deltaT);
  }

  /**
   * Updates the player's position based onthe velocity and such.
   *
   * @params {World} - The world object that should be referenced
   * @params {Controls} - The controls to get the user input from
   * @params {deltaT} - The number of ms since the last update
   */
  update(world, controls, deltaT) {
    this.updateOnGround(world.map);
    let movement = this.desiredMovement(deltaT);

    const MIN_WALK = 1.0;

    // update direction/facing
    if (this.vel.x < 0) this.facing = 1;
    if (this.vel.x > 0) this.facing = 0;

    // update state
    if (Math.abs(this.vel.x) >= MIN_WALK) this.state = 1;
    else this.state = 0;

    this.privateHandleHorizontalMovement(movement.x, world.map);
    this.privateHandleVerticalMovement(movement.y, world.map);
  }

  /**
   * Updates the player's status based on user input
   *
   * @params {World} - The world object that should be referenced
   * @params {Controls} - The controls to get the user input from
   */
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
      world.spawn(this.currentWeapon.spawnCurrentWeapon(this.x, this.y, this.shootingAngle));
    }


    if(controls.nextWeaponDownThisLoop) {
      this.currentWeapon.nextWeapon();
      console.log(this.currentWeapon);
    }

    if(controls.previousWeaponDownThisLoop) {
      this.currentWeapon.previousWeapon();
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
    // should have an angle check so function know what angle 
    // frame it should be on (should this be another for above?)

  };

  /**
   * Handles the x axis movement in a way that is feels natural.
   *
   * @param {number} movementX - The number of pixels to move in 
   *                             the x direction
   */
  privateHandleHorizontalMovement(movementX, map) {
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

      // Move the player a single pixel and then 
      // start performing checks
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

  /**
   * Handles the y axis movement.
   *
   * @param {number} movementY - The number of pixels to move in 
   *                             the y direction
   */
  privateHandleVerticalMovement(movementY, map) {
    while (movementY >= 1 || movementY <= -1) {
      // The current shift is either a negative or a positive value
      // depending on whether we are going down (+) or up (-)
      let currentShift = 0;

      if (movementY > 0) {
        currentShift = 1;
      } else {
        currentShift = -1;
      }

      // Move the player a single pixel and then 
      // start performing checks
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
