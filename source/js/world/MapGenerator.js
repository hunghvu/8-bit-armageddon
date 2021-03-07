/**
 * This class is used to generated a random map - Hung Vu.
 */
class MapGenerator {
    constructor(width, height) {
        // This is an array containing points of map ground.
        this.circles = [];
        this.width = width;
        this.height = height;
    }

    /**
     * This will draw a map on screen.
     * @param {CanvasContext} ctx 
     */
    drawMap(ctx) {
        // Clear the entire canvas that we were given
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.stroke(); // Create a hidden barrier so the players will not fall out of map when reaching left/right edges. 
                      // This barrier can be disable though, let this be an easter edge I think.
        // Make an array of adjacent circles and their radii so that we
        // can draw them and their center color seperately
        let currentCircle = new Point(0, ctx.canvas.height * (4/5));
        while (currentCircle.x < ctx.canvas.width) {
          let offset = new Point(50 * Math.random() + 50, 100 * Math.random() - 50)
          this.circles.push([new Point(currentCircle.x, currentCircle.y), offset.magnitude])
          currentCircle.add(offset);
          currentCircle.y = Math.min(currentCircle.y, ctx.canvas.height);
        }

        // Draw the out green circles
        ctx.fillStyle = 'green';
        this.circles.forEach((circle) => {
          ctx.beginPath();
          ctx.arc(circle[0].x, circle[0].y, circle[1], 0, Math.PI * 2, true);
          ctx.fill();
          ctx.closePath();
        });

        // Draw the inner brown circles and draw the ground as going all
        // the way to the bottom of the map
        ctx.fillStyle = '#51361a';
        this.circles.forEach((circle) => {
          let smallerRadius = circle[1] * (4/5);
          ctx.beginPath();
          ctx.arc(circle[0].x, circle[0].y, smallerRadius, 0, Math.PI * 2, true);
          ctx.fill();
          ctx.closePath();

          // Draw the ground to the bottom of the map
          ctx.beginPath();
          ctx.rect(circle[0].x - smallerRadius, circle[0].y, smallerRadius * 2, 600);
          ctx.fill();
          ctx.closePath();
        });

    }
}

