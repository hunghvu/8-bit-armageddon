/**
 * The class for player characters
 */
class Player extends Entity { //Add button to enter portal
  /**
   * The constructor for the player
   * @param {Image} spriteSheet - The players spritesheet
   * @param {number} x - The x position where the player is spawned
   * @param {number} y - The y position where the player is spawned
   */

  constructor(spriteSheet, x, y, design, team, playerNo) {

    //Used as hitbox
    super(x - 3, y, 6, 48);
    this.WALK_SPEED = 64;
    this.JUMP_POWER = 128;

    // The speed at which wind resistance should take effect for the player
    this.LUDICROUS_SPEED = 500;

    this.spritesheet = spriteSheet;

    this.team = team;
    this.design = design; //different designs of characters
    this.facing = 0; // 0 = right, 1 = left
    this.state = 0; // 0 = idle, 1 = walking, 2 = jumping/falling? 3 = shooting
    this.dead = false;

    this.onGround = false;

    // The health of this player
    this.radius = 20;
    this.damageTaken = 0;
    this.healthBar = new HealthBar(this);

    // The shooting angle is always attached to a player, so this should be
    // a better place than 'world'. The entity shooting angle bounds are defined
    // by a weapon that a player is holding, it is hard coded now only for testing - Hung Vu
    this.shootingAngle = new ShootingAngle(
      this.x + this.w,
      this.y + this.h,
      100, 0, 90, 45);

    this.animations = [];

    // Determine if it's this player's turn
    // Lock user's input if false (when the turns end)
    this.isInTurn = false;
    this.loadAnimations();
    this.currentWeapon = new CurrentWeapon(this.x, this.y, this.shootingAngle.radians, 600);

    var d = new Date();
    d.setMilliseconds(200);
    this.jumpTolerance = d.getMilliseconds();

    var a = new Date();
    a.setMilliseconds(500);
    this.airTimer = a.getMilliseconds();

    this.team = team; // Team of the player.
    this.playerNo = playerNo; // Player number (E.g: P1, P2, P3, P4).
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

    this.animations[this.design][this.state][this.facing].drawFrame(.17, ctx, this.x - 24 / 2, this.y, 0.8);

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

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = "16px 'Press Start 2P'";
    ctx.fillStyle = "white";
    
    this.healthBar.draw(ctx);
    if (this.isInTurn) {
      ctx.fillStyle = "Red";
      ctx.fillText("P" + this.playerNo, this.x + this.w / 2 + 60, this.y + this.h);
    } else {
      ctx.fillText("P" + this.playerNo, this.x + this.w / 2 + 60, this.y + this.h);
    }

    ctx.restore();

    //this.healthBar.draw(ctx);
  }

  drawMinimap(ctx, mmX, mmY) {
    ctx.fillStyle = "Red";
    ctx.fillRect(mmX + this.x / 7, mmY + this.y / 10, 10, 10);
  }

