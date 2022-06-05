const express = require('express')
const { authenticateUser } = require('../middleware/authentication')
const {buildReqBody, generate} = require('../controllers/generateController')
const Router = express.Router()

Router.post('/generateImg',[authenticateUser,buildReqBody({format:'img',upload:true})], generate)
Router.post('/generateTxt', [authenticateUser,buildReqBody({format:'txt',upload:true})], generate)
Router.post('/generateImgNoUp',[authenticateUser,buildReqBody({format:'img',upload:false})], generate)
Router.post('/generateTxtNoUp', [authenticateUser,buildReqBody({format:'txt',upload:false})], generate)
// posibilidad de añadir unas de tipo get tipo publica que generen archivos temporales para su facil uso

module.exports = Router