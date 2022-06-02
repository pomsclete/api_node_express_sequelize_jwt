const userController = require('../controllers/userController.js')

const router = require('express').Router()

router.post('/add', userController.addUser)

router.post('/login', userController.login)

router.get('/me', userController.getUserProfile)

router.get('/all', userController.getAllUsers)

router.put('/editProfil', userController.editProfil)

router.put('/updatePwd', userController.updatePwd)

module.exports = router