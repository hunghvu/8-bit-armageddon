class EntityOnMap {
    constructor() {
        this.spritesheet = MANAGER.getAsset('./assets/character.png');
        this.bulletOnMapList = [];
        this.playerOnMapList = [new Player(this.spritesheet, 344, 650, 0), new Player(this.spritesheet, 500, 650, 1)];

    }
    
    isAllEntityStop(){
        // If there is a bullet, return false;
        if (this.bulletOnMapList.length) {
            return false;
        }
        // If a player is moving, return false;
        for(var i = 0; i < this.playerOnMapList.length; i++) {
            if(!this.playerOnMapList[i].isStandStill()) {
                return false;
            }
        }
        return true;
    }
}