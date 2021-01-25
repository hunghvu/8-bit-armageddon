var MANAGER = new AssetManager();

window.onload = function () {
  // Load a map image
  // asset_manager here

  MANAGER.queueDownload('./assets/character.png');

  MANAGER.downloadAll(function () {

    //destructionMap = new DestructableMap('map/map.png');
    gg = new Game();

  });

}

