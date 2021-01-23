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

    // Generate and draw a random map.
    let mapGenerator = new MapGenerator(img.width, img.height);
    mapGenerator.generateMap();
    const pixelArray = mapGenerator.pixelArray;

    this.ctx.beginPath();
    for (var  i = 0; i < pixelArray.length; i++){
      this.ctx.moveTo(i, pixelArray[i]);
      this.ctx.lineTo(i, this.height);
      this.ctx.moveTo(i, pixelArray[i]);
      this.ctx.lineTo(i + 1, pixelArray[i + 1]);
      this.ctx.stroke();
    }


    console.log(pixelArray);
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
    // Run through all the transparency values
    for (let i = 3; i < iData.data.length; i += 4) {
      if (iData.data[i] != 0) {
        // If any of the pixels in the rect aren't transparent then it's a collision
        return true;
      }
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
