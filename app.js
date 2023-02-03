const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const port = 3000
const app = express()

const routes = require('./routes')
require('./config/mongoose')

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
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)


app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})