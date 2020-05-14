const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async(event, context) => {
  try {
    return await db.collection('storeAdress').where({
        area_id: event.area_id
      })
      .get()
  } catch (e) {
    console.error(e)
  }
}