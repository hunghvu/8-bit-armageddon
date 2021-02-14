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

    function setupMatch () {

    }
}