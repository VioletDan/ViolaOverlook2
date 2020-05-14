// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async(event, context) => {
  try {
    // 数据库正则对象
    return await db.collection('storeAdress').where({
      name: db.RegExp({
        regexp: event.value,
        options: 'i',
      })
    }).get()
  } catch (e) {
    console.error(e)
  }
}