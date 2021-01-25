class Bullet extends Entity{
    constructor(x, y, angle, power) {
        super();
        this.x = x;
        this.y = y;
        this.vel.x = Math.cos(angle) * power;
        this.vel.y = -Math.sin(angle) * power;
    }

    update(world, deltaT){
        this.add(this.desiredMovement(deltaT))
    }

    draw(ctx){
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, 16, 16);
    }
}
