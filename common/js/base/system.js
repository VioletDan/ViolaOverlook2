/**
 * 系统信息
 */
class System{
    constructor(){
        this.classNames = [];
        //当前系统信息
        this.osType = null;
        //当前系统版本
        this.osVer = 0;
        this.successFuc = null;                 //成功回掉函数
    }

    init(options) {
        this.successFuc = options.success || function () { };
        let systemInfo = wx.getSystemInfoSync();
        console.log(systemInfo.brand);
        console.log(systemInfo.model);
        console.log(systemInfo.system);
        console.log(systemInfo.platform);
        let systemList = systemInfo.system.split(' ');
        if (systemList.length > 1){
            this.osType = systemList[0].toLowerCase();
            this.osVer = systemList[1].toLowerCase();
            this.osVer = this.osVer.split('.')[0];
            this.classNames.push(this.osType + this.osVer);
            this.classNames.push(systemInfo.model);
        }
        // console.log(systemList);
        this.successFuc(systemInfo);
    }
}
export { System }