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
        ctx.beginPath();
        for (var  i = 0; i < this.pixelArray.length; i++){
          ctx.moveTo(i, this.pixelArray[i]);
          // Arc radius is 60, so I use 70 here to draw some spike
          //  on the bottom of circumference, which resembles stalactite on cave floor.
          //  It seems like using arc in the same path will undo line, so the stalactite
          //  "effect" is achivable. 
          // However, the more circle we draw, the more natural the map is. I use arc as a way
          //  to smooth out the surface, but it's CPU intensive.
          ctx.lineTo(i, this.pixelArray[i] + 70);
          ctx.moveTo(i, this.pixelArray[i]);
          ctx.lineTo(i + 1, this.pixelArray[i + 1]);
          if (Math.random() < 0.3) {
            ctx.arc(i, this.pixelArray[i], 60, 0, Math.PI*2, false);
            // Reduce the rate of drawing a circle and line, so it can reduce hardware load.
            i += 3;
          }
          ctx.fill();
          ctx.stroke();
        }
        ctx.closePath()
        
        // Drawing the bottom of map (this inherently forms caves.
        ctx.beginPath()
        for (var  i = 0; i < this.width; i += 30){
          if (Math.random() < 0.2) {
            ctx.arc(i, this.height, 80, 0, Math.PI*2, false);
          }   
          ctx.fill();
        }
        ctx.closePath();
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
