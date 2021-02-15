/**
 * This script provides functionality for main menu page.
 * This can be think of a new version of main.js
 */
var MANAGER = new AssetManager(); // User var to avoid variable has been declared exception.
window.onload = function () {
    // Set responsive size
    let mainMenu = document.getElementById("main-menu");
    // let gameCanvas = document.getElementById("game-canvas");
    setResponsiveSize(mainMenu);
    // setResponsiveSize(gameCanvas); For some reasons, not work with game canvas, so i still use its own approach in Game.js
    document.getElementById("start-game").addEventListener("click", () => startGame());

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

    /**
     * This function will start the game with provided information.
     */
    function startGame() {
        let turnLimit = $("#limit-turn-input").val();
        let timePerTurnLimit = $("#limit-turn-time-input").val();
        if(isEmpty(timePerTurnLimit)
            || (((turnLimit < 20) || turnLimit % 2 === 1) && !isEmpty(turnLimit))
            || (timePerTurnLimit < 5 || timePerTurnLimit > 10 || !Number.isInteger(Number(timePerTurnLimit)))) { // Require parse to Number before comparison.
            alert("Invalid input(s) detected. Please try again.")
            return;
        }
        let playMode = null;
        let playModeChoices = document.getElementsByName("playModeChoices");
        playModeChoices.forEach(element => {
            if (element.checked) {
                playMode = element.value;
            } 
        })

        if(playMode === null) {
            alert("Please choose play mode.");
            return;
        }

        // Hide main menu and show ingame canvas.
        document.getElementById("main-menu").style.visibility = "hidden";
        document.getElementById("game-canvas").style.visibility = "visible";
        // console.log(document.getElementById("main-menu").style.visibility)

        // Start the game
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

    /**
     * This function check whether an input is empty.
     * This is used instead of "required" attribute to 
     *  centralize all the properties to this script.
     * @param {string} inputValue 
     */
    function isEmpty(inputValue) {
        return inputValue === "" || inputValue === null || inputValue === undefined;
    }
}
