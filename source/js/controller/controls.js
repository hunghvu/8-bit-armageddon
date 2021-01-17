class Controls {
  constructor() {
    this.registerKey('up', 'KeyW');
    this.registerKey('down', 'KeyS');
    this.registerKey('left', 'KeyA');
    this.registerKey('right', 'KeyD');
    this.registerKey('enter', 'Enter');
    this.registerKey('jump', 'Space');
    // How much the scroll wheel has been scrolled since last checked
    this.scrollDelta = 0;

    // Handle the scroll wheel
    window.addEventListener('wheel', event => {
      this.scrollDelta += event.deltaY ;
    });
  }

  addMouseListener(canvas){
    this.clickX = 0;
    this.clickY = 0;
    this.moveX = 0;
    this.moveY = 0;

    // Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    canvas.addEventListener('click', event => {
      let canvasRect = canvas.getBoundingClientRect();
      this.clickX = event.clientX - canvasRect.left;
      this.clickY = event.clientY - canvasRect.top;
    })

    // Mouse position
    canvas.addEventListener('mousemove', event => {
      let canvasRect = canvas.getBoundingClientRect();
      this.moveX = event.clientX - canvasRect.left;
      this.moveY = event.clientY - canvasRect.top;
      // console.log (this.moveX + ' ' + this.moveY);
    })
  }

  // Call this function after every update.
  reset() {
    this.scrollDelta = 0;
  }

  registerKey(name, code) {
    window.addEventListener('keydown', event => {
      if (event.code == code) {
        this[name] = true;
        event.preventDefault();
      }
    });

    window.addEventListener('keyup', event => {
      if (event.code == code) {
        this[name] = false;
        event.preventDefault();
      }
    });
  }
}

