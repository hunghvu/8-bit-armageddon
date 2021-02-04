class EntityOnMap {
    constructor() {
        this.spritesheet = MANAGER.getAsset('./assets/character.png');
        this.bulletOnMapList = [];
        this.playerOnMapList = [new Player(this.spritesheet, 344, 650, 0), new Player(this.spritesheet, 500, 650, 1)];
    }
    
    isAllEntityStop(){
        if(this.BulletOnMapList.length == 0) {
            return false;
        }
        return true;
    }
}