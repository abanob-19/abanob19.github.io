const express = require('express')
const {
  getStudent,
} = require('../controllers/studentController')
const router = express.Router()

// GET all instructors
// router.get('/', getinstructors)

// GET a single instructor
router.post('/getStudent', getStudent)

// POST a new instructor
// router.post('/', createinstructor)

// // DELETE a workout
// router.delete('/:id', deleteWorkout)

// // UPDATE a workout
// router.patch('/:id', updateWorkout)

module.exports = router