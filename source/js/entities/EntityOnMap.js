/**
 * This class stores all entities on a map, which includes but not limited to
 *   players and bullets. This class exists to decompose World.js.
 */
class EntityOnMap {
    constructor() {
        this.spritesheet = MANAGER.getAsset('./assets/character.png');
        this.entityOnMapList = [];
        this.playerOnMapList = [new Player(this.spritesheet, 344, 650, 0), new Player(this.spritesheet, 500, 650, 1)];

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