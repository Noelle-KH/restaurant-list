const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant-model')

router.get('/', (req, res) => {
  const sort = req.query.sort || 'default'
  const sortBy = {
    default: { _id: 'asc' },
    AtoZ: { name: 'asc' },
    ZtoA: { name: 'desc' },
    category: { category: 'asc' },
    location: { location: 'asc' }
  }
  const sortSelected = { [sort]: true }

  Restaurant.find()
    .lean()
    .sort(sortBy[sort])
    .then(restaurants => res.render('index', { restaurants, sortSelected }))
    .catch(error => console.log(error))
})

module.exports = router