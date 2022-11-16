const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant-model')

router.get('/', (req, res) => {
  const keyword = req.query.keyword.trim()
  const sort = req.query.sort || 'default'
  const sortBy = {
    'default': { _id: 'asc' },
    'AtoZ': { name: 'asc' },
    'ZtoA': { name: 'desc' },
    'category': { category: 'asc' },
    'location': { location: 'asc' }
  }
  const sortSelected = { [sort]: true }

  Restaurant.find()
    .lean()
    .sort(sortBy[sort])
    .then(restaurants => {
      const searchResult = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword)
      })

      if (!searchResult.length) {
        res.render('not-found', { keyword })
      } else {
        res.render('index', { restaurants: searchResult, keyword, sortSelected })
      }
    })
})

module.exports = router