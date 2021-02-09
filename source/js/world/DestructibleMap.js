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

    this.platform = new MovingPlatform(400, this.height * (4/7), (this.width * 1/8), (this.width * 7/8));

    // Generate and draw a random map.
    let mapGenerator = new MapGenerator(img.width, img.height);
    mapGenerator.privateGenerateGroundCoord();
    mapGenerator.drawMap(this.ctx);
  }

  update(game, deltaT) {
    this.platform.update(game, deltaT);
  }

  draw(ctx) {
    ctx.drawImage(this.mapCanvas, 0, 0);
    this.platform.draw(ctx);
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

  // Destory a circle of the map by replacing it with pixels of transparency.
  destroyCircle(x, y, r) {
    for (let i = -r; i <= r; i++) {
      // Use the equation of a circle to determine the area to destroy
      let thisWidth = Math.sqrt(1 - Math.pow(i / r, 2)) * r;
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

  get width() {
    return this.mapCanvas.width;
  }

  get height() {
    return this.mapCanvas.height;
  }
}
