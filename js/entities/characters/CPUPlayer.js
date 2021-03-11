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
      this.startingX = this.x
    }

    this.timeIntoTurn += deltaT;

    if (this.onGround) {
      this.airTimer = 0;
    } else {
      this.airTimer += deltaT * 100;
    }

    // Start turn logic

    if (this.timeIntoTurn < 2) {
      // Move stage
      if (this.vel.x == 0) {
        // Pick which direction to walk in but don't walk off the edge
        if (this.x + 100 > world.map.width) {
            this.vel.x = -this.WALK_SPEED;
        } else if (this.x - 100 < 0) {
            this.vel.x = this.WALK_SPEED;
        } else {
            this.vel.x = Math.sign(Math.random() - 0.5) * this.WALK_SPEED;
        }
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
        // Keep track of how far the player has moved
        this.projectileLandingPoint += this.startingX - this.x;
        let missDistance = Math.abs(this.projectileLandingPoint.x - this.playerToTarget.x);

        // Adjust by a certain amount depending on how off the last shot was
        if (missDistance > 500) {
            var powerChange = 400;
            var angleChange = Math.PI / 32;
        } else if (missDistance > 250) {
            var powerChange = 300;
            var angleChange = Math.PI / 32;
        } else if (missDistance > 100) {
            var powerChange = 200;
            var angleChange = Math.PI / 32;
        } else if (missDistance > 50) {
            var powerChange = 100;
            var angleChange = Math.PI / 64;
        } else {
            var angleChange = 0;
            var powerChange = 50;
        }
        if (this.projectileLandingPoint.x > this.playerToTarget.x) {
          if (this.x > this.playerToTarget.x) {
            // We shot to the left and were a little short
            if (this.shootingAngle.supplementaryAngle > Math.PI / 4){
                // If we are angling upword a little bit then let's aim down
                this.angle -= angleChange; 
                this.power += powerChange;
            } else {
                // If we are angling downword a little bit then let's aim up
                this.angle += angleChange; 
                this.power += powerChange;
            }
          } else {
            // We shot to the right and were a little far
            if (this.shootingAngle.supplementaryAngle > Math.PI / 4){
                // If we are angling upword a little bit then let's aim more up
                this.angle -= angleChange;
                this.power -= powerChange;
            } else {
                // If we are angling downword a little bit then let's aim more down
                this.angle += angleChange;
                this.power -= powerChange;
            }
          }
        } else {
          if (this.x > this.playerToTarget.x) {
            // We shot to the left and were a little far
            if (this.shootingAngle.supplementaryAngle > Math.PI / 4){
                // If we are angling upword a little bit then let's aim more up
                this.angle -= angleChange;
                this.power -= powerChange;
            } else {
                // If we are angling downword a little bit then let's aim more down
                this.angle += angleChange;
                this.power -= powerChange;
            }
          } else {
            // We shot to the right and were a little short
            if (this.shootingAngle.supplementaryAngle > Math.PI / 4){
                // If we are angling upword a little bit then let's aim more up
                this.angle += angleChange;
                this.power += powerChange;
            } else {
                // If we are angling downword a little bit then let's aim more down
                this.angle -= angleChange;
                this.power += powerChange;
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

      if (deltaAngle > 0) {
        this.shootingAngle.increaseAngle()
      } else if (deltaAngle < 0) {
        this.shootingAngle.decreaseAngle()
      }

    } else {

      this.currentWeapon.setIndex(Math.round(Math.random()))
      ShootingPower.power = this.power;
      this.firedProjectile = this.currentWeapon.spawnCurrentWeapon(this.x - 10, this.y - 10, this.shootingAngle);
      world.spawn(this.firedProjectile);
      ShootingPower.reset()

      this.isInTurn = false;
      this.firstUpdate = true;
    }


    // End turn logic

  }

  pickPlayerTarget(world){
    let otherPlayers = world.players.filter((player) => this.team != player.team);
    return otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
  }
}
