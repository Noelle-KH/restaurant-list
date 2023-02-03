const express = require('express')
const router = express.Router()
const User = require('../../models/user-model')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  if (!name || !email || !password || !confirmPassword) {
    console.log('所有欄位都是必填')
    return res.render('register', {
      name, email, password, confirmPassword
    })
  }
  if (password !== confirmPassword) {
    console.log('密碼與確認密碼不相符')
    return res.render('register', {
      name, email, password, confirmPassword
    })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
      }
      return User.create({ name, email, password })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

module.exports = router
