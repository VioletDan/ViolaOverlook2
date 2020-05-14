const iuser = function () {
    let user = {
        code: null,
        SessionKey: null,
        OpenID: null,
        userInfo: null
    };

    /**
     * 登录 （如果code过期了 可以调用这个放发重新获取）
     * @params {Function} callback 回调函数
     */
    user.login = function (callback) {
        wx.login({
            success: (res) => {
                console.log('wx login success');
                console.log('user code:', res.code);
                user.code = res.code;
                callback(res.code);
                 let pages = getCurrentPages();
                let page = pages[pages.length - 1];
                 page.setData({
                    code:res.code
                });
            },
            fail: (res) => {
                console.warn('wx login fail', res);
            }
        })
    }

    /**
     * 初始化
     * @params {Function} callback 回调函数
     */
    user.getUserInfo = function (onSuccess = function () { }, onFail = function () { }) {
        let pages = getCurrentPages();
        let page = pages[pages.length - 1];
        if (this.userInfo) {
            // console.log('user has been storaged');
            // console.log('user info', this.userInfo);
            page.setData({
                hasUserInfo: true,
                userInfo: user.userInfo
            });
            onSuccess();
        }//edn if
        else {
            wx.getUserInfo({
                success: function (res) {
                    user.parse(res);
                    page.setData({
                        hasUserInfo: true,
                        userInfo: user.userInfo
                    });
                    onSuccess();
                },
                fail: onFail
            });
        }//end else
    }

    /**
     * 解析用户数据
     */
    user.parse = function (data) {
        console.log('user', data);
        this.encryptedData = data.encryptedData;
        this.iv = data.iv;
        this.rawData = data.rawData;
        this.signature = data.signature;
        this.userInfo = data.userInfo;
        console.log('user info', this.userInfo);
    }

    return user;
};

module.exports = iuser();