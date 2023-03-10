const express = require('express')
const {
  getinstructors, 
  getinstructor, 
  createinstructor, 
} = require('../controllers/instructorController')
const router = express.Router()

// GET all instructors
router.get('/', getinstructors)

// GET a single instructor
router.get('/:id', getinstructor)

// POST a new instructor
router.post('/', createinstructor)

// // DELETE a workout
// router.delete('/:id', deleteWorkout)

// // UPDATE a workout
// router.patch('/:id', updateWorkout)

module.exports = router