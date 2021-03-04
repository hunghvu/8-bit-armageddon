/**
 * This class define the concept "Turn" of this game.
 * It has turn timer and handled defined turn-related rules
 * of this game.
 */
class Turn {
    constructor(timer, world, timePerTurn, controls, game) {
        this.timePerTurn = timePerTurn;
        this.world = world;
        this.playerNumber = this.world.players.length - 2; // The last player in list will get turn at first by default.
                                                           //  minus 2 means this.playerNumber indicates the next one.
                                                           //  After the first turn, this var will indicate current player.
        this.timer = timer;
        this.readyTime = 3; // Preparation period after ending each turn.
                            // This can be changed to a set-by-user
                            // value if needed
        this.timer.turnTime -= this.readyTime; // Start at negative value to for the first ready period.
        this.inFirstReadyPeriod = true;

        this.controls = controls;

        this.inReadyPeriod = false; // Indicate if the match is in preparation period.
        this.isShot = false; // Indicate if a player has shot.

        // console.log(new Date())

        Wind.change(); // Wind is changed per turn.

        this.playerAmount = this.world.players.length // Save the original length of player list.
        this.playerEndOfTurnTwo = [this.world.currentPlayer]; // List of already-finish-turn players
                                                                         //  The first turn currently has fixed order [4, 3, 2, 1];
                                                                         // Only on the second iteration, we can have a randomized turn.
                                                                         // Therefore, the very first player must be put in manually.
        this.playerEndOfTurnOne = []
        this.checkDeathStatus = false; // This flag is similar to isShot, however, it's used to
                                       //  see whether a test, which is to see if a current player is dead, has been performed.
                                       //  false mean not yet, true means otherwise.
        this.turnCounter = 1; // A counter for ingame turn.

        this.game = game;
    }

    /**
     * This function is called by draw() in Game.js, it will trigger this turn mechanism.
     */
    countdownTurn(){
        // this.privateShuffleTurn();
        // console.log(this.world.players);
        this.privateExtendAndEndTurn();
        this.privateUpdateTurn();
    }

    /**
     * This function extends the turn until there is a shot resolution.
     */
    privateExtendAndEndTurn() {
        if (this.controls.shooting && !this.inReadyPeriod) {
            // console.log(this.inReadyPeriod);
            this.isShot = true;
            this.world.currentPlayer.vel.x = 0;
            this.world.currentPlayer.acc.x = 0;
            this.world.currentPlayer.isInTurn = false;
            ShootingPower.change();
            // console.log(ShootingPower.power);
        }
        // console.log(this.world.entityOnMap.isAllEntityStop());

        // This test will make a turn directly end and jump to the next READY period if one of following conditions is met.
        //  1. We have a shot resolution.
        //  2. The player is dead.
        //  3. Key P is pressed (pass/skip a turn) during inTurn period.
        if ((this.world.entityOnMap.isAllEntityStop() && this.isShot && !this.controls.shooting) 
            || (this.world.currentPlayer.dead && !this.checkDeathStatus)
            || (this.controls.pass && !this.inReadyPeriod)) {
            this.isShot = false;
            this.checkDeathStatus = true;
            // There is another turnTick() inside private updateTurn, so minus maxStep*2
            //  can directly change to ready period.
            this.timer.turnTime = this.timePerTurn - this.timer.maxStep * 2;
        } else if (this.controls.forfeit) {
            this.game.status = "FORFEIT";
            this.game.forfeitCode = this.world.currentPlayer.team;
        }
    }

