const userController = require('../controllers/userController.js')

const router = require('express').Router()

router.post('/add', userController.addUser)

router.post('/login', userController.login)

module.exports = router