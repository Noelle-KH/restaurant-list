const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant-model')

router.get('/', (req, res) => {
  const keyword = req.query.keyword.trim()
  Restaurant.find()
    .lean()
    .then(restaurants => {
      const searchResult = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword)
      })

      if (!searchResult.length) {
        res.render('not-found', { keyword })
      } else {
        res.render('index', { restaurants: searchResult, keyword })
      }
    })
})

module.exports = router