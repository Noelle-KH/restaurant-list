// 載入Express、樣板引擎、資料庫及Model、body-parser
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const Restaurant = require('./models/restaurant-model')
const port = 3000
const app = express()

// 與資料庫連線
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

// 設定樣板引擎、靜態檔案及body-parser
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 設置路由
app.get('/', (req, res) => {
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
    .then(restaurants => res.render('index', { restaurants, sortSelected }))
    .catch(error => console.log(error))
})

// 新增餐廳資料
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  const { name, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.create({
    name, category, image, location, phone, google_map, rating, description
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 瀏覽餐廳資料
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 修改餐廳資料
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const { name, category, image, location, phone, google_map, rating, description } = req.body
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

// 刪除餐廳資料
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 搜尋餐廳
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

// 啟動與監聽伺服器
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})