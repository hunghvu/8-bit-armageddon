/*
    This presents a shooting angle of a specific weapon.
    Think of a circle sector (fan) shape.
        The origin points should be at player position.
        The radius is the length of indicator (line).
        The bounds indicates range of usable angles, relative to
            player facing angle - Hung Vu.
*/
class ShootingAngle {
    // The points may or not be able to be constructed using point.js 
    //  because the transformation may not be linear. For now, we will
    //  directly assign them for developing purpose.
    constructor (originX, originY, radius, lowerBound, upperBound, defaultAngle) {
        Object.assign(this, {originX, originY, radius, lowerBound, upperBound, defaultAngle})

        // These are points on the circumference.
        this.endPointX = 0;
        this.endPointY = 0;
    }

    updateOrigin(newX, newY) {
        this.originX = newX;
        this.originY = newY;
    }

    updateEndPoints(newX, newY) {
        this.endPointX = newX;
        this.endPointY = newY;
    }

    increaseAngle() {
        if (this.defaultAngle === this.upperBound) return;
        this.defaultAngle++;
    }

    decreaseAngle() {
        if (this.defaultAngle === this.lowerBound) return;
        this.defaultAngle--;
    }

}