    /**
     * This function handle changing the turns when the turn can be ended.
     */
    privateUpdateTurn() {
        if (!this.isShot) {
            // Turn.js will control its own tick
            if(!this.controls.shooting || ShootingPower.backToZero) this.timer.turnTick(); // Only increase timer when not holding shooting button (adjust shooting force);
            if(this.timer.turnTime >= 0 && this.inFirstReadyPeriod) { // Give the first player a ready period.
                this.world.currentPlayer.isInTurn = true;
                this.inFirstReadyPeriod = false;
            }
            // Approximately 0 (max timer step).
            // this.timePerTurn is currently 5 secs, so minus maxStep turns it to 4.95;
            // The maxStep is 0.05 is timer will always happens at least one time during *.95 and (*+1).00 range.
            // Because we can have multiple step between *.95 and (*+1).00, e.g: *.975 => need to round up.
            if ((this.timer.turnTime % this.timePerTurn) >= (this.timePerTurn - this.timer.maxStep)) {
                this.timer.turnTime = Math.round(this.timer.turnTime % this.timePerTurn);
                ShootingPower.reset();
                if(this.world.currentPlayer.onGround || this.world.currentPlayer.dead) {
                    if (this.playerNumber === -1) {
                        this.privateShuffleTurn();
                        // console.log(this.world.players);
                        this.playerNumber = this.world.players.length - 1;
                    }
                    this.world.currentPlayer.vel.x = 0;
                    this.world.currentPlayer.acc.x = 0;
                    this.world.currentPlayer.isInTurn = false;

                    this.world.currentPlayer = this.world.players[this.playerNumber];

                    this.checkDeathStatus = false; // Reset death checker flag when we jump to the next player.
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
                        for(var i = 0; i < this.world.entities.length; i++)
                        {
                          if (this.world.entities[i] instanceof Portal)
                          {
                            this.world.entities[i].numOfTurns++;
                          }
                        }
                    } else {
                        // console.log(this.world.currentPlayer.team)
                        this.turnCounter++;
                        this.timer.turnTime -= this.readyTime; // Minus the ready time.
                        this.inReadyPeriod = true;
                        Wind.change(); // Change the wind when a turn starts (begins at ready period).
                        // console.log(referenceToRecentPlayers)
                        this.privateShuffleTurn(); // Add player to "already-finished-turn" player.

                        // Match conclusion.
                        if(!(this.game.turnLimit === "" 
                            || this.game.turnLimit === null 
                            || this.game.turnLimit === undefined) 
                            && this.turnCounter > parseInt(this.game.turnLimit)
                            && this.world.entityOnMap.isMatchEndWithTurnLimit()[0]) { // Check if the game is out of turn and provide respective conclusion.
                                this.game.status = "ENDED";
                                this.game.endCode = this.world.entityOnMap.isMatchEndWithTurnLimit()[1];                        
                        } else if(this.world.entityOnMap.isMatchEnd()[0]) { // Check if the game is ended and update Game object.
                            this.game.status = "ENDED";
                            this.game.endCode = this.world.entityOnMap.isMatchEnd()[1];
                        }
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
        // Start shuffle after all players end their turn.
        if ((this.playerEndOfTurnOne.length + this.playerEndOfTurnTwo.length) === this.playerAmount) {
            let firstTeam = Math.round(Math.random()); // Increase randomness by having 2 different algorithms.
            if (firstTeam === 0) {
                this.privateInterleavePlayers(() => { // Increase randomness by randomly pick a player in a turn-finished array.
                    if (this.playerEndOfTurnOne.length > 0) this.world.players.push(this.playerEndOfTurnOne.splice(Math.floor(Math.random()*this.playerEndOfTurnOne.length), 1)[0]);
                    if (this.playerEndOfTurnTwo.length > 0) this.world.players.push(this.playerEndOfTurnTwo.splice(Math.floor(Math.random()*this.playerEndOfTurnTwo.length), 1)[0]);
                })
            } else {
                this.privateInterleavePlayers(() => {
                    if (this.playerEndOfTurnTwo.length > 0) this.world.players.push(this.playerEndOfTurnTwo.splice(Math.floor(Math.random()*this.playerEndOfTurnTwo.length), 1)[0]);
                    if (this.playerEndOfTurnOne.length > 0) this.world.players.push(this.playerEndOfTurnOne.splice(Math.floor(Math.random()*this.playerEndOfTurnOne.length), 1)[0]);
                })
            }
            this.world.players.splice(0, this.playerAmount);
        } else {
            this.world.currentPlayer.team === 0 
            ? this.playerEndOfTurnOne.push(this.world.currentPlayer) 
            : this.playerEndOfTurnTwo.push(this.world.currentPlayer);
            console.log(this.world.currentPlayer.team, "playerNo,", this.world.currentPlayer.playerNo);
        }
    }

    /**
     * This function will populate new turn order by adding players to a this.world.players array
     * based on a given algorithm.
     * @param {function} callbackRule 
     */
    privateInterleavePlayers(callbackRule) {
        let maxLength = Math.max(this.playerEndOfTurnOne.length, this.playerEndOfTurnTwo.length);
        for (let i = 0; i < maxLength; i++) {
            callbackRule();
        }
    }
}   

