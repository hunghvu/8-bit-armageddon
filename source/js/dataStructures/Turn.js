/**
 * This represents in-game turn.
 */
class Turn {
    constructor(timer, world, timePerTurn) {
        this.timePerTurn = timePerTurn;
        // this.game = game; // currently not in used
        this.world = world;
        this.playerNumber = this.world.players.length - 2;
        this.timer = timer;
        // this.timer = null;
        console.log(new Date())
    }
    countdownTurn(){
        // console.log(this.timer.turnTime % this.timePerTurn);
        // Approximately 0 (max timer step).
        // this.timePerTurn is currently 5 secs, so minus maxStep turns it to 4.95;
        // The maxStep is 0.05 is timer will always happens at least one time during *.95 and (*+1).00 range.
        // Because we can have multiple step between *.95 and (*+1).00, e.g: *.975 => need to round up.
        if ((this.timer.turnTime % this.timePerTurn) >= (this.timePerTurn - this.timer.maxStep)) {
            this.timer.turnTime = Math.round(this.timer.turnTime % this.timePerTurn);
            if(this.world.currentPlayer.onGround) {
                if (this.playerNumber === -1) {
                    this.playerNumber = this.world.players.length - 1;
                } 
                this.world.currentPlayer.vel.x = 0;
                this.world.currentPlayer.acc.x = 0;
                this.world.currentPlayer.isInTurn = false;
                this.world.currentPlayer = this.world.players[this.playerNumber]; 
                this.world.currentPlayer.isInTurn = true;

                this.playerNumber--;
            } else { // Extend timer.
                this.world.currentPlayer.isInTurn = false;
                this.timer.turnTime -= this.timer.maxStep;
            }
        }
    }
}   