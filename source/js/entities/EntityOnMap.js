/**
 * This class stores all entities on a map, which includes but not limited to
 *   players and bullets. This class exists to decompose World.js.
 */
class EntityOnMap {
    constructor() {
        this.spritesheet = MANAGER.getAsset('./assets/character.png');
        this.entityOnMapList = [];

        // Hard coded team indicator for each player for now, might change later on.
        this.playerOnMapList = [
            // new Player(this.spritesheet, 344, 650, 0, 0, 1), new Player(this.spritesheet, 500, 650, 1, 0, 2),
            // new Player(this.spritesheet, 464, 550, 2, 1, 3), new Player(this.spritesheet, 620, 550, 3, 1, 4),
            new Player(this.spritesheet, 570, 550, 4, 1, 5),
        ]; // The list hard-coded for testing purpose.

        //this.playerOnMapList = [new Player(this.spritesheet, 344, 650, 0, 0), new Player(this.spritesheet, 500, 650, 1, 1), new Player(this.spritesheet,400,650,2, 1)];
        //TESTING PURPOSES (adds two more human players)
        // this.playerOnMapList = [new Player(this.spritesheet, 344, 650, 0, 0), new Player(this.spritesheet, 360, 650, 0, 0), new Player(this.spritesheet, 500, 650, 0, 0), new Player(this.spritesheet, 500, 650, 1, 1), new Player(this.spritesheet,400,650,2, 1)];


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
}
