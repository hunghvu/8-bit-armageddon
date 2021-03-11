class MovingPlatform extends Entity {
  constructor(x, y, startX, endX, screenWidth) {
    // Randomize the length of platform from 1/5 of screen width to 1/20 of screen width.
    super(x, y, Math.random(screenWidth * 4 / 20 - screenWidth * 1 / 20) + screenWidth * 1 / 20, 10);
    this.vel.x = -20;
    this.acc.y = 0;

    // The position that the platform starts at
    this.startX = startX;

    this.damageTaken = 0;

    // The position that the platform ends at
    this.endX = endX;
  }

  update(game, deltaT) {
    if (this.damageTaken != 0) {
      // If we have taken any damage then stop all updates
      return
    }
    let movement = this.desiredMovement(deltaT);
    // Move the platform up to find all the entities that are on it.
    this.y -= 1;

    // Keep track of the players on the platform
    let playersOnBoard = []
    for (let i = 0; i < game.players.length; i++) {
      if (this.doesCollide(game.players[i])) {
        // If the player is right above the platform then take the player for a ride
        playersOnBoard.push(game.players[i]);
        game.players[i].x += movement.x;
        game.players[i].y += movement.y;
      }
    }
    this.y += 1;

    // Move the platform
    this.x += movement.x;
    this.y += movement.y;
    for (let i = 0; i < game.players.length; i++) {
      if (this.doesCollide(game.players[i])) {
        this.y -= 1;
        for (let i = 0; i < playersOnBoard.length; i++) {
          if (this.doesCollide(playersOnBoard[i])) {
            // If the player is right above the platform then take the player for a ride
            playersOnBoard[i].x -= movement.x;
            playersOnBoard[i].y -= movement.y;
          }
        }
        this.y += 1;

        // If the player would be pushed by the platform then just don't move
        // TODO decide what to do when the platform moves into a player
        this.x -= movement.x;
        this.y -= movement.y;
        break;
      }
    }
      
    if (this.x < this.startX) {
      this.vel.x = 20;
    } else if (this.x > this.endX) {
      this.vel.x = -20;
    }
    /*if (this.x < (1/5) * game.map.width) {
      this.platformDirection = 1;
    } else if (this.x > (4/5) * game.map.width) {
      this.platformDirection = -1;
    }*/
  }

  setDirection(dir) {
    this.platformDirection = dir;
  }

  /*swapDirection() {
    if (this.vel. > 0) {
      this.platformDirection = 1;
    } else
  }*/

  draw(ctx) {
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  drawMinimap(ctx, mmX, mmY) {
    ctx.fillStyle = "Black";
    ctx.fillRect(mmX + this.x / 7, mmY + this.y / 10, 5, 2);
  }

  // drawMinimap(ctx, mmX, mmY) {
  //   ctx.drawImage(this.mapCanvas, 20, 600, this.mapCanvas.width/7, this.mapCanvas.height/10);
  // }
}
