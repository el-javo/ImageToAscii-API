const express = require('express')
const { authorizePermissions, authenticateUser } = require('../middleware/authentication')
const {getGenerations, getAllGenerations, updateGeneration, deleteGeneration} = require('../controllers/generationsController')
const router = express.Router()

router.get('/',authenticateUser, getGenerations)
router.get('/allGens',[authenticateUser,authorizePermissions('admin')], getAllGenerations)
router.route('/:id').patch(authenticateUser, updateGeneration).delete(authenticateUser, deleteGeneration)

module.exports = router