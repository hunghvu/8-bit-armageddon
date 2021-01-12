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
    this.zoom = zoom;
    this.speed = 1;
  }

  // The larger the speed the slower the camera movement
  // Speed must be greater than 1
  glideToTarget(speed) {
    // Slowly glide the camera to the position that the target is
    // This fuction needs to be called multiple times between frames.
    let xSpeed = (this.x - this.target.x) / speed;
    let xDifference = this.x - this.target.x;
    this.x -= xSpeed;

    let ySpeed = (this.y - this.target.y) / speed;
    let yDifference = this.y - this.target.y;
    this.y -= ySpeed;
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
    // Draw the map foreground
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(this.map.mapCanvas, - this.camera.x + w / 2, -this.camera.y + h / 2);
    
    // Draw the rectangle player
    ctx.fillStyle = "white";
    ctx.fillRect(this.player.x - this.camera.x + w / 2, 
                 this.player.y - this.camera.y + h / 2, 
                 this.player.w, this.player.h);
  }

  updatePlayer(deltaT) {
    // If the player is moved down 1px and it collides with something 
    // that means the player is on the ground.
    this.player.y += 1;
    if (this.map.collideWithRectangle(this.player)) {
      this.player.onGround = true;
    } else {
      this.player.onGround = false;
    }
    this.player.y -= 1;

    if (this.controls.jump && this.player.onGround) {
      this.player.vel.y = -10;
    }

    // If the player move in either direction
    if (this.controls.left && !this.controls.right) {
      this.player.vel.x = -2;
    } else if (!this.controls.left && this.controls.right) {
      this.player.vel.x = 2;
    } else {
      // Stop the player and any acceleration in the x direction
      this.player.vel.x = 0;
      this.player.acc.x = 0;
    }

    let movement = this.player.desiredMovement();
    
    // Handle x direction movement
    while (movement.x > 1) {
      this.player.x += 1;
      movement.x -= 1;

      if (this.map.collideWithRectangle(this.player)) {
        // Can we just move the player up to get over a curb?
        let step = 0
        for (; step < 3; step++) {
          this.player.y -= 1;
          // If we are no longer colliding then stop going up
          if (!this.map.collideWithRectangle(this.player)) {
            break;
          }
        }
        // If we never got up the curb then the curb is too steep
        if (this.map.collideWithRectangle(this.player)) {
          this.player.y += step;
          this.player.x -= 1;
          break;
        }
      }
    }
    while (movement.x < -1) {
      this.player.x -= 1;
      movement.x += 1;
      
      if (this.map.collideWithRectangle(this.player)) {
        // Can we just move the player up to get over a curb?
        let step = 0
        for (; step < 3; step++) {
          this.player.y -= 1;
          // If we are no longer colliding then stop going up
          if (!this.map.collideWithRectangle(this.player)) {
            break;
          }
        }
        // If we never got up the curb then the curb is too steep
        if (this.map.collideWithRectangle(this.player)) {
          this.player.y += step;
          this.player.x += 1;
          break;
        }
      }
    }
    
    // Handle y direction movement
    while (movement.y < -1) {
      this.player.y -= 1;
      movement.y += 1;
      
      if (this.map.collideWithRectangle(this.player)) {
        this.player.y += 1;
        this.player.vel.y = 0;
        break;
      }
    }
    while (movement.y > 1) {
      this.player.y += 1;
      movement.y -= 1;
      
      if (this.map.collideWithRectangle(this.player)) {
        this.player.y -= 1;
        this.player.vel.y = 0;
        break;
      }
    }
  }

  update(deltaT) {
    
    this.updatePlayer(deltaT);
    
    // Set the cameras target to be the players position
    this.camera.target.x = this.player.center.x;
    this.camera.target.y = this.player.center.y;

    this.camera.glideToTarget(8);
  }
}
