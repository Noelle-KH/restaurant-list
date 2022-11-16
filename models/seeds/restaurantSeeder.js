//! 重構種子資料內的資料庫連線設定
const db = require('../../config/mongoose')
const restaurants = require('./restaurant.json').results
const Restaurant = require('../restaurant-model')

db.once('open', () => {
  restaurants.forEach(restaurant => {
    Restaurant.create({
      id: restaurant.id,
      name: restaurant.name,
      category: restaurant.category,
      image: restaurant.image,
      location: restaurant.location,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description
    })
  })
  console.log('done')
})

