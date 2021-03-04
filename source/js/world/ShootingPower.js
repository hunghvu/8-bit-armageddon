/**
 * This class will provide shooting power for the weapons
 */
class ShootingPower {

    constructor () {
        // Should be empty. Only used this class for static var.
    }
    
    static max = 1000; // The max and min winds are just arbitrary number now. 
    static min = 0; //  They should be fixed values determined by game creators.
    static power = 0;
    static increase = true; // True means increasing, false otherwise. Start decreasing when value reaches 1000.
    static backToZero = false; // When the power is reduced back to 0 from 1000, flag is true, otherwise false.

    /**
     * Logic to manipulate shooting power.
     * Increase power until it reach 1000 then gradually reduce back to 0.
     */
    static change() {
        if (this.power >= this.max) this.direction = false;
        this.increase ? this.power += 2 : this.power -= 2;
        if(this.power === 0) this.backToZero = true;
    }

    /**
     * Reset the values when starting a new turn.
     */
    static reset() {
        this.power = 0;
        this.increase = true;
        this.backToZer0 = false;
    }
}