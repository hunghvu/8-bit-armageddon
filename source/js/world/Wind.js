/**
 * This class will provide random wind for each turn.
 * The wind itself will affect trajectory of a projectile.
 */
class Wind {

    constructor () {
        // Should be empty. Only used this class for static var.
    }
    
    static max = 100; // The max and min winds are just arbitrary number now. 
    static min = -100; //  They should be fixed values determined by game creators.
    static x = 0; // Negative is to the left, and vice versa.
    static y = 0;

    /**
     * Give wind in X and Y direction new variables randomly.
     */
    static change() {
        this.x = Math.round(Math.random() * (this.max - this.min) + this.min);
        this.y = Math.round(Math.random() * (this.max - this.min) + this.min);
    }
}