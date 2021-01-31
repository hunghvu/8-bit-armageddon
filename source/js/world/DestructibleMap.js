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

    this.platform = new MovingPlatform(400, this.height * (5/7), 48, 8);

    // Generate and draw a random map.
    let mapGenerator = new MapGenerator(img.width, img.height);
    mapGenerator.privateGenerateGroundCoord();
    mapGenerator.drawMap(this.ctx);
  }

  update(game, deltaT) {
    this.platform.update(game, deltaT);
    /*
    // Move the platform up to find all the entities that are on it.
    this.platform.y -= 1;
    for (let i = 0; i < game.players.length; i++) {
      if (this.platform.doesCollide(game.players[i])) {
        // If the player is right above the platform then take the player for a ride
        game.players[i].x += this.platformDirection;
      }
    }
    this.platform.y += 1;

    // Move the platform
    this.platform.x += this.platformDirection;
    for (let i = 0; i < game.players.length; i++) {
      if (this.platform.doesCollide(game.players[i])) {
        // If the player would be pushed by the platform then just don't move
        // TODO decide what to do when the platform moves into a player
        this.platform.x -= this.platformDirection;
        // Unmove the player
        game.players[i].x -= this.platformDirection;

        return;
      }
    }
    if (this.platform.x < (1/5) * this.width) {
      this.platformDirection = 1;
    } else if (this.platform.x > (4/5) * this.width) {
      this.platformDirection = -1;
    }
    */
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
      let thisWidth = Math.sqrt(1 - Math.pow(i / r, 2)) * r;
      this.ctx.clearRect(x - thisWidth, i + y, 
                         thisWidth * 2, 1);

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
