let imath = require('../base/math.js');
let TouchEvent = require('../event/touchEvent.js');
let VC = require('VCanvas.js');

/**
 * 图片拍照上传编辑
 * @param  {String}     id              cavnas-id
 * @param  {Page}       pageContext     当前的page对象
 * @param  {Object}     options         {width,height}
 */
var Camera = function (id, pageContext, options) {
    var s = this;

    let ctx, page, opts;

    //铺满画布的尺寸
    let size = {
        width: 0,
        height: 0
    };
    //缩放最大值
    let maxScale = 1.5;
    //缩放最小值
    let minScale = 0.5;
    //上传的图片数据
    let imgFileObj = {width:0,height:0,path:''};

    //canvas
    let stage;
    //背景层
    let bgLayer = null;
    let itemLayer = null;
    let topLayer = null;

    //事件
    let touch = new TouchEvent();


    function _init() {
        ctx = wx.createCanvasContext(id);
        page = pageContext;
        opts = options;
        stage = new VC.Stage(ctx, opts.width, opts.height, {onDraw:opts.onDraw || function(){}});
        //绑定事件
        touch.init(page);
        touch.bind({
            onPressMove: (e) => {
                bgLayer.x += e.deltaX;
                bgLayer.y += e.deltaY;
                stage.update();
                page.setData({
                    touchStatus: 'onPressMove:' + e.deltaX + " - " + e.deltaY
                });
            },
            onRotate: (e) => {
                bgLayer.rotation += e.angle;
                stage.update();
                page.setData({
                    touchStatus: 'onRotate:' + e.angle
                });
            },
            onPinch: (e) => {
                let scale = bgLayer.scaleX;
                scale += e.scale;
                if(scale > maxScale)scale = maxScale;
                if(scale < minScale)scale = minScale;
                bgLayer.scaleX = scale;
                bgLayer.scaleY = scale;
                stage.update();
                page.setData({
                    touchStatus: 'onPinch:' + e.scale
                });
            }
        });
    }
    //计算一下图片的宽高 铺满画布
    function _parseSize() {
        let sizeObj = imath.autoSize([imgFileObj.width, imgFileObj.height], [opts.width, opts.height], 1);
        //这里取整比较好
        size.width = Math.ceil(sizeObj[0]);
        size.height = Math.ceil(sizeObj[1]);
    }

    function _updateCanvas() {
        if(bgLayer == null){
            bgLayer = new VC.Image();
            //添加到舞台并更新
            stage.addChild(bgLayer);
        }
        bgLayer.source = imgFileObj.path;
        _reset();
    }
    function _reset(){
        if (bgLayer){
            bgLayer.width = size.width;
            bgLayer.height = size.height;
            bgLayer.anchorX = size.width / 2;
            bgLayer.anchorY = size.height / 2;
            bgLayer.scaleX = bgLayer.scaleY = 1;
            bgLayer.rotation = 0;
            bgLayer.x = (opts.width - size.width) / 2;
            bgLayer.y = (opts.height - size.height) / 2;
            stage.update();
        }
    }
    function _clear(){
        imgFileObj.path = "";
        _updateCanvas();
    }
    /**
     * 选择图片
     */
    s.chooseImage = function (imgObj,data,callback) {
        if (imgObj) {
            imgFileObj = imgObj;
            _parseSize();
            _updateCanvas();
            // this._updateCanvas(this.center.x, this.center.y);
        } else {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: (res) => {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    var tempFilePaths = res.tempFilePaths;
                    
                    if (tempFilePaths.length > 0) {
                        //计算一下图片
                        wx.getImageInfo({
                            src: tempFilePaths[0],
                            success: (imgInfoRes) => {
                                imgFileObj.width = imgInfoRes.width;
                                imgFileObj.height = imgInfoRes.height;
                                imgFileObj.path = imgInfoRes.path;
                                _parseSize();
                                _updateCanvas();
                            }
                        })
                    }
                }
            })
        }
    }

    // /**
    //  * 添加小物件
    //  */
    // s.addItem = function(imgPath, width, height){

    // }

    /**
     * 返回图片本地临时地址
     * @param  {String}       fileType      图片类型 jpg / png 默认jpg
     * @param  {Number}       qualit        图片品质 0 - 1 默认1
     * @param  {Function}     cb            回调函数
     * 
     * @return {String}                     null表示失败了，否则返回当前图片在本机的临时路径
     */
    s.getImage = function (fileType, quality, cb) {
        let w = opts.width;
        let h = opts.height;
        fileType = fileType || "jpg";
        quality = quality || 1;
        cb = cb || function(){};
        wx.showLoading({
            title: '图片生成中...',
        })
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: w,
            height: h,
            destWidth: w,
            destHeight: h,
            fileType: fileType,
            quality: quality,
            canvasId: id,
            success: (res) => {
                cb(res.tempFilePath);
                wx.hideLoading();
            },
            fail: () => {
                cb(null);
                wx.hideLoading();
            }
        })
    }

    /**
     * 重置图片的位置
     */
    s.reset = function(){
        _reset();
        return s;
    }
    /**
     * 清除图片
     */
    s.clear = function(){
        _clear();
        return s;
    }
    /**
     * 销毁
     */
    s.destroy = function(){
        stage.kill();
        stage = ctx = page = opts = bgLayer = null;
        touch.destroy();
        touch = null;
    }

    //初始化==============================
    _init();


    return s;
}

module.exports = Camera;