  /**
   * Call this whenever damage needs to be done to a player.
   * @param {Point} Origin - where the damage came from
   */
  damage(world, origin, power) {
    // Add knock back
    if (Math.abs(this.x - origin.x) > 1) {
      this.vel.x = 400 / ((this.x - origin.x));
    } else {
      this.vel.x = 400;
    }

    if (Math.abs(this.y - origin.y) > 1) {
      this.vel.y = 400 / ((this.y - origin.y));
    } else {
      this.vel.y = 400;
    }

    world.spawn(new DamageText(this.x, this.y));

    this.damageTaken += power / 100;
    if (this.damageTaken > 1) {
      // If the total damage dealt is greater than 1 then the player is dead.
      // TODO
    }
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
   * Determine whether a player is stand still.
   * When the player is on ground, if there is no movement to left and right
   *  then the user is not moving. A dead player is also consider not moving.
   */
  isStandStill() {
    let flag = true;

    ((this.onGround && this.vel.x ===0) || this.dead) ? flag = true : flag = false;

    return flag;
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
    if(this.isInTurn) {
      this.updateInputs(world, controls, deltaT);
    }
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


    // If the player is on the ground then slow them down through friction
    if (this.onGround) {
      this.vel.x /= (4 * deltaT) + 1;
    }

    // If the player is going really fast then slow them down fast
    if (this.vel.x > this.LUDICROUS_SPEED) {
       this.vel.x /= (3 * deltaT) + 1;
    }

    if (this.vel.y > this.LUDICROUS_SPEED) {
       this.vel.y /= (3 * deltaT) + 1;
    }

    if (Math.abs(this.vel.x) < 4) {
      this.vel.x = 0;
    }
    if (Math.abs(this.vel.y) < 4) {
      this.vel.y = 0;
    }

    if (this.dead === false && (this.damageTaken >= 1 || this.y > world.map.height)) {
      this.dead = true;
    } // Set dead flag if player runs out of health or fall out of map.
  }

  /**
   * Updates the player's status based on user input
   *
   * @params {World} - The world object that should be referenced
   * @params {Controls} - The controls to get the user input from
   */
  updateInputs(world, controls, deltaT) {

    if (this.onGround) {
      this.airTimer = 0;
    } else {
      this.airTimer += deltaT * 100;
    }

    if (controls.jump && this.airTimer < this.jumpTolerance) {
      this.vel.y = -this.JUMP_POWER;
      this.airTimer = this.jumpTolerance;
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

    if (controls.enterPortalDownThisLoop && this.onGround) {
      for(var i = 0; i < world.entities.length; i++)
      {
        // TESTING PURPOSES
        // console.log("world team: " + world.entities[i].design);
        // console.log("player team: " + this.team);
        // console.log("position: " + world.entities[i].position);
        // console.log("world x: " + world.entities[i].x);
        // console.log("player x: " + this.x);
        // console.log("test x: " + (this.x < world.entities[i].x + 40 && this.x > world.entities[i].x - 40));
        // console.log("world y: " + world.entities[i].y);
        // console.log("player y: " + this.y);
        // console.log("test y: " + (this.y < world.entities[i].y + 25 && this.y > world.entities[i].y - 25));
        if(world.entities[i].design == this.team &&
          i < world.entities.length - 1 &&
          world.entities[i+1].design == this.team &&
          (this.x < world.entities[i].x + 40 && this.x > world.entities[i].x - 40) &&
          (this.y < world.entities[i].y + 25 && this.y > world.entities[i].y - 25))
          {
            this.x = world.entities[i+1].x;
            this.y = world.entities[i+1].y;
            break;
          }
          else if(world.entities[i].design == this.team &&
            i >= 1 &&
            world.entities[i-1].design == this.team &&
            (this.x < world.entities[i].x + 40 && this.x > world.entities[i].x - 40) &&
            (this.y < world.entities[i].y + 25 && this.y > world.entities[i].y - 25)) {
              this.x = world.entities[i-1].x;
              this.y = world.entities[i-1].y - 32;
              break;
          }
       }
       while(world.map.collideWithRectangle(this))
       {
         this.y--;
       }
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
    //Human = 0;

    //idle = 0
    //facing right = 0,
    this.animations[0][0][0] = new Animator(this.spritesheet, 11, 128, 23, 61, 1, 0.5, null, false, true);

    // facing left = 1,
    this.animations[0][0][1] = new Animator(this.spritesheet, 11, 193, 23, 61, 1, 0.5, null, false, true);

    //NOTES:
    //Buffer space 1.0 build: 23
    //Buffer space current build: 22

    //walk = 1
    //facing right = 0
    this.animations[0][1][0] = new Animator(this.spritesheet, 11, 128, 23, 61, 7, 0.5, 25, false, true);

    //facing left = 1
    this.animations[0][1][1] = new Animator(this.spritesheet, 11, 193, 23, 61, 7, 0.5, 25, true, true);

    //Jumping/Falling = 2
    //facing right = 0
    // this.animations[0][2][0] = new Animator(this.spritesheet, 11, 193, 23, 61, 7, 0.5, 25, true, true);


    //Shooting = 3
    // should have an angle check so function know what angle
    // frame it should be on (should this be another for above?)

    //Boba = 1;

    //Idle = 0;
    //facing right
    this.animations[1][0][0] = new Animator(this.spritesheet, 102, 384, 36, 59, 1, 0.5, null, false, true);
    //facing left = 1;
    this.animations[1][0][1] = new Animator(this.spritesheet, 54, 384, 36, 59, 1, 0.5, null, false, true);


    //walk = 1;
    this.animations[1][1][0] = new Animator(this.spritesheet, 102, 384, 36, 59, 1, 0.5, null, false, true);
    this.animations[1][1][1] = new Animator(this.spritesheet, 54, 384, 36, 59, 1, 0.5, null, false, true);

    // Cup of Noodle = 2

    //Idle = 0;
    //facing right
    this.animations[2][0][0] = new Animator(this.spritesheet, 240, 384, 41, 54, 1, 0.5, null, false, true);
    //facing left = 1;
    this.animations[2][0][1] = new Animator(this.spritesheet, 197, 386, 41, 54, 1, 0.5, null, false, true);


    //walk = 1;
    this.animations[2][1][0] = new Animator(this.spritesheet, 240, 384, 41, 54, 1, 0.5, null, false, true);
    this.animations[2][1][1] = new Animator(this.spritesheet, 197, 386, 41, 54, 1, 0.5, null, false, true);


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
