/**
 * This class stores all entities on a map, which includes but not limited to
 *   players and bullets. This class exists to decompose World.js.
 */
class EntityOnMap {
    constructor(world) {
        this.world = world;
        this.spritesheet = MANAGER.getAsset('./assets/character.png');
        this.entityOnMapList = [];

        // Hard coded team indicator for each player for now, might change later on.
        this.playerOnMapList = []; // The list hard-coded for testing purpose.

        this.pixelArray = this.world.map.mapGenerator.circles;
        console.log(this.pixelArray);
        this.highestGroundY = Number.MAX_SAFE_INTEGER;
        this.numberOfPlayerPerTeam = null;
    }

    /**
     * Check if all entities are stopped.
     * This function can be updated down the road if entityOnMap contains
     *   something other than a Bullet
     */
    isAllEntityStop(){
        // console.log(this.entityOnMapList)
        // As of now, all entities are bullet. The projectile entities
        //  have a flag to indicate whether they allow the turn to be ended.
        for(var i = 0; i < this.entityOnMapList.length; i ++) {
            if(!this.entityOnMapList[i].projectileCanEndTurn) {
                return false;
            }
        }

        for(var i = 0; i < this.playerOnMapList.length; i++) {
            if(!this.playerOnMapList[i].isStandStill()) {
                return false;
            }
        }
        return true;
    }

    /**
     * This method generates player at random location in a way that they all stays on the surface.
     * @param {int} playerAmount number of players in this match.
     */
    generatePlayer(playerAmount) {
        this.numberOfPlayerPerTeam = playerAmount / 2;
        this.pixelArray.forEach(element => {
            if (element[0].y - element[1] * 2 < this.highestGroundY) this.highestGroundY = element[0].y - element[1] * 2;
        }); // element[0].y - element[1] somehow is still not the highest point, so times 2 to element [1], and hopefully it's 
            //  the highest point. Besides, that make players spawn a bit on air, which is preferred.
        
        console.log(this.highestGroundY)
        for (let i = 0; i < playerAmount; i++) {
            let spawnX = Math.random() * this.world.map.width;
            let spawnY = this.highestGroundY;
            this.playerOnMapList.push(new Player(this.spritesheet, spawnX, spawnY, i % 2, i % 2, i + 1));
        }
    }

    /**
     * This function check whether a match is ended. This method is called inside Turn.js when a new turn (ready period) starts.
     * Since a new turn starts after there is a shot resolution, calling this method at the beginning of the turn also means
     * update the match status right after damage happens.
     * @return [isEnded, status code] - For status code, 0 means draw, 1 means team 1 wins, 2 means team 2 wins.
     *                                  Status code only applied when isEnded = true. If false, status code is 0 by default.
     */
    isMatchEnd() {
        let team1 = this.playerOnMapList.filter(element => element.team === 0 && element.dead === false);
        let team2 = this.playerOnMapList.filter(element => element.team === 1 && element.dead === false);
        let result = null;
        if (team1.length === 0 && team2.length === 0) {
            result = [true, 0];
        } else if (team1.length === 0) {
            result = [true, 2]
        } else if (team2.length === 0) {
            result = [true, 1];
        } else {
            result = [false, 0];
        }
        return result;
    }
}
