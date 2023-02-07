const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user-model')

// 登入
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res, next) => {
  // 檢查使用者沒有填寫信箱或密碼的狀況並顯示對應訊息
  const { email, password } = req.body
  if (!email || !password) {
    req.flash('warning_message', '請填寫信箱和密碼')
    return res.redirect('/users/login')
  }
  next()
}, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

// 註冊
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ message: 'Email、密碼與再次輸入密碼欄位都是必填' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與再次輸入密碼不相符' })
  }
  if (errors.length) {
    return res.render('register', { name, email, password, confirmPassword, errors })
  }
  return User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: 'Email 顯示已是會員，請使用登入功能' })
        return res.render('register', {
          name, email, password, confirmPassword, errors
        })
      }
      return User.create({
        name: name || email.slice(0, email.indexOf('@')),
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })
        .then(() => {
          req.flash('success_message', '註冊完成，請重新登入會員')
          return res.redirect('/users/login')
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_message', '您已成功登出')
  res.redirect('/users/login')
})

module.exports = router
