/**
 * An upgraded weapon, the Grenade Launcher, can be spawned from an item crate.
 */
class GrenadeLauncher extends Entity{
    /**
     * Constructor for the grenade laucher that extends the entity class.
     */
    constructor(x, y, angle, power) {
        super();
        this.x = x;
        this.y = y;
        this.vel.x = Math.cos(angle) * power;
        this.vel.y = -Math.sin(angle) * power;
        this.projectileCanEndTurn = false; // It is not used as of now.
    }

    /**
     * Update the bullet flying through the air.
     *
     * @params {World} - The world object that should be referenced
     * @params {deltaT} - The number of ms since the last update
     */
    update(world, deltaT){
        this.add(this.desiredMovement(deltaT, Wind.x, Wind.y))
    }

    /**
     * Draw the grenade launcher
     *
     * @param {CanvasRenderingContext2D} ctx - The context to draw to
     */
    draw(ctx){
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0,2 * Math.PI);
        ctx.fill();
    }

    drawMinimap(ctx, mmX, mmY) {
        //let miniBulletRect = new Rectangle(mmX + this.x / 7, mmY+ this.y / 10, 8, 8);
        //destructionRect.center = this.center;
        //world.map.destroyRectangle(destructionRect);
        ctx.fillStyle = "Green";

        ctx.fillRect(mmX + this.x / 7, mmY + this.y / 10, 8, 8);
        // if ((mmX+this.x/7) > world.map.width/7 || (mmX+this.x/7) < 0) {
        //     ctx.clearRect(mmX + this.x / 7, mmY + this.y / 10, 8, 8);
        // }
    }
}
