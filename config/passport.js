const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('../models/user-model')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    return User.findOne({ email })
      .then(user => {
        if (!user) return done(null, false, { message: '此信箱尚未註冊' })
        if (user.password !== password) return done(null, false, { message: '信箱或帳號不相符' })
        return done(null, user)
      })
      .catch(error => done(error))
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    return User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(error => done(error))
  })
}
