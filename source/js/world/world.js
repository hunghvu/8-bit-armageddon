class DestructableMap {
  /* Takes an image as the input map */
  constructor(img) {
    // Create a canvas that will hold the new map with all the destruction.
    this.mapCanvas = document.createElement('canvas');
    this.ctx = this.mapCanvas.getContext('2d');
    
    // Make the map the same size as the image
    this.mapCanvas.width = img.width;
    this.mapCanvas.height = img.height;
    
    // Draw the image onto the map for further use
    this.ctx.drawImage(img, 0, 0);
  }

  // Destory a single pixel of the map by replacing it with a pixel of transparency.
  destroyPixel(x, y) {
    this.ctx.clearRectangle(x, y, 1, 1);
  }

  // Destory a rect of the map by replacing it with a pixel of transparency.
  destroyRectangle(x, y, w, h) {
      this.ctx.clearRectangle(x, y, w, h);
  }
  
  // Check if the rectangle collides with any non transparent pixels
  collideWithRectangle(rect) {
    // Get an array of all the pixels in the map
    let iData = this.ctx.getImageData(rect.x, rect.y, rect.w, rect.h);
    // If any of the pixels are non zero then return true for a collision
    return iData.data.reduce((acc, currentValue) => (acc || currentValue != 0), false)
  }
}


class Actor extends Rectangle {
  constructor(spriteSheet, x, y) {
    super(x - 3, y, 6, 48);
    
    this.vel = new Point(0, 0);
    this.acc = new Point(0, 0);
    
    this.onGround = false;
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
}

class Camera extends Point {
  constructor(x, y, zoom) {
    super(x, y);
    // the target is the point that the camera is to be moved to
    this.target = new Point(x, y);
    
    // Allow the zoom to be changed and move to
    this.zoom = zoom;
    this.targetZoom = zoom;
    this.speed = 1;
    this.MAX_ZOOM = 4; // Four times zoom in
    this.MIN_ZOOM = 0.25; // Four times zoom out
  }

  zoomOut() {
    this.targetZoom *= 2;
    this.targetZoom = Math.min(this.targetZoom, this.MAX_ZOOM);
  }

  zoomIn() {
    this.targetZoom /= 2;
    this.targetZoom = Math.max(this.targetZoom, this.MIN_ZOOM);
  }

  // The larger the speed the slower the camera movement
  // Speed must be greater than 1
  glideToTarget(speed) {
    // Slowly glide the camera to the position that the target is
    // This fuction needs to be called multiple times between frames.
    let xSpeed = (this.x - this.target.x) / speed;
    let xDifference = this.x - this.target.x;
    // If the difference between the disired position and the real 
    // position is less than 1/100th then just snap to it.
    if (Math.abs(xDifference) < 0.01) {
      this.x = this.target.x;
    } else {
      this.x -= xSpeed;
    }

    let ySpeed = (this.y - this.target.y) / speed;
    let yDifference = this.y - this.target.y;
    // If the difference between the disired position and the real 
    // position is less than 1/100th then just snap to it.
    if (Math.abs(yDifference) < 0.01) {
      this.y = this.target.y;
    } else {
      this.y -= ySpeed;
    }

    // Update the zoom level
    
    let zoomSpeed = (this.zoom - this.targetZoom) / speed;
    let zoomDifference = this.zoom - this.targetZoom;
    // If the difference between the disired zoom and the real 
    // zoom is less than 1/100th then just snap to it.
    if (Math.abs(zoomDifference) < 0.01) {
      this.zoom = this.targetZoom;
    } else {
      this.zoom -= zoomSpeed;
    }
  }

  snapToTarget() {
    // Snap the camera directly to the current position of the target
    this.x = this.target.x;
    this.y = this.target.y;
  }

}

class World {
  constructor(map) {
    this.controls = new Controls();
    this.map = map;
    
    this.player = new Actor(null, 344, 650);
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
    ctx.fillStyle = "white";
    ctx.fillRect(this.player.x, 
                 this.player.y, 
                 this.player.w, this.player.h);

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

  updateActor(deltaT, actor) {
    // If the player is moved down 1px and it collides with something 
    // that means the player is on the ground.
    actor.y += 1;
    if (this.map.collideWithRectangle(actor)) {
      actor.onGround = true;
    } else {
      actor.onGround = false;
    }
    actor.y -= 1;

    if (this.controls.jump && actor.onGround) {
      actor.vel.y = -10;
    }

    let movement = actor.desiredMovement();
    
    // Handle x direction movement
    while (movement.x > 1) {
      actor.x += 1;
      movement.x -= 1;

      if (this.map.collideWithRectangle(actor)) {
        // Can we just move the player up to get over a curb?
        let step = 0
        for (; step < 3; step++) {
          actor.y -= 1;
          // If we are no longer colliding then stop going up
          if (!this.map.collideWithRectangle(actor)) {
            break;
          }
        }
        // If we never got up the curb then the curb is too steep
        if (this.map.collideWithRectangle(actor)) {
          actor.y += step;
          actor.x -= 1;
          break;
        }
      }
    }
    while (movement.x < -1) {
      actor.x -= 1;
      movement.x += 1;
      
      if (this.map.collideWithRectangle(actor)) {
        // Can we just move the player up to get over a curb?
        let step = 0
        for (; step < 3; step++) {
          actor.y -= 1;
          // If we are no longer colliding then stop going up
          if (!this.map.collideWithRectangle(actor)) {
            break;
          }
        }
        // If we never got up the curb then the curb is too steep
        if (this.map.collideWithRectangle(actor)) {
          actor.y += step;
          actor.x += 1;
          break;
        }
      }
    }
    
    // Handle y direction movement
    while (movement.y < -1) {
      actor.y -= 1;
      movement.y += 1;
      
      if (this.map.collideWithRectangle(actor)) {
        actor.y += 1;
        actor.vel.y = 0;
        break;
      }
    }
    while (movement.y > 1) {
      actor.y += 1;
      movement.y -= 1;
      
      if (this.map.collideWithRectangle(actor)) {
        actor.y -= 1;
        actor.vel.y = 0;
        break;
      }
    }
  }
}
