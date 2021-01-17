window.onload = function () {
  // Load a map image

  //destructionMap = new DestructableMap('map/map.png');
  gg = new Game();
  
}

class Game {
  constructor() {
    let newMapImg = new Image();
    newMapImg.src = 'assets/map.png';
    newMapImg.onload = (function () {
      let destructionMap = new DestructableMap(newMapImg);
      this.world = new World(destructionMap);
      this.canvas = document.getElementById('display');
      this.ctx = this.canvas.getContext('2d');
      //console.log(ctx);
      //world.draw(ctx, canvas.width, canvas.height);

      // Add mouse listener
      this.world.controls.addMouseListener(this.canvas);
      requestAnimationFrame(this.draw.bind(this));
    }).bind(this);
  }
  
  draw() {
    
    this.world.update(this.ctx);
    this.world.draw(this.ctx, this.canvas.width, this.canvas.height);
    requestAnimationFrame(this.draw.bind(this));
  }
}
