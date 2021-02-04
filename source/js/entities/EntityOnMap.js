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
        // As of now, all entities are bullet, the thing is, a "dead" bullet
        //   is removed from the list before this isAllEntityStop is called.
        //   That means who lose a reference to that bullet, so can't put isStandStill() inside bullet.
        //   However, the flying bullet is mark .active===true, while the collided is "false" so I assume
        //   that is also the case with portals (portals appear after the colllision, so false). Thus, this loop
        //   is to check the activity of bullets. 
        for(var i = 0; i < this.entityOnMapList.length; i ++) {
            if(this.entityOnMapList[i].active === true) {
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