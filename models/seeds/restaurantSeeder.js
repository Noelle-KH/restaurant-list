//! 重構種子資料內的資料庫連線設定
const db = require('../../config/mongoose')
const restaurants = require('./restaurant.json').results
const Restaurant = require('../restaurant-model')

db.once('open', () => {
  Restaurant.insertMany(restaurants)
  console.log('done')
})

