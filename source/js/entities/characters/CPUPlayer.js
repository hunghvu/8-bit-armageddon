/**
 * This class represents a player controlled by the computer.
 */
class CPUPlayer extends Player {
  constructor(spriteSheet, x, y, design, team, playerNo, characterSwitch) {
    super(spriteSheet, x, y, design, team, playerNo, characterSwitch);
    this.firstUpdate = true;
    this.playerToTarget = null;
    this.timeIntoTurn = 0;
    this.isInTurn = false;
    this.firedProjectile = null;
    this.projectileLandingPoint = null;
  }

  update(world, controls, deltaT) {
    Player.prototype.update.call(this, world, controls, deltaT);
  }

  updateInputs(world, controls, deltaT) {
    this.isShooting = false;

    if (this.firstUpdate && 
        (!this.playerToTarget || !this.playerToTarget.isActive)) {

        // Update the position of the fired projectile to keep track of
        // the landing point
        if (this.firedProjectile) {
          if (this.firedProjectile.active == false) {
            this.projectileLandingPoint = new Point(this.firedProjectile.x, 
                                                    this.firedProjectile.y);
            this.firedProjectile = null;
          }
        }
      this.playerToTarget = this.pickPlayerTarget(world);
      this.firstUpdate = false;
      this.timeIntoTurn = 0;
      //this.angle = Math.PI * (3/4) + Math.PI * (1/4) * Math.random();
      let deltaX = (this.playerToTarget.x - this.x);
      if (deltaX > 0) {
        this.angle = Math.PI * (1/4);
      } else {
        this.angle = Math.PI * (3/4);
      }
      this.power = 500;
      console.log(this.angle);
    }

    this.timeIntoTurn += deltaT;

    if (this.onGround) {
      this.airTimer = 0;
    } else {
      this.airTimer += deltaT * 100;
    }

    /*
    if (controls.jump && this.airTimer < this.jumpTolerance) {
      this.vel.y = -this.JUMP_POWER;
      this.airTimer = this.jumpTolerance;
    }
    */

    // Start turn logic

    if (this.timeIntoTurn < 2) {
      // Move stage
      if (this.vel.x == 0) {
        this.vel.x = Math.sign(Math.random() - 0.5) * this.WALK_SPEED;
      } else if (this.vel.x > 0) {
        this.shootingAngle.updateQuadrant(1);
      } else {
        this.shootingAngle.updateQuadrant(0);
      }
      this.vel.x = Math.sign(this.vel.x) * this.WALK_SPEED;
    } else if (this.timeIntoTurn < 4) {
      // Aim stage
      this.vel.x = 0;
      this.acc.x = 0;

      // Was our last shot far or near?
      if (this.projectileLandingPoint) {
        if (this.projectileLandingPoint.x > this.playerToTarget.x) {
          if (this.x > this.playerToTarget.x) {
            // We shot to the left and were a little short
            if (this.shootingAngle.supplementaryAngle > Math.PI / 4){
                // If we are angling upword a little bit then let's aim down
                this.angle -= Math.PI / 16;
                this.power += 25;
            } else {
                // If we are angling downword a little bit then let's aim up
                this.angle += Math.PI / 16;
                this.power += 25;
            }
          } else {
            // We shot to the right and were a little far
            if (this.shootingAngle.supplementaryAngle > Math.PI / 4){
                // If we are angling upword a little bit then let's aim more up
                this.angle -= Math.PI / 16;
                this.power -= 25;
            } else {
                // If we are angling downword a little bit then let's aim more down
                this.angle += Math.PI / 16;
                this.power -= 25;
            }
          }
        } else {
          if (this.x > this.playerToTarget.x) {
            // We shot to the left and were a little far
            if (this.shootingAngle.supplementaryAngle > Math.PI / 4){
                // If we are angling upword a little bit then let's aim more up
                this.angle -= Math.PI / 16;
                this.power -= 25;
            } else {
                // If we are angling downword a little bit then let's aim more down
                this.angle += Math.PI / 16;
                this.power -= 25;
            }
          } else {
            // We shot to the right and were a little short
            if (this.shootingAngle.supplementaryAngle > Math.PI / 4){
                // If we are angling upword a little bit then let's aim more up
                this.angle += Math.PI / 16;
                this.power += 25;
            } else {
                // If we are angling downword a little bit then let's aim more down
                this.angle -= Math.PI / 16;
                this.power += 25;
            }
          }
        }
        this.projectileLandingPoint = null;
      } else {
        // First shot settings
      }

      let deltaX = (this.playerToTarget.x - this.x);
      if (deltaX > 0) {
        this.shootingAngle.updateQuadrant(1);
        this.facing = 0;
      } else {
        this.shootingAngle.updateQuadrant(0);
        this.facing = 1;
      }

      if (this.facing == 1) {
          var deltaAngle = this.angle - this.shootingAngle.radians;
      } else {
          var deltaAngle = this.angle - this.shootingAngle.radians;
      }

      console.log("------------");
      console.log(this.angle);
      console.log(deltaAngle);
      console.log(this.shootingAngle.radians);


      if (deltaAngle > 0) {
        this.shootingAngle.increaseAngle()
       // this.shootingAngle.right ? this.shootingAngle.increaseAngle() : this.shootingAngle.decreaseAngle();
      } else if (deltaAngle < 0) {
        this.shootingAngle.decreaseAngle()
        //this.shootingAngle.left ? this.shootingAngle.increaseAngle() : this.shootingAngle.decreaseAngle();
      }

    } else {
      ShootingPower.power = this.power;
      this.firedProjectile = this.currentWeapon.spawnCurrentWeapon(this.x, this.y, this.shootingAngle);
      world.spawn(this.firedProjectile);
      ShootingPower.reset()

      this.isInTurn = false;
      this.firstUpdate = true;
    }


    // End turn logic

    /*if (controls.enterPortalDownThisLoop && this.onGround) {
      for(var i = 0; i < world.entities.length; i++)
      {
        if(world.entities[i].design == this.team &&
          i < world.entities.length - 1 &&
          world.entities[i+1].design == this.team &&
          (this.x < world.entities[i].x + 40 && this.x > world.entities[i].x - 40) &&
          (this.y < world.entities[i].y + 25 && this.y > world.entities[i].y - 25))
          {
            this.x = world.entities[i+1].x;
            this.y = world.entities[i+1].y;
            break;
          }
          else if(world.entities[i].design == this.team &&
            i >= 1 &&
            world.entities[i-1].design == this.team &&
            (this.x < world.entities[i].x + 40 && this.x > world.entities[i].x - 40) &&
            (this.y < world.entities[i].y + 25 && this.y > world.entities[i].y - 25)) {
              this.x = world.entities[i-1].x;
              this.y = world.entities[i-1].y - 32;
              break;
          }
       }
       while(world.map.collideWithRectangle(this))
       {
         this.y--;
       }
    }*/

    /**
     * Adjust shooting angle
     * @todo Have a better handler when pressing multiple button at once
     */

    /*
    if (controls.up) {
      this.shootingAngle.right ? this.shootingAngle.increaseAngle() : this.shootingAngle.decreaseAngle();
    }
    if (controls.down) {
      this.shootingAngle.left ? this.shootingAngle.increaseAngle() : this.shootingAngle.decreaseAngle();
    }

    if(controls.shootingDownThisLoop){
      world.spawn(this.currentWeapon.spawnCurrentWeapon(this.x, this.y, this.shootingAngle));
      this.firstUpdate = true;
      this.isShooting = true;
    }



    if(controls.nextWeaponDownThisLoop) {
      this.currentWeapon.nextWeapon();
    }

    if(controls.previousWeaponDownThisLoop) {
      this.currentWeapon.previousWeapon();
    }

    // If the user scrolls then zoom in or out
    if (controls.scrollDelta > 0) {
      world.camera.zoomIn();
    } else if (controls.scrollDelta < 0) {
      world.camera.zoomOut();
    }
    */
  }

  pickPlayerTarget(world){
    let otherPlayers = world.players.filter((player) => this.team != player.team);
    return otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
  }
}
