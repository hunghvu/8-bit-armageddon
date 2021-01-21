class Entity extends Rectangle {
  constructor(spriteSheet, x, y) {
    super(x - 3, y, 6, 48);

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
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.w, this.h);

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

    this.privateHandleHorizontalMovement(movement, deltaT, map, entities);
    this.privateHandleVerticalMovement(movement, deltaT, map, entities);
  }

  // return the desired displacement
  desiredMovement(deltaT) {
    // Update the acceleration
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;

    return new Point(this.vel.x, this.vel.y);
  }

  // A helper function to handle x direction movement
  privateHandleHorizontalMovement(movement, deltaT, map, entities) {
    while (movement.x > 1) {
      this.x += 1;
      movement.x -= 1;

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
          this.x -= 1;
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
    while (movement.x < -1) {
      this.x -= 1;
      movement.x += 1;
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
          this.x += 1;

          break;
        }
      }

      // If we are on the ground and we aren't going up
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
          this.updateOnGround(map);
        }
      }
    }
  }

  // A helper function to handle y direction movement
  privateHandleVerticalMovement(movement, detalT, map, entities) {
    while (movement.y < -1) {
      this.y -= 1;
      movement.y += 1;

      if (map.collideWithRectangle(this)) {
        this.y += 1;
        this.vel.y = 0;
        break;
      }
    }
    while (movement.y > 1) {
      this.y += 1;
      movement.y -= 1;

      if (map.collideWithRectangle(this)) {
        this.y -= 1;
        this.vel.y = 0;
        break;
      }
    }
  }
}
