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
     * Calling this function will generate a random map ground. The goal is to implement 
     *  Perlin Noise algorithm so the map looks natural, but for now, this will serve (at least
     *  for the prototype).
     */
    generateMap(){
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