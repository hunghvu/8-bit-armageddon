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
                
                // This only create a copy of current player, not pointer (?)
                // let currentPlayer = this.world.currentPlayer; 
                // console.log(currentPlayer.onGround);
                // if(!this.world.currentPlayer.onGround) {
                //     // console.log(true);
                //     return;
                // }
                // console.log(false);
                while(!this.world.currentPlayer.onGround) {
                    this.world.update(this.game.timer.tick(), this.game.controls);
                    // this.world.draw(this.game.ctx, this.game.canvas.width, this.game.canvas.height);
                    // this.game.draw();
                    // console.log(currentPlayer.onGround);d
                    // console.log(currentPlayer.isInTurn);
                }
                // console.log(true);
                // if(currentPlayer.onGround) {
                // if(currentPlayer.onGround) {
        
                    this.world.currentPlayer.isInTurn = false;
                    this.world.currentPlayer = this.world.players[this.playerNumber]; 
                    this.world.currentPlayer.isInTurn = true;
        
                console.log(new Date())
                // console.log(true);
                this.playerNumber--;
                // }
                // console.log(new Date())
            }, this.timePerTurn);
        }, 3000);
    }

    // Not rerun when extracting task in time interval (?)
    // updateTurn() {

    // }
}   