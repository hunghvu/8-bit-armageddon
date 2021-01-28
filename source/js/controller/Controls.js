/** 
 * Class that maintains the current state of the games controls.
 */
class Controls {
  constructor() {
    // Register keys for two different kinds of controls
    // WASD movement
    this.registerKey('up', 'KeyW');
    this.registerKey('down', 'KeyS');
    this.registerKey('left', 'KeyA');
    this.registerKey('right', 'KeyD');
    // Arrow key movement
    this.registerKey('up', 'ArrowUp');
    this.registerKey('down', 'ArrowDown');
    this.registerKey('left', 'ArrowLeft');
    this.registerKey('right', 'ArrowRight');

    // Jump with either enter or space
    this.registerKey('enter', 'Enter');
    this.registerKey('jump', 'Space');

    // J for shooting
    this.registerKey('shooting','KeyJ');
    this.registerKey('shootRocket', 'KeyK');

    // Q and E for changing weapon
    this.registerKey('nextWeapon', 'KeyE');
    this.registerKey('previousWeapon', 'KeyQ');

    // How much the scroll wheel has been scrolled since last checked
    this.scrollDelta = 0;

    // Click flag
    this.hasClicked = false;

    // Handle the scroll wheel
    window.addEventListener('wheel', event => {
      this.scrollDelta += event.deltaY ;
    });
  }

  /**
   * Adds a mouse listener that keeps track of position and buttons.
   * @param canvas - The html element to keep track of the mouse position relative to.
   */
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
      this.hasClicked = true;
    })

    // Mouse position
    canvas.addEventListener('mousemove', event => {
      let canvasRect = canvas.getBoundingClientRect();
      this.moveX = event.clientX - canvasRect.left;
      this.moveY = event.clientY - canvasRect.top;
    })
  }

  /** 
   * This function resets the controls after every update
   */
  reset() {
    // Reset the amount scrolled this loop
    this.scrollDelta = 0;
    // Reset if the user has clicked this loop
    this.hasClicked = false;
    // For ever parameter that keeps track of 
    // a key has been pressed this loop, reset it.
    Object.keys(this).forEach((element) => {
      if (element.endsWith("DownThisLoop")){
        this[element] = false;
      }
    });
  }

  /** 
   * Call this function to register a certain keycode to a certain purpose
   * For example ("shoot", "KeyZ") to tie the object variable shoot with the 
   * z key.
   * @param {string} name - The name of the action
   * @param {string} code - The code for the key as defined by javascript
   */
  registerKey(name, code) {
    window.addEventListener('keydown', event => {
      if (event.code == code) {
        // Set the value to true so that when you use
        // thisobject.name you get the state of the key
        this[name] = true;
        // Set the value to true so that when you use
        // thisobject.nameDownThisLoop you get the state 
        // of the key for this loop
        this[name+'DownThisLoop'] = true;
        // Don't allow the window to perform other actions
        // with this input
        event.preventDefault();
      }
    });

    window.addEventListener('keyup', event => {
      if (event.code == code) {
        // Set the value to false so that when you use
        // thisobject.name you get the state of the key
        this[name] = false;
        // Set the value to true so that when you use
        // thisobject.nameDownThisLoop you get the state 
        // of the key for this loop
        this[name+'DownThisLoop'] = false;
        // Don't allow the window to perform other actions
        // with this input
        event.preventDefault();
      }
    });
  }
}

