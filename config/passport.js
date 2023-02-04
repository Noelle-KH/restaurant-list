const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const User = require('../models/user-model')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    return User.findOne({ email })
      .then(user => {
        if (!user) return done(null, false, req.flash('warning_message', '此信箱尚未註冊'))
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return done(null, false, req.flash('warning_message', '信箱或密碼不相符'))
            return done(null, user)
          })
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

