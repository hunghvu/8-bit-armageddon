class World {
  constructor(map) {
    this.controls = new Controls();
    this.map = map;

    this.spritesheet = MANAGER.getAsset('./assets/character.png');

    // this.player = new Entity(NULL, 344, 650);
    this.player = new Entity(this.spritesheet, 59, 65);

    // Give the player gravity
    this.player.acc.y = .4;

    this.camera = new Camera(500, 500, 1);
  }

  draw(ctx, w, h) {
    // Clear the screen without worrying about transforms
    ctx.clearRect(0, 0, w, h);

    // Transform the renderer based on the camera object
    ctx.save();
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate((-this.camera.x + w / (2 * this.camera.zoom)), (-this.camera.y + h / (2 * this.camera.zoom)));

    // Draw the map foreground
    ctx.drawImage(this.map.mapCanvas, 0, 0);

    // Draw the rectangle player
    // ctx.fillStyle = "white";
    // ctx.fillRect(this.player.x,
    //              this.player.y,
    //              this.player.w, this.player.h);
    this.player.drawEntity(ctx);

    // Display current position on screen.
    ctx.font = "20px Arial";
    ctx.fillText("Mouse position: X=" + this.controls.moveX + ", Y=" + this.controls.moveY,
                  this.player.x, this.player.y - 100);

    // Untransform ctx
    ctx.restore();
  }

  update(deltaT) {
    this.updateInputs(this.player);
    this.updateActor(deltaT, this.player);

    // Set the cameras target to be the players position
    this.camera.target.x = this.player.center.x;
    this.camera.target.y = this.player.center.y;

    this.camera.glideToTarget(8);
    console.log(this.controls.scrollDelta);
    this.controls.reset();
  }

  updateInputs(currentPlayer) {
    // If the player move in either direction
    if (this.controls.left && !this.controls.right) {
      currentPlayer.vel.x = -2;
    } else if (!this.controls.left && this.controls.right) {
      currentPlayer.vel.x = 2;
    } else {
      // Stop the player and any acceleration in the x direction
      // if they don't want to move.
      currentPlayer.vel.x = 0;
      currentPlayer.acc.x = 0;
    }

    // If the user scrolls then zoom in or out
    if (this.controls.scrollDelta > 0) {
      this.camera.zoomIn();
    } else if (this.controls.scrollDelta < 0) {
      this.camera.zoomOut();
    }
  }

  updateActor(deltaT, entity) {
    // If the player is moved down 1px and it collides with something
    // that means the player is on the ground.
    entity.y += 1;
    if (this.map.collideWithRectangle(entity)) {
      entity.onGround = true;
    } else {
      entity.onGround = false;
    }
    entity.y -= 1;

    if (this.controls.jump && entity.onGround) {
      entity.vel.y = -10;
    }

    let movement = entity.desiredMovement();

    // Handle x direction movement
    while (movement.x > 1) {
      entity.x += 1;
      movement.x -= 1;

      if (this.map.collideWithRectangle(entity)) {
        // Can we just move the player up to get over a curb?
        let step = 0
        for (; step < 3; step++) {
          entity.y -= 1;
          // If we are no longer colliding then stop going up
          if (!this.map.collideWithRectangle(entity)) {
            break;
          }
        }
        // If we never got up the curb then the curb is too steep
        if (this.map.collideWithRectangle(entity)) {
          entity.y += step;
          entity.x -= 1;
          break;
        }
      }
    }
    while (movement.x < -1) {
      entity.x -= 1;
      movement.x += 1;

      if (this.map.collideWithRectangle(entity)) {
        // Can we just move the player up to get over a curb?
        let step = 0
        for (; step < 3; step++) {
          entity.y -= 1;
          // If we are no longer colliding then stop going up
          if (!this.map.collideWithRectangle(entity)) {
            break;
          }
        }
        // If we never got up the curb then the curb is too steep
        if (this.map.collideWithRectangle(entity)) {
          entity.y += step;
          entity.x += 1;
          break;
        }
      }
    }

    // Handle y direction movement
    while (movement.y < -1) {
      entity.y -= 1;
      movement.y += 1;

      if (this.map.collideWithRectangle(entity)) {
        entity.y += 1;
        entity.vel.y = 0;
        break;
      }
    }
    while (movement.y > 1) {
      entity.y += 1;
      movement.y -= 1;

      if (this.map.collideWithRectangle(entity)) {
        entity.y -= 1;
        entity.vel.y = 0;
        break;
      }
    }
  }
}
