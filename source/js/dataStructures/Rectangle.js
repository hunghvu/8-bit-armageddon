/**
 * A Rectangle class contains a x and y coordinates 
 * as well as width and height 
 */ 
class Rectangle extends Point {
  constructor(x, y, w, h) {
    super(x, y);
    this.w = w;
    this.h = h;
  }

  /**
   * Determines if this rectangle collides with another
   * @param {Rectangle} otherRect - The other rectangle to check
   * @returns {boolean} - True if they are colliding, false 
   *                      otherwise
   */
  doesCollide(otherRect) {
    if (this.x < otherRect.x && this.x + this.w > otherRect.x) {
      // The left side of the rect is inside this rect horizontally
      if (this.y < otherRect.y && this.y + this.h > otherRect.y) {
        // and the top side vertically
        return true;
      } else if (this.y < otherRect.y + otherRect.h && 
                 this.y + this.h > otherRect.y + otherRect.h) {

        // and the bottom side vertically
        return true;
      }

    } else if (this.x < otherRect.x + otherRect.w && 
               this.x + this.w > otherRect.x + otherRect.w) {

      // The right side of the rect is inside this rect horizontally
      if (this.y < otherRect.y && this.y + this.h > otherRect.y) {
        // and the top side vertically
        return true;
      } else if (this.y < otherRect.y + otherRect.h && 
                 this.y + this.h > otherRect.y + otherRect.h) {

        // and the bottom side vertically
        return true;
      }
    }
    return false;
  }

  /**
   * Returns a point that is in the center of this rectangle.
   * @returns {Point} - An x, y coordinate for the center of 
   *                    this rectangle
   */
  get center() {
    return new Point(this.x + this.w / 2, this.y + this.h / 2)
  }

  /**
   * Centers this rectangle on the point passed to it.
   * @param {Point} point - An x, y coordinate for the center of 
   *                        this rectangle
   */
  set center(point) {
    this.x = point.x - this.w / 2;
    this.y = point.y - this.h / 2;
  }
}
