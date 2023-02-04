const db = require('../../config/mongoose')
const restaurantData = require('./restaurant.json').results
const userData = require('./user.json').results
const Restaurant = require('../restaurant-model')
const User = require('../user-model')

db.once('open', () => {
  return Promise.all(userData.map(user => {
    const { email, password, restaurantIndex } = user
    const name = email.slice(0, email.indexOf('@'))
    return User.create({ name, email, password })
      .then(user => {
        const restaurants = restaurantIndex.map(index => {
          const restaurant = restaurantData[index]
          restaurant.userId = user._id
          return restaurant
        })
        return Restaurant.create(restaurants)
      })
  }))
    .then(() => {
      console.log('done')
      process.exit()
    })
    .catch(error => console.log(error))
})

