class DestructibleMap {
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
    this.platform = null;

    // Generate and draw a random map.
    this.mapGenerator = new MapGenerator(img.width, img.height);
    this.mapGenerator.drawMap(this.ctx);

    // Remove any transparency related antialiasing.
    this.removeSemiTransparentPixels();
  }

  /**
   * This function spawn movable platform at a random location in a way 
   * that it will not collide with the player.
   * @param {Number} highestGroundY The highest point on a map.
   */
  generateMovablePlatform(highestGroundY) {
    let startX = Math.random() * this.mapCanvas.width;
    let startY = Math.random() * (150) + (highestGroundY - 200);
    // 150 = max - min = (highest - 50) - (highest - 200). In other words, spawn the plarform 
    //   in the range of 50 to 200 pixels above the highest point.
    //   As the platform thickness is 10, and players spawn at highest point. This prevent the players and platforms
    //   spawn at the same location and make them stuck to each other.
    this.platform = new MovingPlatform(startX, startY, (this.mapCanvas.width * 1/8), (this.mapCanvas.width * 7/8), this.mapCanvas.width);
  }

  update(game, deltaT) {
    this.platform.update(game, deltaT);
  }

  draw(ctx) {
    ctx.drawImage(this.mapCanvas, 0, 0);
    this.platform.draw(ctx);
  }

  // Draws a minified version of the map
  drawMinimap(ctx, mmX, mmY) {
    ctx.drawImage(this.mapCanvas, window.innerWidth - 1920 / 7 - 5, 105, 1920 / 7, this.mapCanvas.height/10);
  }

  // Destory a single pixel of the map by replacing it with a pixel of transparency.
  destroyPixel(x, y) {
    this.ctx.clearRect(x, y, 1, 1);
  }

  // Destory a rect of the map by replacing it with pixels of transparency.
  destroyRectangle(rectangle) {
    this.ctx.clearRect(rectangle.x, rectangle.y, 
                       rectangle.w, rectangle.h);
  }

  // Destroy a circle of the map by replacing it with pixels of transparency.
  destroyCircle(x, y, r) {
    x = Math.round(x);
    y = Math.round(y);
    for (let i = -r; i <= r; i++) {
      // Use the equation of a circle to determine the area to destroy
      let thisWidth = Math.round(Math.sqrt(1 - Math.pow(i / r, 2)) * r);
      this.ctx.clearRect(x - thisWidth, i + y, 
                         thisWidth * 2, 1);
    }

    let EXPLOSION_DISTANCE = 10;
    // The platform has taken damage if it is close enough to the explosion
    if (this.platform.doesCollide(new Rectangle(x - EXPLOSION_DISTANCE / 2, y - EXPLOSION_DISTANCE / 2, EXPLOSION_DISTANCE, EXPLOSION_DISTANCE))) {
        this.platform.damageTaken = 1;
    }
  }
  
  // Check if the rectangle collides with any non transparent pixels
  collideWithRectangle(rect) {
    // Get an array of all the pixels in the map
    let iData = this.ctx.getImageData(rect.x, rect.y, rect.w, rect.h);
    // Run through all the transparency values
    for (let i = 3; i < iData.data.length; i += 4) {
      if (iData.data[i] != 0) {
        // If any of the pixels in the rect aren't transparent then it's a collision
        return true;
      }
    }

    if (this.platform.doesCollide(rect)) {
      return true;
    }
    return false;
  }

  /**
   * Removes all the pixels that are semitransparent leaving only hard edges
   */
  removeSemiTransparentPixels() {
    let iData = this.ctx.getImageData(0, 0, this.width, this.height);
    // Run through all the transparency values
    for (let i = 3; i < iData.data.length; i += 4) {
      if (iData.data[i] != 0 && iData.data[i] != 255) {
        // If the pixel is semitransparent make it fully transparent
        iData.data[i] = 0;
      }
    }
    this.ctx.putImageData(iData, 0, 0);
  }

  get width() {
    return this.mapCanvas.width;
  }

  get height() {
    return this.mapCanvas.height;
  }
}
