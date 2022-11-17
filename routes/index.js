const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const todos = require('./modules/todos')
const users = require('./modules/users')

router.use('/', todos)
router.use('/', users)
router.use('/', home)

module.exports = router