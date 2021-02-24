/**
 * This class spawns the bullet as the default weapon, but can change to previous/next weapon.
 */
class CurrentWeapon {
    constructor(x, y, angle, power) {
        this.x = x;
        this.y = y;
        this.power = power;
        this.angle = angle;

        this.myWeaponBag = [Bullet, Grenade, PortalGun, TeleportGun];

        this.currentIndex = 0;
        this.myCurrentWeapon = this.myWeaponBag[this.currentIndex];
    }

    /**
     * Change to the next weapon. Shooting power changes.
     */
    nextWeapon() {
        if (this.currentIndex >= this.myWeaponBag.length - 1) {
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }

        this.myCurrentWeapon = this.myWeaponBag[this.currentIndex];
        console.log(this.myCurrentWeapon);

        if (this.currentIndex === 0) {
            this.power = 600;
        } else {
            this.power = 800;
        }
    }


    /**
     * Change to the previous weapon. Shooting power changes.
     */
    previousWeapon() {
        if (this.currentIndex <= 0) {
            this.currentIndex = this.myWeaponBag.length - 1;
        } else {
            this.currentIndex--;
        }

        this.myCurrentWeapon = this.myWeaponBag[this.currentIndex];

        if (this.currentIndex === 0) {
            this.power = 600;
        } else {
            this.power = 800;
        }
    }

    /**
     * Spawn the current weapon, default as bullet.
     * @param x X-position
     * @param y Y-position
     * @param angle Shooting Angle
     * @returns {Bullet} The current weapon.
     */
    spawnCurrentWeapon(x, y, angle) {
        // Reset the sound, stop it from looping, and the play it
        MANAGER.getAsset("./assets/shoot.wav").loop = false;
        MANAGER.getAsset("./assets/shoot.wav").pause();
        MANAGER.getAsset("./assets/shoot.wav").currentTime = 0;
        MANAGER.getAsset("./assets/shoot.wav").play();
        return new this.myCurrentWeapon(x, y, angle.radians, this.power)
    }

    weaponUpgradeCheck(upgraded)
    {
      if (upgraded == 3) {
        this.myWeaponBag = [Bullet, Grenade, PortalGun, TeleportGun];
      }
      else if (upgraded == 2) {
        this.myWeaponBag = [Sniper, GrenadeLevel2, PortalGun, TeleportGun];
      }
      else {
        this.myWeaponBag = [Laser, GrenadeLevel3, PortalGun, TeleportGun]; //change to 3 once implemented
      }
    }
}
