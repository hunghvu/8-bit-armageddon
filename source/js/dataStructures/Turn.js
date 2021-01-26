/**
 * This represents in-game turn.
 */
class Turn {
    constructor(timePerTurn, game, world) {
        this.timePerTurn = timePerTurn;
        this.game = game;
        this.world = world;
        this.playerNumber = this.world.players.length - 2;
        this.timer = null;
        console.log(new Date())
    }
    countdownTurn(){
        // The count down start when all in game UI has not been loaded. 
        //  Delay 3000ms to load the UI as a work around.
        setTimeout(() => {
            this.timer = setInterval(() => {
            if (this.playerNumber === -1) {
                this.playerNumber = this.world.players.length - 1;
            } 
            // this.game.controls.endOfTurn();
            // this.world.currentPlayer[this.playerNumber].velocity(0);
            this.world.currentPlayer.isInTurn = false;
            this.world.currentPlayer = this.world.players[this.playerNumber]; 
            this.world.currentPlayer.isInTurn = true;
            // this.world.waitingPlayers.push(this.world.players.splice(this.playerNumber, 1));
            console.log(new Date())
            // console.log(true);
            this.playerNumber--;
            }, this.timePerTurn)
        }, 3000);
    }
}