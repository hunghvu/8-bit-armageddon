/**
 * This class is used to generated a random map - Hung Vu.
 */
class MapGenerator {
    constructor(width, height) {
        // This is an array containing points of map ground.
        this.pixelArray = [];
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
        // Make an array of adjacent circles and their radii so that we
        // can draw them and their center color seperately
        let circles = []
        let currentCircle = new Point(0, ctx.canvas.height * (4/5));
        while (currentCircle.x < ctx.canvas.width) {
          let offset = new Point(50 * Math.random() + 50, 100 * Math.random() - 50)
          circles.push([new Point(currentCircle.x, currentCircle.y), offset.magnitude])
          currentCircle.add(offset);
          currentCircle.y = Math.min(currentCircle.y, ctx.canvas.height);
        }

        // Draw the out green circles
        ctx.fillStyle = 'green';
        circles.forEach((circle) => {
          ctx.beginPath();
          ctx.arc(circle[0].x, circle[0].y, circle[1], 0, Math.PI * 2, true);
          ctx.fill();
          ctx.closePath();
        });

        // Draw the inner brown circles and draw the ground as going all
        // the way to the bottom of the map
        ctx.fillStyle = '#51361a';
        circles.forEach((circle) => {
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

    /**
     * Calling this function will generate a random coordinates for map ground. The goal is to implement 
     *  Perlin Noise algorithm so the map looks natural, but for now, this will serve (at least
     *  for the prototype).
     */
    privateGenerateGroundCoord(){
        for(var x = 0; x < this.width; x++) {
            let y = 0;
            if (x === 0) {
                y = Math.floor(Math.random() * this.height);
            } else {
                let change = 0;
                if (Math.random() < 0.5){
                    change = (Math.random() * 10) * (-1);
                } else {
                    change = (Math.random() * 10);
                }
                y = this.pixelArray[x - 1] + change;
            }
            if (y < this.height * 4/5) {
                y = this.height * 4/5;
            }
            if (y > this.height){
                this.pixelArray[x] = y - 10;
            } else {
                this.pixelArray[x] = y;
            }
        }
    }
}

