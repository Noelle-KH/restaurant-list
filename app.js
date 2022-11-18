// 載入Express、樣板引擎、body-parser
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const port = 3000
const app = express()

//! 重構路由統一封裝於routes、資料庫連線設定於config
const routes = require('./routes')
require('./config/mongoose')

// 設定樣板引擎、靜態檔案及body-parser、路由
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    selected: (sortSelected) => {
      if (sortSelected) return "selected"
    }
  }
}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

// 啟動與監聽伺服器
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})