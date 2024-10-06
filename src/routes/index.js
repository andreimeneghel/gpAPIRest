const express = require('express')
const router = express.Router()
const usersRoutes = require('./usersRoutes')
const studentsRoutes = require('./studentsRoutes')
const teachersRoutes = require('./teachersRoutes')
const appointmentRoutes = require('./appointmentRoutes')

router.use(express.json())
router.use('/users', usersRoutes)
router.use('/appointment', appointmentRoutes)
router.use('/students', studentsRoutes)
router.use('/teachers', teachersRoutes)


module.exports = router

