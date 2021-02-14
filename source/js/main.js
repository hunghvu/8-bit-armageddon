var MANAGER = new AssetManager();

window.onload = function () {
  // Load a map image
  // asset_manager here

  MANAGER.queueDownload('./assets/character.png');
  MANAGER.queueDownload('./assets/weapons.png');
  MANAGER.queueDownload('./assets/shoot.wav');
  MANAGER.queueDownload('./assets/background-cloud.jpg');
  MANAGER.queueDownload('./assets/background.jpg');


  MANAGER.downloadAll(function () {

    //destructionMap = new DestructableMap('map/map.png');
    gg = new Game();

  });

}
