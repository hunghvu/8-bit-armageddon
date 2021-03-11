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
    if (this.x < otherRect.x && this.x + this.w > otherRect.x ||
        this.x < otherRect.x + otherRect.w && this.x + this.w > otherRect.x + otherRect.w) {
      // The other Rectangle's left or right side is inside this one
      if (this.y > otherRect.y && // We start above the top edge
          this.y < otherRect.y + otherRect.h) { // We end below it

        // This rectangle passes through the top edge
        return true;

      } else if (this.y + this.h > otherRect.y && // We start above the bottom edge
                 this.y + this.h < otherRect.y + otherRect.h) { // We end below it

        // This rectangle passes through the bottom edge
        return true;
      }
    } else if (this.y < otherRect.y && this.y + this.h > otherRect.y ||
               this.y < otherRect.y + otherRect.h && this.y + this.h > otherRect.y + otherRect.h) {
      // The other Rectangle's top or bottom side is inside this one
      if (this.x > otherRect.x && // We start left of the left edge
          this.x < otherRect.x + otherRect.w) { // We end to the right of it

        // This rectangle passes through the left edge
        return true;

      } else if (this.x + this.w > otherRect.x && // We start left of the right edge
                 this.x + this.w < otherRect.x + otherRect.w) { // We end to the right of it

        // This rectangle passes through the right edge
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
