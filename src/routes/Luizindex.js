const express = require('express')
const router = express.Router()
const usersRoutes = require('./usersRoutes')
const studentsRoutes = require('./studentsRoutes')
router.use(express.json())
router.use('/users', usersRoutes)
router.use('/students', studentsRoutes)


module.exports = router





