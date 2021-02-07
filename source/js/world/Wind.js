class Wind {
    constructor () {
        this.x = 0;
        this.y = 0;
        this.max = 10; // The max and min winds are just arbitrary number now. 
        this.min = 0   //  They should be fixed values determined by game creators.
    }
    
    change() {
        this.x = Math.random() * (this.max - this.min) + this.min;
        this.y = Math.random() * (this.max - this.min) + this.min;
    }
}