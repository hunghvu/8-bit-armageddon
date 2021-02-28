class Game {
  constructor(turnLimit, timePerTurnLimit, playMode) {
    Object.assign(this, {turnLimit, timePerTurnLimit, playMode});

    let newMapImg = new Image();
    newMapImg.src = 'assets/emptyMap.png'; // An image with all transparent pixels.
    newMapImg.onload = (function () {
      let destructionMap = new DestructibleMap(newMapImg);

      // Apply play mode.
      if (this.playMode === "1v1") {
        this.world = new World(destructionMap, 2);
      } else if (this.playMode === "2v2") {
        this.world = new World(destructionMap, 4);
      } else if (this.playMode === "4v4") {
        this.world = new World(destructionMap, 8);
      }
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

      // Add mouse listener
      this.controls.addMouseListener(this.canvas);

      // Turn mechanism
      this.turn = new Turn(this.timer, this.world, this.timePerTurnLimit, this.controls);
      requestAnimationFrame(this.draw.bind(this));
    }).bind(this);
  }

  draw() {
    //Problem: skipped over weapons, basically: a double click e/q
    // this.world.update(this.timer.tick(), this.controls);
    // this.turn.countdownTurn();
    this.world.draw(this.ctx, this.canvas.width, this.canvas.height);

    //Top display bar
    this.ctx.fillStyle = "Grey";
    this.ctx.fillRect(0,0,this.canvas.width,100);

    // For testing only.
    this.ctx.fillStyle = "Black";
    this.ctx.font = "30px Arial";
    this.ctx.fillText('Timer ', 7, 31);
    // this.ctx.fillText(5 - Math.round(this.timer.turnTime % 5), 200, 200);
    this.ctx.fillText(5 - Math.round(this.timer.turnTime % 5), 29, 56);

    this.ctx.fillText('Weapon: ', 175, 31);
    //current build: 2 weapons only, fix once more weapons added
    for (var i = 0; i <= this.world.currentPlayer.currentWeapon.myWeaponBag.length; i++)
    {
      this.spritesheet = MANAGER.getAsset('./assets/weapons.png');
      //Bullet
      if (this.world.currentPlayer.currentWeapon.currentIndex == 0)
      {
        //Normal Bullet/Gun
        // if (this.world.currentPlayer.currentWeapon.myWeaponBag.upgraded == 0)
        // {
        this.ctx.drawImage(this.spritesheet, 6, 70, 23, 16, 200, 35, 92, 64);
        // }
        //Sniper Bullet/Gun
        // else {}
      }
      //GrenadeLauncher
      else if (this.world.currentPlayer.currentWeapon.currentIndex == 1)
      {
        //Grenade
        // if (this.world.currentPlayer.currentWeapon.myWeaponBag.upgraded == 0)
        // {
        this.ctx.drawImage(this.spritesheet, 10, 7, 11, 14, 200, 35, 44, 56);
        //}
        //dynomite
        // else {}
      }
      //PortalGun
      else if (this.world.currentPlayer.currentWeapon.currentIndex == 2){
        this.ctx.fillText('Portal IMG', 200, 70);
      }
      //TeleportGun
      else {
        this.ctx.fillText('Teleport IMG', 200, 70);
      }
    }

    if (this.status == "PLAYING") {
      this.world.update(this.timer.tick(), this.controls);
      this.turn.countdownTurn();
      this.world.draw(this.ctx, this.canvas.width, this.canvas.height);

      //Top display bar
      this.ctx.fillStyle = "Grey";
      this.ctx.fillRect(0,0,this.canvas.width,100);

      // For testing only.
      this.ctx.fillStyle = "Black";
      this.ctx.font = "30px Arial";
      this.ctx.fillText('Timer ', 7, 31);
      // this.ctx.fillText(5 - Math.round(this.timer.turnTime % 5), 200, 200);
      this.ctx.fillText(this.timePerTurnLimit - Math.round(this.timer.turnTime % this.timePerTurnLimit), 29, 56);

      this.ctx.fillText('Weapon: ', 175, 31);
      //current build: 2 weapons only, fix once more weapons added
      for (var i = 0; i <= this.world.currentPlayer.currentWeapon.myWeaponBag.length; i++)
      {
        this.spritesheet = MANAGER.getAsset('./assets/weapons.png');
        //Bullet
        if (this.world.currentPlayer.currentWeapon.myCurrentWeapon == Bullet)
        {
          //Normal Bullet/Gun
          // if (this.world.currentPlayer.currentWeapon.myWeaponBag.upgraded == 0)
          // {
          this.ctx.drawImage(this.spritesheet, 6, 70, 23, 16, 200, 35, 92, 64);
          // }
          //Sniper Bullet/Gun
          // else {}
        }
        //GrenadeLauncher
        else if (this.world.currentPlayer.currentWeapon.myCurrentWeapon == Grenade)
        {
          //Grenade
          // if (this.world.currentPlayer.currentWeapon.myWeaponBag.upgraded == 0)
          // {
          this.ctx.drawImage(this.spritesheet, 10, 7, 11, 14, 200, 35, 44, 56);
          //}
          //dynomite
          // else {}
        }
        //PortalGun
        else if (this.world.currentPlayer.currentWeapon.myCurrentWeapon == PortalGun){
          this.ctx.fillText('Portal IMG', 200, 70);
        }
        //TeleportGun
        else {
          this.ctx.fillText('Teleport IMG', 200, 70);
        }
      }

      this.spritesheet = MANAGER.getAsset('./assets/HealthBar.png');

      this.ctx.fillText('Health: ', 343, 31);
      // Get the tenth of the damage taken from 1.0 to 0.0 to get a value from 0 to 10
      // This will allow us to find the corresponding sprite to the amount of health
      let healthTenth = Math.round(this.world.currentPlayer.damageTaken * 10);
      this.ctx.drawImage(this.spritesheet, 83 + (healthTenth * 64), 1, 29, 26, 343, 32, 92, 64);
      this.ctx.font = "20px Arial";
      this.ctx.fillText((1.0 - this.world.currentPlayer.damageTaken)*100, 375, 66);


      this.ctx.font = "30px Arial";
      /*
      // this.ctx.fillText("Wind(X): " + Wind.x + ", Wind(Y): " + Wind.y, 343, 31);
      this.ctx.fillText("Wind(X): " + Wind.x + ", Wind(Y): " + Wind.y, 465, 31);
      */

      let windSheet = MANAGER.getAsset('./assets/ui-widgets.png');

      this.ctx.save();
      let windCenter = new Point(134, 32);
      this.ctx.textAlign = "center";
      this.ctx.fillText("Wind: ", windCenter.x, windCenter.y);

      this.ctx.translate(windCenter.x, windCenter.y + 32);
      this.ctx.rotate(Math.atan2(Wind.x, Wind.y));
      let windSpeed = Math.sqrt(Wind.x * Wind.x + Wind.y * Wind.y) / 128; 
      this.ctx.drawImage(windSheet, 0, 0, 16, 16, -32 * windSpeed, -32 * windSpeed, 
                                                   64 * windSpeed, 64 * windSpeed);
      this.ctx.restore();

      //this.ctx.drawImage(this.spritesheet, 723, 1, 29, 26, 343, 32, 92, 64);


      
      let turnIteration = [];
      // this.world.players.forEach(element => turnIteration.push(element.playerNo));
      for (let i = this.world.players.length - 1; i >= 0; i --) { // Traverse backward.
        turnIteration.push(this.world.players[i].playerNo);
      }
      this.ctx.fillText("Turn iteration (player No.): " + turnIteration, 465, 70);

      this.ctx.fillText("Turn number: " + this.turn.turnCounter, 950, 31)

      // For testing only.
      // this.ctx.font = "30px Arial";
      // this.ctx.fillText(this.timePerTurnLimit - Math.round(this.timer.turnTime % this.timePerTurnLimit), 200, 200);
      if (this.controls.enterDownThisLoop) {
        // Allow the player to move from the playing state to the paused state
        this.status = "PAUSED";
      }
    } else {
      this.world.draw(this.ctx, this.canvas.width, this.canvas.height);
      this.drawPauseMenu(this.ctx);
      if (this.controls.enterDownThisLoop) {
        // Allow the player to move from the paused state to the playing state
        this.status = "PLAYING";
      }
    }
    this.controls.reset();
    requestAnimationFrame(this.draw.bind(this));
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
