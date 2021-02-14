window.onload = function () {
    // Set responsive size
    let mainMenu = document.getElementById("main-menu");
    let gameCanvas = document.getElementById("game-canvas");
    setResponsiveSize(mainMenu);
    setResponsiveSize(gameCanvas);

    /**
     * Make a HTML object becomes size responsive.
     * @param {html object} element 
     */
    function setResponsiveSize(element) {
        $("#" + element.id).width(window.innerWidth);
        $("#" + element.id).height(window.innerHeight);
        element.style.left = "0px";
        element.style.top = "0px";
        element.style.position = "absolute";
        window.addEventListener('resize', () => {
            $("#" + element.id).width(window.innerWidth);
            $("#" + element.id).height(window.innerHeight);
        })
    }

}

/**
 * This function will start the game with provided information.
 */
function startGame () {
    let turnLimit = $("#limit-turn-input").val();
    let timePerTurnLimit = $("#limit-turn-time-input").val();
    let playMode = null;
    let playModeChoices = document.getElementsByName("playModeChoices");
    playModeChoices.forEach(element => {
        if(element.checked) {
            playMode = element.value;
        }
    })

    // Hide main menu and show ingame canvas.
    $("main-menu").css({
        "visibility": "hidden",
    });
    $("game-canvas").css({
        "visibility": "hidden",
    });

    // Start the game
    let MANAGER = new AssetManager();
    MANAGER.queueDownload('./assets/character.png');
    MANAGER.queueDownload('./assets/weapons.png');
    MANAGER.queueDownload('./assets/shoot.wav');
    MANAGER.queueDownload('./assets/shoot.wav');
    MANAGER.queueDownload('./assets/background-cloud.jpg');
    MANAGER.queueDownload('./assets/background.jpg');

    MANAGER.downloadAll(function () {

        //destructionMap = new DestructableMap('map/map.png');
        gg = new Game(turnLimit, timePerTurnLimit, playMode);
    
    });
}