/**
 * This represents in-game turn.
 */
class Turn {
    constructor(timePerTurn, game, world) {
        this.timePerTurn = timePerTurn;
        this.game = game; // currently not in used
        this.world = world;
        this.playerNumber = this.world.players.length - 2;
        this.timer = null;
        console.log(new Date())
    }
    countdownTurn(){
        // The count down start when all in game UI has not been loaded. 
        //  Delay 3000ms to load the UI as a work around. Need a fix later.
        setTimeout(() => {
            this.timer = setInterval(() => {
                if (this.playerNumber === -1) {
                    this.playerNumber = this.world.players.length - 1;
                } 
                
                // This only create a copy of current player, not pointer (?), can't be used (?).
                // let currentPlayer = this.world.currentPlayer; 

                this.world.currentPlayer.vel.x = 0;
                this.world.currentPlayer.acc.x = 0;
                this.world.currentPlayer.isInTurn = false;
                this.world.currentPlayer = this.world.players[this.playerNumber]; 
                this.world.currentPlayer.isInTurn = true;
                // console.log(true);
                this.playerNumber--;
                // console.log(new Date())
            }, this.timePerTurn);
        }, 3000);
    }

    // Not rerun when extracting task in time interval (?)
    // updateTurn() {

    // }
}   