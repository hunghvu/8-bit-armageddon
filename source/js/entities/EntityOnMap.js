class EntityOnMap {
    constructor() {
        this.spritesheet = MANAGER.getAsset('./assets/character.png');
        this.bulletOnMapList = [];
        this.playerOnMapList = [new Player(this.spritesheet, 344, 650, 0), new Player(this.spritesheet, 500, 650, 1)];
        this.stopVel = new Point(0, 0);
        this.isStop = true;
    }
    
    isAllEntityStop(){
        console.log(this.playerOnMapList[0].vel);
        this.bulletOnMapList.length !== 0 ? this.isStop = false : this.isStop = true;
        // this.playerOnMapList.forEach(element => {
        //     element.vel !== this.stopVel ? this.isStop = false : this.isStop = true;
        // })
        // for(var i = 0; i <= this.playerOnMapList.length; i++) {
        //     this.playerOnMapList[i].vel !== this.stopVel ? this.isStop = false : this.isStop = true;
        // }
        return this.isStop;
    }
}