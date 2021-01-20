class Entity extends Rectangle {
  constructor(spriteSheet, x, y) {
    super(x - 3, y, 6, 48);

    this.vel = new Point(0, 0);
    this.acc = new Point(0, 0);

    // Default gravity acceleration
    this.acc.y = .4;

    this.onGround = false;
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.w, this.h);
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

    // Handle x direction movement
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
      }
    }

    // Handle y direction movement
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

  // return the desired displacement
  desiredMovement(deltaT) {
    // Update the acceleration
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;

    return new Point(this.vel.x, this.vel.y);
  }
}
