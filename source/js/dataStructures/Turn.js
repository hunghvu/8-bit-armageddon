/**
 * This class define the concept "Turn" of this game.
 * It has turn timer and handled defined turn-related rules 
 * of this game.
 */
class Turn {
    constructor(timer, world, timePerTurn, controls) {
        this.timePerTurn = timePerTurn;
        this.world = world;
        this.playerNumber = this.world.players.length - 2; // The last player in list will get turn at first by default.
                                                           //  minus 2 means this.playerNumber indicates the next one.
                                                           //  After the first turn, this var will indicate current player.
        this.timer = timer;
        this.readyTime = 3; // Preparation period after ending each turn.
                            // This can be changed to a set-by-user
                            // value if needed
        this.controls = controls;

        this.inReadyPeriod = false; // Indicate if the match is in preparation period.
        this.isShot = false; // Indicate if a player has shot.

        // console.log(new Date())

        Wind.change(); // Wind is changed per turn.

        this.playerAmount = this.world.players.length // Save the original length of player list.
        this.playerBuffer = [this.world.players[this.playerNumber + 1]]; // List of already-finish-turn players
                                                                         //  The first turn currently has fixed order [4, 3, 2, 1];
                                                                         // Only on the second iteration, we can have a randomized turn.
                                                                         // Therefore, the very first player must be put in manually.
        this.recentTeam = null;
    }

    /**
     * This function is called by draw() in Game.js, it will trigger this turn mechanism.
     */
    countdownTurn(){
        // this.privateShuffleTurn();
        // console.log(this.world.players);
        this.privateExtendTurn();
        this.privateUpdateTurn();
    }

    /**
     * This function extends the turn until there is a shot resolution.
     */
    privateExtendTurn() {
        if (this.controls.shooting && !this.inReadyPeriod) {
            // console.log(this.inReadyPeriod);
            this.isShot = true;
            this.world.currentPlayer.vel.x = 0;
            this.world.currentPlayer.acc.x = 0;
            this.world.currentPlayer.isInTurn = false;
        }
        // console.log(this.world.entityOnMap.isAllEntityStop());
        if (this.world.entityOnMap.isAllEntityStop() && this.isShot === true) {
            this.isShot = false;
            // There is another turnTick() inside private updateTurn, so minus maxStep*2
            //  can directly change to ready period.
            this.timer.turnTime = this.timePerTurn - this.timer.maxStep * 2;
        }
    }
    
    /**
     * This function handle changing the turns when the turn can be ended.
     */
    privateUpdateTurn() {
        if (!this.isShot) {
            // Turn.js will control its own tick
            this.timer.turnTick();

            // Approximately 0 (max timer step).
            // this.timePerTurn is currently 5 secs, so minus maxStep turns it to 4.95;
            // The maxStep is 0.05 is timer will always happens at least one time during *.95 and (*+1).00 range.
            // Because we can have multiple step between *.95 and (*+1).00, e.g: *.975 => need to round up.
            if ((this.timer.turnTime % this.timePerTurn) >= (this.timePerTurn - this.timer.maxStep)) {
                this.timer.turnTime = Math.round(this.timer.turnTime % this.timePerTurn);
                if(this.world.currentPlayer.onGround) {
                    if (this.playerNumber === -1) {
                        this.privateShuffleTurn();
                        // console.log(this.world.players);
                        this.playerNumber = this.world.players.length - 1;
                    } 
                    this.world.currentPlayer.vel.x = 0;
                    this.world.currentPlayer.acc.x = 0;
                    this.world.currentPlayer.isInTurn = false;
                    this.world.currentPlayer = this.world.players[this.playerNumber];  
                    // console.log(this.world.currentPlayer.playerNo, "current")

                    // Explanation.
                    //  countdownTurn() is origninally run once per approximately 5 secs.
                    //  with the introduction of inReadyPeriod flag, it will be set to true when a player is in ready period, false otherwise.
                    //  the camera will always change player per X secs due to line 31, however, 
                    //    it will only give that user control permission if after a ready period.
                    //  Now the timer will run in this interleaving order: 5 secs action => 3 secs waiting => 5 secs action => ...
                    if (this.inReadyPeriod) {  
                        this.world.currentPlayer.isInTurn = true;
                        this.inReadyPeriod = false;                  
                        this.playerNumber--;
                    } else {
                        this.timer.turnTime -= this.readyTime; // Minus the ready time.
                        this.inReadyPeriod = true;
                        Wind.change(); // Change the wind when a turn starts (begins at ready period).

                        this.privateShuffleTurn(); // Add player to "already-finished-turn" player.
                        this.recentTeam = this.world.currentPlayer.team; // Keep track of recent player to interleavev.
                    }

                } else { // Extend timer.
                    this.world.currentPlayer.isInTurn = false;
                    this.timer.turnTime -= this.timer.maxStep;
                }
                // console.log(Wind.x, Wind.y);
            }

        }
    }

    /**
     * This function helps randomize team-interleaved turns.
     * In 1 iteration, no team can have adjacent turns. 
     * However, the next iteration is completely random.
     * For example: Iteration 1 - 1, 1, 2, 2 is not allowed.
     * But, Iteration 1 - 1, 2, 1, 2 / Iteration 2: 2, 1, 2, 1 is allowed (Team 2 has consecutive turns when changing iteration);
     */
    privateShuffleTurn() {
        let playerToRemove = this.playerNumber // this.playerNumber is currrent player, plus 1 means previous player b/c of 
                                                   //  traversing from the end.
        if (this.playerBuffer.length === this.playerAmount) {
            while(this.playerBuffer.length !== 0) {
                let nextPlayerIndex = Math.floor(Math.random() * (this.playerBuffer.length - 0) + 0);
                if(this.playerBuffer[nextPlayerIndex].team === this.recentTeam) {
                    continue
                }
                let nextPlayer = this.playerBuffer.splice(nextPlayerIndex, 1)[0];
                this.world.players.push(nextPlayer);
                this.recentTeam =  nextPlayer.team; // Keep track of recent player to interleave team.
            }
            this.world.players.splice(0, 4);
            this.world.players.forEach(element => console.log(element.playerNo))
            this.recentTeam = null;
            // console.log(this.world.players);
        } else {
            this.playerBuffer.push(this.world.players[playerToRemove]);
        }
        // console.log(this.playerBuffer.length)
    }
}   