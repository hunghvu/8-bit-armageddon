/**
 * A Health Bar class that adds the health bar for each player
 */
class HealthBar {
    /**
     * The constructor for the health bar class
     * @param player
     */
    constructor(player) {
        Object.assign(this, {player});
    };

    update() {
    };

    /**
     * Draws the health bar based on the damage ratio.
     * @param ctx {CanvasRenderingContext2D} ctx - The context to draw to.
     */
    draw(ctx) {
            var ratio = 1 - this.player.damageTaken;
            ctx.strokeStyle = "Black";
            ctx.fillStyle = ratio < 0.2 ? "Red" : ratio < 0.5 ? "Yellow" : "Green";
            ctx.fillRect(this.player.x - this.player.radius - 10, this.player.y + this.player.radius + 25, this.player.radius * 3 * ratio, 8);
            ctx.strokeRect(this.player.x - this.player.radius - 10, this.player.y + this.player.radius + 25, this.player.radius * 3, 8);
    }
};


