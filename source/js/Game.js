class Game {
  constructor(turnLimit, timePerTurnLimit, playMode) {
    Object.assign(this, {turnLimit, timePerTurnLimit, playMode});

    let newMapImg = new Image();
    newMapImg.src = 'assets/emptyMap.png'; // An image with all transparent pixels.
    newMapImg.onload = (function () {
      let destructionMap = new DestructibleMap(newMapImg);

      // Apply play mode.
      let modes = {"1v1": 2, "2v2": 4, "3v3": 6, "4v4": 8};
      this.playerAmount = modes[this.playMode];
      this.world = new World(destructionMap, this.playerAmount);
      this.canvas = document.getElementById('display');

      this.ctx = this.canvas.getContext('2d');

      // Set responsive size
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.canvas.style.left = "0px";
      this.canvas.style.top = "0px";
      this.canvas.style.position = "absolute";
      window.addEventListener('resize', event => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.mozImageSmoothingEnabled = false;
      })

      this.ctx.mozImageSmoothingEnabled = false;

      //Add timer
      this.timer = new Timer();
      // Add a controls handler
      this.controls = new Controls();

      this.status = "PLAYING";
      this.endCode = null; // Indicate match result (0 for draw, 1 means team 1 wins, 2 means team 2 wins )
      this.forfeitCode = null; // Indicate the current team that is trying to surrender (0 for team 1, 1 for team 2)
      this.forfeitVoteCounter = 0;

      // Add mouse listener
      this.controls.addMouseListener(this.canvas);

      // Turn mechanism
      this.turn = new Turn(this.timer, this.world, this.timePerTurnLimit, this.controls, this);
      requestAnimationFrame(this.draw.bind(this));
    }).bind(this);
  }

  draw() {
    //Problem: skipped over weapons, basically: a double click e/q
    // this.world.update(this.timer.tick(), this.controls);
    // this.turn.countdownTurn();
    this.world.draw(this.ctx, this.canvas.width, this.canvas.height);

    if (this.status == "PLAYING") {
      this.world.update(this.timer.tick(), this.controls);
      this.turn.countdownTurn();
      this.world.draw(this.ctx, this.canvas.width, this.canvas.height);

      //Top display bar
      // this.ctx.fillStyle = "Grey";
      // console.log(this.canvas.width);
      // this.ctx.fillRect(0,0,this.canvas.width,100);
      this.spritesheet = MANAGER.getAsset('./assets/DisplayBar.png');
      this.ctx.drawImage(this.spritesheet, 0, 0, 1536, 100, 0, 0, 1536, 100);


      this.ctx.fillStyle = "Black";

      this.ctx.font = "16px 'Press Start 2P'";
      this.ctx.fillText('Timer: ', 60, 31);
      this.ctx.font = "30px 'Press Start 2P'";
      this.timer.turnTime < 0
      ? this.ctx.fillText(Math.round(this.timer.turnTime * -1), 95, 75) // Different print text fill method for the first ready period.
      : this.ctx.fillText(this.timePerTurnLimit - Math.round(this.timer.turnTime % this.timePerTurnLimit), 100, 75);

      this.ctx.font = "16px 'Press Start 2P'";
      this.ctx.fillText('Weapon: ', 175, 31);
      this.ctx.font = "12px Arial";
      for (var i = 0; i <= this.world.currentPlayer.currentWeapon.myWeaponBag.length; i++) {
        this.spritesheet = MANAGER.getAsset('./assets/weapons.png');
        //Bullet
        if (this.world.currentPlayer.currentWeapon.myCurrentWeapon == Bullet) {
          this.ctx.drawImage(this.spritesheet, 6, 70, 23, 16, 200, 35, 65, 45);
          this.ctx.fillText('HandGun DMG: 5', 180, 93);
        }
        //Sniper
        else if (this.world.currentPlayer.currentWeapon.myCurrentWeapon == Sniper) {
          this.ctx.drawImage(this.spritesheet, 191, 37, 33, 15, 180, 35, 99, 45);
          this.ctx.fillText('Sniper DMG: 30', 180, 93);
        }
        // Laser
        else if (this.world.currentPlayer.currentWeapon.myCurrentWeapon == Laser) {
          this.ctx.drawImage(this.spritesheet, 224, 37, 32, 19, 190, 35, 76, 45);
          this.ctx.fillText('Laser DMG: 20', 180, 93);
        }
        // Grenade
        else if (this.world.currentPlayer.currentWeapon.myCurrentWeapon == Grenade) {
          this.ctx.drawImage(this.spritesheet, 10, 7, 11, 14, 200, 35, 35, 45);
          this.ctx.fillText('Grenade DMG: 15', 180, 93);
        }
        // Dynomite
        else if (this.world.currentPlayer.currentWeapon.myCurrentWeapon == GrenadeLevel2) {
          this.ctx.drawImage(this.spritesheet, 2, 35, 28, 28, 200, 35, 33, 45);
          this.ctx.fillText('Dynomite DMG: 30', 180, 93);
        }
        // Rocket
        else if (this.world.currentPlayer.currentWeapon.myCurrentWeapon == GrenadeLevel3) {
          this.ctx.drawImage(this.spritesheet, 130, 261, 27, 20, 200, 35, 61, 45);
          this.ctx.fillText('Rocket DMG: 50', 180, 93);
        }
        //PortalGun
        else if (this.world.currentPlayer.currentWeapon.myCurrentWeapon == PortalGun) {
          this.ctx.drawImage(this.spritesheet, 2, 233, 28, 12, 180, 35, 105, 45);
          this.ctx.fillText('PortalGun DMG: -', 180, 93);
        }
        //TeleportGun
        else if (this.world.currentPlayer.currentWeapon.myCurrentWeapon == TeleportGun) {
          this.ctx.drawImage(this.spritesheet, 70, 223, 18, 31, 210, 35, 26, 45);
          this.ctx.fillText('TeleportGun DMG: -', 180, 93);
        }
        //....
        else if (this.world.currentPlayer.currentWeapon.myCurrentWeapon == OPWeapon) {
          this.ctx.drawImage(this.spritesheet, 160, 287, 30, 32, 200, 35, 42, 45);
          this.ctx.fillText('...Peace was never an option...', 170, 93);
        }
      }

      this.ctx.font = "16px 'Press Start 2P'";
      this.spritesheet = MANAGER.getAsset('./assets/HealthBar.png');
      this.ctx.fillText('Health: ', 300, 31);
      this.ctx.font = "20px Arial";
      // Get the tenth of the damage taken from 1.0 to 0.0 to get a value from 0 to 10
      // This will allow us to find the corresponding sprite to the amount of health
      let healthTenth = Math.round(this.world.currentPlayer.damageTaken * 10);
      this.ctx.drawImage(this.spritesheet, 83 + (healthTenth * 64), 1, 29, 26, 300, 32, 92, 64);
      // this.ctx.fillText((1.0 - this.world.currentPlayer.damageTaken)*100, 375, 66);
      this.ctx.fillText(Math.ceil((1.0 - this.world.currentPlayer.damageTaken)*100) + "%", 325, 66);


      this.ctx.font = "16px 'Press Start 2P'";
      let windSheet = MANAGER.getAsset('./assets/ui-widgets.png');
      this.ctx.save();
      let windCenter = new Point(1250, 32);
      this.ctx.textAlign = "center";
      this.ctx.fillText("Wind: ", windCenter.x + 10, windCenter.y);

      this.ctx.translate(windCenter.x, windCenter.y + 32);
      this.ctx.rotate(Math.atan2(Wind.x, Wind.y));
      let windSpeed = Math.sqrt(Wind.x * Wind.x + Wind.y * Wind.y) / 128;
      this.ctx.drawImage(windSheet, 0, 0, 16, 16, -32 * windSpeed, -32 * windSpeed,
                                                   64 * windSpeed, 64 * windSpeed);
      this.ctx.restore();


      let turnIteration = [];
      for (let i = this.world.players.length - 1; i >= 0; i --) { // Traverse backward.
        turnIteration.push(this.world.players[i].playerNo);
      }
      // Currently the whole array is printed, I think printing in different ways like
      //  P1 -> P2 will introduce unnecessary processing, and taking spaces.
      this.ctx.fillText("Turn order: " + turnIteration, 420, 62);
      this.ctx.fillText("Current player: P" + this.world.currentPlayer.playerNo, 420, 93);
      if (!(this.turnLimit === "" || this.turnLimit === null || this.turnLimit === undefined)) {
        this.ctx.fillText("Turn number: " + this.turn.turnCounter + " / " + this.turnLimit, 420, 31);
      } else {
        this.ctx.fillText("Turn number: " + this.turn.turnCounter, 420, 31);
      }
      this.ctx.fillText("Shooting force: " + ShootingPower.power + " / " + ShootingPower.max, 755, 93);

      if (this.controls.enterDownThisLoop) {
        // Allow the player to move from the playing state to the paused state
        this.status = "PAUSED";
      }
    } else if (this.status === "PAUSED") {
      this.world.draw(this.ctx, this.canvas.width, this.canvas.height);
      this.drawPauseMenu(this.ctx);
      if (this.controls.enterDownThisLoop) {
        // Allow the player to move from the paused state to the playing state
        this.status = "PLAYING";
      }
    } else if (this.status === "ENDED") {
      // Will need to implement navigation later to improve user's experience.
      this.world.draw(this.ctx, this.canvas.width, this.canvas.height);
      this.drawEndMenu(this.ctx);
    } else if (this.status === "FORFEIT") {
      this.world.draw(this.ctx, this.canvas.width, this.canvas.height);
      this.drawForfeitMenu(this.ctx);
      if(this.controls.yes && this.controls.hasPressedKeyY) {
        this.forfeitVoteCounter ++;
        this.controls.yes = false; // This key is not reset in the new loop, so manually do that here.
                                   // Cannot reset in controls because the value is not defined there.
        if (this.forfeitVoteCounter > this.playerAmount / 4) {
          this.status = "ENDED";
          this.forfeitCode === 0 ? this.endCode = 2 : this.endCode = 1;
        }
      } else if (this.controls.cancel) {
        this.status = "PLAYING";
      }
    }
    this.controls.reset();
    requestAnimationFrame(this.draw.bind(this));
  }

  drawForfeitMenu(ctx) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "white";
    let teamNumer = this.forfeitCode + 1;
    ctx.fillText("Team " + teamNumer + " want to forfeit.", ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.fillText("Press Y to vote Yes, and Esc to cancel.", ctx.canvas.width / 2, ctx.canvas.height / 3 * 2);
    ctx.fillText("Current vote: " + this.forfeitVoteCounter + " / " + this.playerAmount / 2, ctx.canvas.width / 2, ctx.canvas.height / 4 * 3);
    ctx.restore();
  }

  drawEndMenu(ctx) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "white";
    ctx.fillText("MATCH ENDED", ctx.canvas.width / 2, ctx.canvas.height / 2);
    if (this.endCode === 1 || this.endCode === 2) {
      ctx.fillText("Team " + this.endCode + " won!", ctx.canvas.width / 2, ctx.canvas.height / 3 * 2);
    } else if (this.endCode === 0 ) {
      ctx.fillText("DRAW!", ctx.canvas.width / 2, ctx.canvas.height / 3 * 2);
    }
    ctx.restore();
  }

  drawPauseMenu(ctx) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "white";
    ctx.fillText("PAUSED", ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.restore();
  }

  loop(){
    this.clockTick = this.timer.tick();
    this.draw();
  };
}
