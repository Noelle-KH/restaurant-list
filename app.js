const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const port = 3000
const app = express()

const routes = require('./routes')
const usePassport = require('./config/passport')
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
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_message = req.flash('success_message')
  res.locals.warning_message = req.flash('warning_message')
  next()
})
app.use(routes)


app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
