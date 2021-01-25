class Bullet extends Entity{
    constructor(x, y, vx, vy) {
        super();
        this.x = x;
        this.y = y;
        this.vel.x = vx;
        this.vel.y = vy;

    }

    update(){
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;
        this.x += this.vel.x;
        this.y += this.vel.y;

    }

    draw(ctx){
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, 16, 16);
    }
}