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
