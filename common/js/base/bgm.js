const ibgm = function () {
    let bgm = {};
    let opts = {};
    let innerAudioContext;
    let innerPlaying = false;
    bgm.playing = false;

    bgm.on = function (options) {
        let defaults = {
            src: 'sound/bgm.mp3',
            time: 0,
            loop: true,
            autoplay: true,
            onCanplay: function () { },
            onPlay: function () { },
            onPause: function () { },
            onStop: function () { },
            onEnded: function () { },
            onTimeUpdate: function () { }
        };
        Object.assign(opts, defaults, options);
        console.log('bgm option', opts);
        console.log('bgm src:' + opts.src);
        innerAudioContext = wx.createInnerAudioContext();
        innerAudioContext.src = opts.src;
        innerAudioContext.loop = opts.loop;
        this.audio = innerAudioContext;

        innerAudioContext.onCanplay(() => {
            console.log('可以开始播放背景音乐');
            let pages = getCurrentPages();
            let page = pages[pages.length - 1];
            page.setData({
                bgmBtn: true
            });
            this.play();
            opts.onCanplay();
        });

        innerAudioContext.onPlay(() => {
            console.log('播放背景音乐');
            innerPlaying = true;
            let pages = getCurrentPages();
            let page = pages[pages.length - 1];
            page.setData({
                bgmPlay: "bgmPlay"
            });
            opts.onPlay();
        });

        innerAudioContext.onPause(() => {
            console.log('暂停背景音乐');
            innerPlaying = false;
            let pages = getCurrentPages();
            let page = pages[pages.length - 1];
            page.setData({
                bgmPlay: "bgmStop"
            });
            opts.onPause();
        });

        innerAudioContext.onStop(() => {
            console.log('停止背景音乐');
            innerPlaying = false;
            let pages = getCurrentPages();
            let page = pages[pages.length - 1];
            page.setData({
                bgmPlay: "bgmStop"
            });
            opts.onStop();
        });

        innerAudioContext.onError((res) => {
            console.log(res.errMsg);
            console.log(res.errCode);
        });

        innerAudioContext.onEnded(() => {
            console.log('背景音乐播放结束');
            opts.onEnded();
        });

        innerAudioContext.onTimeUpdate((res) => {
            // console.log(innerAudioContext.currentTime+'/'+innerAudioContext.duration);
            opts.onTimeUpdate(innerAudioContext.currentTime, innerAudioContext.duration);
        });

    } //edn func

    bgm.play = function (time) {
        console.log('bgm play');
        this.playing = true;
        if (time != null && time >= 0) {
            console.log('bgm seek time:' + time);
            innerAudioContext.seek(time);
        } //edn if
        innerAudioContext.play();
    } //edn func

    bgm.pause = function () {
        console.log('bgm pause');
        this.playing = false;
        innerAudioContext.pause();
    } //edn func

    bgm.stop = function () {
        console.log('bgm stop');
        this.playing = false;
        innerAudioContext.stop();
    } //edn func

    bgm.audio = function () {
        return innerAudioContext();
    } //edn func

    bgm.off = function () {
        innerAudioContext.destroy();
    } //edn func

    bgm.currentTime = function () {
        return innerAudioContext.currentTime;
    } //edn func

    bgm.duration = function () {
        return innerAudioContext.duration;
    } //edn func

    bgm.volume = function (value = 1) {
        if (value >= 0 && value <= 1) {
            innerAudioContext.volume = value;
        } //edn if
        else {
            return innerAudioContext.volume;
        } //edn else
    } //edn func

    bgm.audio = function () {
        return innerAudioContext;
    } //edn func

    bgm.reShow = function () {
        let pages = getCurrentPages();
        let page = pages[pages.length - 1];
        let status = bgm.playing == true ? "bgmPlay" : "bgmStop"
        page.setData({
            bgmBtn: true,
            bgmPlay: status
        });
    } //edn func

    bgm.show = function (play = true) {
        let pages = getCurrentPages();
        let page = pages[pages.length - 1];
        page.setData({
            bgmBtn: true
        });
        if (play) {
            this.play();
        } //edn if
    } //edn func

    bgm.hide = function (pause = true) {
        let pages = getCurrentPages();
        let page = pages[pages.length - 1];
        page.setData({
            bgmBtn: false
        });
        if (pause) {
            this.pause();
        } //edn if
    } //edn func

    bgm.click = function () {
        let pages = getCurrentPages();
        let page = pages[pages.length - 1];
        if (!this.playing) {
            this.play();
        } //end if
        else {
            this.pause();
        } //edn else
    } //edn func

    return bgm;

};

module.exports = ibgm();