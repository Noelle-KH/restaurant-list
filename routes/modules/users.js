const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user-model')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符' })
  }
  if (errors.length) {
    return res.render('register', { name, email, password, confirmPassword, errors })
  }
  return User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '這個 Email 已註冊過了' })
        return res.render('register', {
          name, email, password, confirmPassword, errors
        })
      }
      return User.create({ name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })
        .then(() => res.redirect('/'))
    })
    .catch(error => console.log(error))
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_message', '您已成功登出')
  res.redirect('/users/login')
})

module.exports = router
