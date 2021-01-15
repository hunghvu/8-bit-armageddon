/* A point object contains an 'x' and a 'y' */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(otherPoint) {
    this.x += otherPoint.x;
    this.y += otherPoint.y;
  }

  sub(otherPoint) {
    this.x -= otherPoint.x;
    this.y -= otherPoint.y;
  }
}
