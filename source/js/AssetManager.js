/**
* Copy from Super Marriott World, Helps queue and
* download all assets needed for 8-Bit Armageddon
*
**/
class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
    };

    queueDownload(path) {
        console.log("Queueing " + path);
        this.downloadQueue.push(path);
    };

    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };

    downloadAll(callback) {
        if (this.downloadQueue.length === 0) setTimeout(callback, 10);
        for (var i = 0; i < this.downloadQueue.length; i++) {
            var that = this;

            var path = this.downloadQueue[i];
            console.log(path);
            let content;
            if (path.endsWith("wav") || path.endsWith("mp3")) {
                content = new Audio();
                // If the audio is fully loaded
                content.addEventListener("canplaythrough", function () {
                    console.log("Loaded " + this.src);
                    that.successCount++;
                    if (that.isDone()) callback();
                });
            } else {
                content = new Image();
                content.addEventListener("load", function () {
                    console.log("Loaded " + this.src);
                    that.successCount++;
                    if (that.isDone()) callback();
                });
            }


            content.addEventListener("error", function () {
                console.log("Error loading " + this.src);
                that.errorCount++;
                if (that.isDone()) callback();
            });

            content.src = path;
            this.cache[path] = content;
        }
    };

    getAsset(path) {
        return this.cache[path];
    };

    // From Chris codebase.
    playAsset(path) {
        let audio = this.cache[path];
        audio.currentTime = 0;
        audio.play();
    };

    muteAudio(mute) {
        for (var key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.muted = mute;
            }
        }
    };

    adjustVolume(volume) {
        for (var key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.volume = volume;
            }
        }
    };

    pauseBackgroundMusic() {
        for (var key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.pause();
                asset.currentTime = 0;
            }
        }
    };

    autoRepeat(path) {
        var aud = this.cache[path];
        aud.addEventListener("ended", function () {
            aud.play();
        });
    };
};
