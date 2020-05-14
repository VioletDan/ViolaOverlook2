
//声音基类
var BaseAudio = function(){
    let s = this;
    let audio = wx.createInnerAudioContext();
    s.isPlay = false;
    s.loop = false;

    //监听播放完成事件
    audio.onEnded(()=>{
        if (s.loop)s.play();
    });


    /**
     * 初始化
     * @param  {String}     url              mp3地址
     */
    s.init = function(url){
        audio.src = url;
        return s;
    }

    s.play = function(){
        s.isPlay = true;
        audio.play();
        return s;
    }
    s.pause = function(){
        s.isPlay = false;
        audio.pause();
        return s;
    }
    s.stop = function(){
        audio.startTime = 0;
        audio.stop();
        s.isPlay = false;
        return s;
    }

    return s;
}

//音乐类 默认只有一个
var Audio = function(){

    let s = this;

    s.bgm = new BaseAudio();
    s.bgm.loop = true;

    s.play

    

    return s;

}


module.exports = new Audio();