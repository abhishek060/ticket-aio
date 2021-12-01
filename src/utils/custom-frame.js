(function () {
    // const electron = window.require('electron');
    const electron = require('electron');
    const remote = electron.remote;
    const mainWindow = remote.BrowserWindow.getFocusedWindow();

    function init() {
        document.getElementById("min-btn").addEventListener("click", function (e) {
            mainWindow.minimize();
        });

        document.getElementById("max-btn").addEventListener("click", function (e) {
            mainWindow.maximize();
        });

        document.getElementById("close-btn").addEventListener("click", function (e) {
            mainWindow.close();
        });
    }

    // document.onreadystatechange = function () {
    //     if (document.readyState === "complete") {
            init();
        // }
    // };

})();