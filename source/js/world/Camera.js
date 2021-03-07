/**
 * The camera that is used to determine where to draw the map on the screen.
 */
class Camera extends Point {
  /**
   * Initializes a camera with certain position and zoom level.
   *
   * @params {number} x - The x position of the camera
   * @params {number} y - The x position of the camera
   * @params {number} zoom - How close the camera is zoomed in
   */
  constructor(x, y, zoom) {
    super(x, y);
    // the target is the point that the camera is to be moved to
    this.target = new Point(x, y);
    
    // Allow the zoom to be changed and move to
    this.zoom = zoom;
    this.targetZoom = zoom;
    this.speed = 1;
    this.MAX_ZOOM = 4; // Four times zoom in
    this.MIN_ZOOM = 1; // One time zoom out
    // this.counter = 0; // Log interval to debug
  }

  /**
   * Zooms the camera out to double the size of the drawn map
   */
  zoomOut() {
    this.targetZoom *= 2;
    this.targetZoom = Math.min(this.targetZoom, this.MAX_ZOOM);
  }

  /**
   * Zooms the camera in to halve the size of the drawn map
   */
  zoomIn() {
    this.targetZoom /= 2;
    this.targetZoom = Math.max(this.targetZoom, this.MIN_ZOOM);
  }

  /**
   * Glides the camera towards the target point
   *
   * @param {number} speed - The larger the speed the slower 
   *                         the camera movement.
   *                         Speed must be greater than 1
   */  
  glideToTarget(speed, deltaT) {
    deltaT *= 10;
    // Slowly glide the camera to the position that the target is
    // This fuction needs to be called multiple times between frames.
    let xSpeed = (this.x - this.target.x) / (speed / (deltaT + 1));
    let xDifference = this.x - this.target.x;
    // If the difference between the disired position and the real 
    // position is less than 1/100th then just snap to it.
    if (Math.abs(xDifference) < 0.01) {
      this.x = this.target.x;
    } else {
      this.x -= xSpeed;
    }

    let ySpeed = (this.y - this.target.y) / (speed / (deltaT + 1));
    let yDifference = this.y - this.target.y;
    // If the difference between the disired position and the real 
    // position is less than 1/100th then just snap to it.
    if (Math.abs(yDifference) < 0.01) {
      this.y = this.target.y;
    } else {
      this.y -= ySpeed;
    }

    // Update the zoom level
    
    let zoomSpeed = (this.zoom - this.targetZoom) / (speed / (deltaT + 1));
    let zoomDifference = this.zoom - this.targetZoom;
    // If the difference between the disired zoom and the real 
    // zoom is less than 1/100th then just snap to it.
    if (Math.abs(zoomDifference) < 0.01) {
      this.zoom = this.targetZoom;
    } else {
      this.zoom -= zoomSpeed;
    }
  }

  /**
   * Snaps the camera on the target point of the camera.
   */  
  snapToTarget() {
    // Snap the camera directly to the current position of the target
    this.x = this.target.x;
    this.y = this.target.y;
  }

  /** 
   * Sets up the ctx that was passed in so that further 
   * drawing to canvas will be in relation to the map.
   *
   * @param {CanvasRenderingContext2D} ctx - The context to transform
   */
  transformContext(ctx, distance) {
    let drawingWidth = ctx.canvas.width;
    let drawingHeight = ctx.canvas.height;

    ctx.save();
    ctx.scale(this.zoom, this.zoom);
    let translateX = (-this.x / distance) + drawingWidth / (2 * this.zoom);
    let translateY = (-this.y / distance) + drawingHeight / (2 * this.zoom);

    // For debugging
    // this.counter++;
    // if(this.counter === 60) {
    //   console.log(ctx.canvas.width/this.zoom); this.counter = 0;
    // }

    // If the translateY in addition with view height reaches out of map, then restrict it so the bottom is not visible.
    //  We will need to subtract 111 pixels in order to perfectly match bottom of the view to bottom of the map. 
    //  However, the player will be out of focus when map is too high. Therefore, we will not perform a subtraction here.
    //  Subtract 61 so the player (player's frame height) is "less" out of focus when the map is to low in x1 zoom.
    if(translateY - ctx.canvas.height / this.zoom < - ctx.canvas.height) translateY = -ctx.canvas.height + ctx.canvas.height / this.zoom - 61;
    // Same approach for translateX
    if (translateX >= 0) { // Limit the left edge
      ctx.translate(0, translateY);
    } else if (translateX - ctx.canvas.width / this.zoom < -ctx.canvas.width) { // Limit the right edge
      ctx.translate(-ctx.canvas.width + ctx.canvas.width / this.zoom, translateY);
    } else { // Normal case
      ctx.translate(translateX, translateY);
    }
  }

  /** 
   * Resets the contexts drawing transformation
   *
   * @param {CanvasRenderingContext2D} ctx - The context to restore
   */
  restoreContext(ctx) {
    ctx.restore();
  }
}
