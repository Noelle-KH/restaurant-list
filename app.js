// 載入Express、樣板引擎、外部資源、設定路由、啟動伺服器
const express = require('express')
const app = express()
const port = 3000

const restaurants = require('./restaurant.json')
const exphbs = require('express-handlebars')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurants.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurants.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const searchResult = restaurants.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword)
  })

  if (!searchResult.length) {
    res.render('not-found', { keyword })
  } else {
    res.render('index', { restaurants: searchResult, keyword })
  }
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})