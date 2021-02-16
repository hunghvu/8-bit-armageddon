class Game {
  constructor() {
    let newMapImg = new Image();
    newMapImg.src = 'assets/emptyMap.png'; // An image with all transparent pixels.
    newMapImg.onload = (function () {
      let destructionMap = new DestructibleMap(newMapImg);
      this.world = new World(destructionMap);
      this.canvas = document.getElementById('display');


      // Set responsive size
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.canvas.style.left = "0px";
      this.canvas.style.top = "0px";
      this.canvas.style.position = "absolute";
      window.addEventListener('resize', event => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      })

      this.ctx = this.canvas.getContext('2d');
      //console.log(ctx);
      //world.draw(ctx, canvas.width, canvas.height);

      //Add timer
      this.timer = new Timer();
      // Add a controls handler
      this.controls = new Controls();

      this.status = "PLAYING";

      // Add mouse listener
      this.controls.addMouseListener(this.canvas);

      // Turn mechanism
      this.turn = new Turn(this.timer, this.world, 5, this.controls);
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

    this.spritesheet = MANAGER.getAsset('./assets/HealthBar.png');

    this.ctx.fillText('Health: ', 343, 31);
    if(this.world.currentPlayer.damageTaken >= 0 && this.world.currentPlayer.damageTaken < 0.1) {
      this.ctx.drawImage(this.spritesheet, 83, 1, 29, 26, 343, 32, 92, 64);
    }
    else if(this.world.currentPlayer.damageTaken >= 0.1 && this.world.currentPlayer.damageTaken < 0.2) {
      this.ctx.drawImage(this.spritesheet, 147, 1, 29, 26, 343, 32, 92, 64);
    }
    else if(this.world.currentPlayer.damageTaken >= 0.2 && this.world.currentPlayer.damageTaken < 0.3) {
      this.ctx.drawImage(this.spritesheet, 211, 1, 29, 26, 343, 32, 92, 64);
    }
    else if(this.world.currentPlayer.damageTaken >= 0.3 && this.world.currentPlayer.damageTaken < 0.4) {
      this.ctx.drawImage(this.spritesheet, 275, 1, 29, 26, 343, 32, 92, 64);
    }
    else if(this.world.currentPlayer.damageTaken >= 0.4 && this.world.currentPlayer.damageTaken < 0.5) {
      this.ctx.drawImage(this.spritesheet, 339, 1, 29, 26, 343, 32, 92, 64);
    }
    else if(this.world.currentPlayer.damageTaken >= 0.5 && this.world.currentPlayer.damageTaken < 0.6) {
      this.ctx.drawImage(this.spritesheet, 403, 1, 29, 26, 343, 32, 92, 64);
    }
    else if(this.world.currentPlayer.damageTaken >= 0.6 && this.world.currentPlayer.damageTaken < 0.7) {
      this.ctx.drawImage(this.spritesheet, 467, 1, 29, 26, 343, 32, 92, 64);
    }
    else if(this.world.currentPlayer.damageTaken >= 0.7 && this.world.currentPlayer.damageTaken < 0.8) {
      this.ctx.drawImage(this.spritesheet, 531, 1, 29, 26, 343, 32, 92, 64);
    }
    else if(this.world.currentPlayer.damageTaken >= 0.8 && this.world.currentPlayer.damageTaken < 0.9) {
      this.ctx.drawImage(this.spritesheet, 595, 1, 29, 26, 343, 32, 92, 64);
    }
    else if(this.world.currentPlayer.damageTaken >= 0.9 && this.world.currentPlayer.damageTaken < 1) {
      this.ctx.drawImage(this.spritesheet, 659, 1, 29, 26, 343, 32, 92, 64);
    }
    else { //this.world.currentPlayer.damageTaken == 1
      this.ctx.drawImage(this.spritesheet, 723, 1, 29, 26, 343, 32, 92, 64);
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

      this.spritesheet = MANAGER.getAsset('./assets/HealthBar.png');

      this.ctx.fillText('Health: ', 343, 31);
      if(this.world.currentPlayer.damageTaken >= 0 && this.world.currentPlayer.damageTaken < 0.1) {
        this.ctx.drawImage(this.spritesheet, 83, 1, 29, 26, 343, 32, 92, 64);
      }
      else if(this.world.currentPlayer.damageTaken >= 0.1 && this.world.currentPlayer.damageTaken < 0.2) {
        this.ctx.drawImage(this.spritesheet, 147, 1, 29, 26, 343, 32, 92, 64);
      }
      else if(this.world.currentPlayer.damageTaken >= 0.2 && this.world.currentPlayer.damageTaken < 0.3) {
        this.ctx.drawImage(this.spritesheet, 211, 1, 29, 26, 343, 32, 92, 64);
      }
      else if(this.world.currentPlayer.damageTaken >= 0.3 && this.world.currentPlayer.damageTaken < 0.4) {
        this.ctx.drawImage(this.spritesheet, 275, 1, 29, 26, 343, 32, 92, 64);
      }
      else if(this.world.currentPlayer.damageTaken >= 0.4 && this.world.currentPlayer.damageTaken < 0.5) {
        this.ctx.drawImage(this.spritesheet, 339, 1, 29, 26, 343, 32, 92, 64);
      }
      else if(this.world.currentPlayer.damageTaken >= 0.5 && this.world.currentPlayer.damageTaken < 0.6) {
        this.ctx.drawImage(this.spritesheet, 403, 1, 29, 26, 343, 32, 92, 64);
      }
      else if(this.world.currentPlayer.damageTaken >= 0.6 && this.world.currentPlayer.damageTaken < 0.7) {
        this.ctx.drawImage(this.spritesheet, 467, 1, 29, 26, 343, 32, 92, 64);
      }
      else if(this.world.currentPlayer.damageTaken >= 0.7 && this.world.currentPlayer.damageTaken < 0.8) {
        this.ctx.drawImage(this.spritesheet, 531, 1, 29, 26, 343, 32, 92, 64);
      }
      else if(this.world.currentPlayer.damageTaken >= 0.8 && this.world.currentPlayer.damageTaken < 0.9) {
        this.ctx.drawImage(this.spritesheet, 595, 1, 29, 26, 343, 32, 92, 64);
      }
      else if(this.world.currentPlayer.damageTaken >= 0.9 && this.world.currentPlayer.damageTaken < 1) {
        this.ctx.drawImage(this.spritesheet, 659, 1, 29, 26, 343, 32, 92, 64);
      }
      else { //this.world.currentPlayer.damageTaken == 1
        this.ctx.drawImage(this.spritesheet, 723, 1, 29, 26, 343, 32, 92, 64);
      }
      this.ctx.font = "20px Arial";
      this.ctx.fillText((1.0 - this.world.currentPlayer.damageTaken)*100, 375, 66);

      this.ctx.font = "30px Arial";
      // this.ctx.fillText("Wind(X): " + Wind.x + ", Wind(Y): " + Wind.y, 343, 31);
      this.ctx.fillText("Wind(X): " + Wind.x + ", Wind(Y): " + Wind.y, 455, 31);


      // For testing only.
      this.ctx.font = "30px Arial";
      this.ctx.fillText(5 - Math.round(this.timer.turnTime % 5), 200, 200);
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
