class World {
  constructor(map) {
    this.controls = new Controls();
    this.map = map;

    this.players = [new Entity(null, 344, 650), new Entity(null, 500, 650)];
    this.currentPlayer = this.players[0];

    this.entities = [];

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

    this.drawBackground(ctx, w, h);

    // Transform the renderer based on the camera object
    ctx.save();
    ctx.scale(this.camera.zoom, this.camera.zoom);

    ctx.translate((-this.camera.x + w / (2 * this.camera.zoom)), (-this.camera.y + h / (2 * this.camera.zoom)));

    // Draw the map foreground
    ctx.drawImage(this.map.mapCanvas, 0, 0);

    // Draw players
    this.drawPlayers(ctx);
    this.drawEntities(ctx);


    // Untransform ctx
    ctx.restore();

    // Display current position on screen.
    ctx.font = "20px Arial";
    ctx.fillText("Mouse position: X=" + this.controls.moveX + ", Y=" + this.controls.moveY, 20, 20);
  }

  /*
    This function will draw a parralax background. 
  */
  drawBackground(ctx, w, h){
    ctx.save();
    ctx.scale(this.camera.zoom, this.camera.zoom);
    // By dividing the camera.x by 3, for every 1 pixels the camera travels the background will move 0.333 pixels
    ctx.translate(((-this.camera.x / 3 - this.imgFar.width / 2) + w / (2 * this.camera.zoom)), 
                   (-this.camera.y + h / (2 * this.camera.zoom)));

    ctx.drawImage(this.imgFar, 0, 0);
    ctx.restore();
    
    ctx.save();
    ctx.scale(this.camera.zoom, this.camera.zoom);
    // By dividing the camera.x by 2, for every 1 pixels the camera travels the background will move 0.5 pixels
    ctx.translate(((-this.camera.x / 2 - this.imgNear.width / 2) + w / (2 * this.camera.zoom)), 
                   (-this.camera.y + h / (2 * this.camera.zoom)));

    ctx.globalAlpha = 0.7;
    ctx.drawImage(this.imgNear, 0, 0);
    ctx.restore();
  }

  update(deltaT) {
    this.updateInputs(this.currentPlayer);
    this.updatePlayers(deltaT);
    this.updateEntities(deltaT);

    // Set the cameras target to be the players position
    this.camera.target.x = this.currentPlayer.center.x;
    this.camera.target.y = this.currentPlayer.center.y;

    this.camera.glideToTarget(8);
    this.controls.reset();
  }

  updateInputs(currentPlayer) {
    if (this.controls.jump && currentPlayer.onGround) {
      currentPlayer.vel.y = -10;
    }

    // If the player move in either direction
    if (this.controls.left && !this.controls.right) {
      currentPlayer.vel.x = -2;
      currentPlayer.shootingAngle.updateQuadrant(0);
    } else if (!this.controls.left && this.controls.right) {
      currentPlayer.vel.x = 2;
      currentPlayer.shootingAngle.updateQuadrant(1);
    }    
    else {
      // Stop the player and any acceleration in the x direction
      // if they don't want to move.
      currentPlayer.vel.x = 0;
      currentPlayer.acc.x = 0;
    }

    /**
     * Adjust shooting angle
     * @todo Have a better handler when pressing multiple button at once
     */

    if (this.controls.up) {
      currentPlayer.shootingAngle.right ? currentPlayer.shootingAngle.increaseAngle() : currentPlayer.shootingAngle.decreaseAngle();
    } 
    if (this.controls.down) {
      currentPlayer.shootingAngle.left ? currentPlayer.shootingAngle.increaseAngle() : currentPlayer.shootingAngle.decreaseAngle();
    }

    if(this.controls.shootingDownThisLoop){
      this.entities.push(new Bullet(currentPlayer.x,currentPlayer.y, Math.cos(currentPlayer.shootingAngle.defaultAngle*(Math.PI/180)) * 20, -Math.sin(currentPlayer.shootingAngle.defaultAngle*(Math.PI/180))*20));
      console.log("shoot");
      console.log(currentPlayer.y);

    }
    // If the user scrolls then zoom in or out
    if (this.controls.scrollDelta > 0) {
      this.camera.zoomIn();
    } else if (this.controls.scrollDelta < 0) {
      this.camera.zoomOut();
    }
  }

  drawPlayers(ctx) {
    this.players.forEach(player => {
      player.draw(ctx)
    });
  }

  drawEntities(ctx) {
    this.entities.forEach(entity => {
      entity.draw(ctx)
    });
  }

  updatePlayers(deltaT) {
    this.players.forEach(player => {
      player.update(deltaT, this.map, this.entities)
    });
  }

  updateEntities(deltaT) {
    this.entities.forEach(entity => {
      entity.update(deltaT, this.map, this.entities)
    });
  }
}
