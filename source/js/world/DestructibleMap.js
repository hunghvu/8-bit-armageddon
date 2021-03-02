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
    this.mapGenerator = new MapGenerator(img.width, img.height);
    this.mapGenerator.drawMap(this.ctx);
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
    ctx.drawImage(this.mapCanvas, 20, 600, this.mapCanvas.width/7, this.mapCanvas.height/10);
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

  // destroyPixelIsland(rect) {
  //   var imgd = this.ctx.getImageData(rect.x, rect.y, 1, 1);
  //   var pix = imgd.data;
  //   var transparent = {r:0, g:0, b:0, a:0};
  //
  //   // if the turn ended and there is collision.
  //   if (this.world.currentPlayer.isInTurn === false && this.platform.doesCollide(rect)) {
  //     //
  //     // if the black pixel size is smaller than size 4 (hard code for now)
  //       for (var i = 0, n = pix.length; i < n; i+=4) {
  //         var r = pix[i];
  //         var g = pix[i+1];
  //         var b = pix[i+2];
  //
  //         // check if alpha is anything other than transparent, change to transparent.
  //         if (pix[i+3] > 0 ) {
  //           pix[i] = transparent.r;
  //           pix[i+1] = transparent.g;
  //           pix[i+2] = transparent.b;
  //           pix[i+3] = transparent.a;
  //         }
  //       }
  //
  //       this.ctx.putImageData(imgd, 0, 0);
  //   }
  // }


  get width() {
    return this.mapCanvas.width;
  }

  get height() {
    return this.mapCanvas.height;
  }
}
