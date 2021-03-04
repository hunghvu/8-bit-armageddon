/**
 * This class spawns the bullet as the default weapon, but can change to previous/next weapon.
 */
class CurrentWeapon {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
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
        console.log(this.power);
        return new this.myCurrentWeapon(x, y, angle.radians, ShootingPower.power);
    }
}
