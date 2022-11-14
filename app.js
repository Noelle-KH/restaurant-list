// 載入Express、樣板引擎、外部資源、設定路由、啟動伺服器
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000
const Restaurant = require('./models/restaurant-model')
const bodyParser = require('body-parser')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  const [name, category, image, location, phone, google_map, rating, description] = [req.body.name, req.body.category, req.body.image, req.body.location, req.body.phone, req.body.google_map, Number(req.body.rating), req.body.description]
  return Restaurant.create({
    name, category, image, location, phone, google_map, rating, description
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const [name, category, image, location, phone, google_map, rating, description] = [req.body.name, req.body.category, req.body.image, req.body.location, req.body.phone, req.body.google_map, Number(req.body.rating), req.body.description]
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
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

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})