class World {
  constructor(map) {
    this.map = map;

    this.entityOnMap = new EntityOnMap();
    // parameter sets the players design
    this.players = this.entityOnMap.playerOnMapList;
    this.currentPlayer = this.players[this.players.length - 1];
    this.currentPlayer.isInTurn = true;

    this.entities = this.entityOnMap.entityOnMapList;

    this.camera = new Camera(500, 500, 1);

    // Background images.
    this.imgFar = new Image();
    this.imgFar.src = "./assets/background.jpg";
    this.imgNear = new Image();
    this.imgNear.src = "./assets/background-cloud.jpg";
    // The sX in drawImage will be updated as the player moves in a way it create an opposite movement effect.

  }

  draw(ctx, w, h) {
    // Clear the screen without worrying about transforms
    ctx.clearRect(0, 0, w, h);

    this.drawBackground(ctx);

    // Transform the renderer based on the camera object
    this.camera.transformContext(ctx, 1);

    // Draw the map foreground
    ctx.drawImage(this.map.mapCanvas, 0, 0);

    // Draw players
    this.drawPlayers(ctx);
    this.drawEntities(ctx);

    // Untransform ctx
    this.camera.restoreContext(ctx);
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
    this.updatePlayers(deltaT, controls);
    this.currentPlayer.updateActive(this, controls, deltaT);
    this.updateEntities(deltaT);

    // Set the cameras target to be the players position
    this.camera.target.x = this.currentPlayer.center.x;
    this.camera.target.y = this.currentPlayer.center.y;

    this.camera.glideToTarget(8);
  }


  drawPlayers(ctx) {
    this.players.forEach(player => {
      player.draw(ctx);
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
