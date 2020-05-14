import regeneratorRuntime from '../plugs/regeneratorRuntime';
import promisify from '../plugs/promisify.js';
import config from '../../../config.js';
var cityData = {
  async screenCurrentCity(arr) {
    let cityData = config.cityData
    let arrData = {}
    let arrTemp = cityData.filter((i, index) => {
      if (i.text.indexOf(arr[0]) != -1) {
        arrData.mainActiveIndex = index
        cityData[index].children.filter(ii => {
          if (ii.text.indexOf(arr[1]) != -1) arrData.activeId = ii.id
          return
        })
        return
      }
    })
    return arrData
  },
  async getStoreData() {
    let res = await promisify(wx.request)({
      url: config.domain + '/data/store.json?v=' + (Math.random() * 1000 >> 0),
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
    }).catch(err => {
      console.log(err)
    })
    if(res && res.data.code == 200){
      return res.data.data
    }
  }
}

module.exports = cityData
