/**
 * This represents in-game turn.
 */
class Turn {
    constructor(timer, world, timePerTurn, controls) {
        this.timePerTurn = timePerTurn;
        // this.game = game; // currently not in used
        this.world = world;
        this.playerNumber = this.world.players.length - 2;
        this.timer = timer;
        this.readyTime = 3; // preparation period after ending each turn.
        this.inReadyPeriod = false;

        this.controls = controls;
        this.isShot = false;
        this.isShotHasResolution = false;
        // this.timer = null;
        console.log(new Date())
    }
    countdownTurn(){
        // console.log(this.world.entities);
        // console.log(this.world.entityOnMap.bulletOnMapList);
        // console.log(this.world.entityOnMap.isAllEntityStop());
        // if (this.controls.shooting) {
        //     this.isShot = true;
        //     this.world.currentPlayer.isInTurn = false;
        // }

        if (!this.isShot) {
            // Turn.js will control its own tick
            this.timer.turnTick();
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

                    // Explanation.
                    //  countdownTurn() is origninally run once per approximately 5 secs.
                    //  with the introduction of inReadyPeriod flag, it will be set to true when a player is in ready period, false otherwise.
                    //  the camera will always change player per X secs due to line 31, however, it will only give that user control permission
                    //   if after a ready period.
                    //  Now the timer will run in this interleaving order: 5 secs action => 3 secs waiting => 5 secs action => ...
                    if (this.inReadyPeriod) {  
                        this.world.currentPlayer.isInTurn = true;
                        this.inReadyPeriod = false;                  
                        this.playerNumber--;
                    } else {
                        this.timer.turnTime -= this.readyTime; // Minus the ready time.
                        this.inReadyPeriod = true;
                    }

                } else { // Extend timer.
                    this.world.currentPlayer.isInTurn = false;
                    this.timer.turnTime -= this.timer.maxStep;
                }
            }

        }
    }
}   