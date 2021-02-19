class World {
  constructor(map) {
    this.map = map;
    this.minimap = new Minimap(20,600,this.map.width/7, this.map.height/10);

    this.spritesheet = MANAGER.getAsset('./assets/character.png');

    // 3rd parameter sets the player or food
    //TESTING PURPOSES (adds 2 more humans players)
    // this.players = [new Player(this.spritesheet, 344, 650, 0, 0), new Player(this.spritesheet, 360, 650, 0, 0), new Player(this.spritesheet, 500, 650, 0, 0), new Player(this.spritesheet, 500, 650, 1, 1), new Player(this.spritesheet,400,650,2, 1)];
    // this.players = [new Player(this.spritesheet, 344, 650, 0, 0), new Player(this.spritesheet, 500, 650, 1, 1), new Player(this.spritesheet,400,650,2, 1)];

    // TEST PURPOSES, implement a way to seperate food and human as well as seperate by design
    // this.players = [new Player(this.spritesheet, 344, 650, 0, 0)];
    //Needed?
    // this.currentPlayer = this.players[this.players.length - 1];
    // this.currentPlayer.isInTurn = true;

    this.entities = [];
    this.entityOnMap = new EntityOnMap();
    // parameter sets the players design
    this.players = this.entityOnMap.playerOnMapList;
    this.currentPlayer = this.players[this.players.length - 1];
    this.currentPlayer.isInTurn = true;

    this.entities = this.entityOnMap.entityOnMapList;

    this.camera = new Camera(500, 500, 1);

    // Background images.
    this.imgFar = MANAGER.getAsset('./assets/background.jpg');
    this.imgNear = MANAGER.getAsset('./assets/background-cloud.jpg') 

    // The sX in drawImage will be updated as the player moves in a way it create an opposite movement effect.
    this.resetCrates();

  }

  draw(ctx, w, h) {
    // Clear the screen without worrying about transforms
    ctx.clearRect(0, 0, w, h);

    this.drawBackground(ctx);

    // Transform the renderer based on the camera object
    this.camera.transformContext(ctx, 1);

    // Draw the map foreground
    this.map.draw(ctx);

    // Draw players
    this.drawPlayers(ctx);
    this.drawEntities(ctx);

    // Untransform ctx
    this.camera.restoreContext(ctx);

    // After restoring, add a minimap, ratio for width is 1/7 of normal size, and ratio for height is 1/10 of normal size.

    ctx.drawImage(this.imgFar, 0, 0, this.map.width, this.map.height, 20, 600, this.map.width/7, this.map.height/10);
    ctx.drawImage(this.imgNear, 0, 0, this.map.width, this.map.height, 20, 600, this.map.width/7, this.map.height/10);

    this.map.drawMinimap(ctx, 0, 0);
    this.drawPlayersMinimap(ctx,this.minimap.x,this.minimap.y);
    this.drawEntitiesMinimap(ctx,this.minimap.x,this.minimap.y);
    this.minimap.draw(ctx, this);

  }

  /*
    This function will draw a parralax background.
  */
  drawBackground(ctx){
    this.camera.transformContext(ctx, 3);
    ctx.drawImage(this.imgFar, -this.imgNear.width / 2, -this.imgFar.height / 2);
    this.camera.restoreContext(ctx);

    this.camera.transformContext(ctx, 2);
    ctx.globalAlpha = 0.7;
    ctx.drawImage(this.imgNear, -this.imgNear.width / 2, -this.imgNear.height / 2);
    this.camera.restoreContext(ctx);
  }

  update(deltaT, controls) {
    this.map.update(this, deltaT);
    this.updatePlayers(deltaT, controls);
    this.currentPlayer.updateActive(this, controls, deltaT);
    this.updateEntities(deltaT);

    // Set the cameras target to be the players position
    this.camera.target.x = this.currentPlayer.center.x;
    this.camera.target.y = this.currentPlayer.center.y;

    this.camera.glideToTarget(8, deltaT);
  }

  drawPlayersMinimap(ctx, mmX, mmY) {
    this.players.forEach(player =>{
      player.drawMinimap(ctx, mmX,mmY)
    });
  }
  /**
   * Removes all the current creates and replaces them with new crates in different positions
   */
  resetCrates() {
    // Get rid of all the crates
    this.entities = this.entities.filter((entity) => !(entity instanceof Crate));
    // Just spawn 3 crates all over
    for (let i = 0; i < 3; i++) {
      this.spawn(new Crate(Math.random() * this.map.width, Math.random() * this.map.height));
    }
  }
  /**
   * Removes all the current creates and replaces them with new crates in different positions
   */
  resetCrates() {
    // Get rid of all the crates
    this.entities = this.entities.filter((entity) => !(entity instanceof Crate));
    // Just spawn 3 crates all over
    for (let i = 0; i < 3; i++) {
      this.spawn(new Crate(Math.random() * this.map.width, Math.random() * this.map.height));
    }
  }

  drawPlayers(ctx) {
    this.players.forEach(player => {
      player.draw(ctx);
    });

  }

  drawEntitiesMinimap(ctx, mmX, mmY) {
    this.players.forEach(entity =>{
      entity.drawMinimap(ctx, mmX,mmY)
    });
  }

  drawEntities(ctx) {
    this.entities.forEach(entity => {
      entity.draw(ctx);
    });
  }

  updatePlayers(deltaT, controls) {
    this.players.forEach(player => {
      player.update(this, controls, deltaT);
    });
  }

  updateEntities(deltaT) {
    // Filter out entities that have died
    this.entities = this.entities.filter((entity) => entity.active);
    // Update what is left
    this.entities.forEach(entity => {
      entity.update(this, deltaT);
    });

    // Replicate. Only need to filter out, the info of each referenced bullet is updated above.
    this.entityOnMap.entityOnMapList = this.entityOnMap.entityOnMapList.filter((entity) => entity.active);

  }

  spawn(entity) {
    this.entities.push(entity);
    // Replicate for bulletOnMap
    this.entityOnMap.entityOnMapList.push(entity)
  }
}
  /*
  This is an inner class that creates a minimap of the game. With players represented as red dots and
  green dots as grenade bullets for now.
   */
  class Minimap {

    constructor(x,y, width, height) {
      Object.assign(this, {x,y, width, height})
    };

    update(){
    };

    draw(ctx, world) {
      ctx.strokeStyle = "Black";
      ctx.strokeRect(this.x, this.y, world.map.width/7, world.map.height/10);


      for (var i = 0; i < world.entities.length; i++) {
        world.entities[i].drawMinimap(ctx, this.x, this.y);
        }
    }
};

