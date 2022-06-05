const express = require('express')
const authController = require('../controllers/authController')
const {authenticateUser} = require('../middleware/authentication')
const Router = express.Router()

// we need to authenticate user before logout to delete his refresh token in the db
Router.delete('/logout',authenticateUser, authController.logout)
Router.post('/login', authController.login)
Router.post('/register', authController.register)
Router.post('/forgot-password', authController.forgotPassword)
Router.post('/reset-password', authController.resetPassword)
Router.get('/verify-email', authController.verifyEmail)
Router.get('/showMe',authenticateUser, authController.showMe)

module.exports = Router