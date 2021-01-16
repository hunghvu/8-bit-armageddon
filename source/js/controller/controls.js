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

    this.clickX = 0;
    this.clickY = 0;
    this.moveX = 0;
    this.moveY = 0;
    window.addEventListener('click', event => {
      this.clickX = event.clientX;
      this.clickY = event.clientY;
    })

    // Mouse position
    window.addEventListener('mousemove', event => {
      this.moveX = event.clientX;
      this.moveY = event.clientY;
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

