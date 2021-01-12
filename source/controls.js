class Controls {
  constructor() {
    this.registerKey('up', 'KeyW');
    this.registerKey('down', 'KeyS');
    this.registerKey('left', 'KeyA');
    this.registerKey('right', 'KeyD');
    this.registerKey('enter', 'Enter');
    this.registerKey('jump', 'Space');
  }

  registerKey(name, code) {
    window.addEventListener("keydown", event => {
      if (event.code == code) {
        this[name] = true;
        event.preventDefault();
      }
    });

    window.addEventListener("keyup", event => {
      if (event.code == code) {
        this[name] = false;
        event.preventDefault();
      }
    });
  }
}

