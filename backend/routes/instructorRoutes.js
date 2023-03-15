const express = require('express')
const {
  seeMyCourses,
  getinstructor, 
  seeCourse,
  seeExams,
  addQuestionBank,
  openQuestionBank,
  addMcqQuestion,
  editMcqQuestion,
} = require('../controllers/instructorController')
const router = express.Router()
// GET a single instructor for login
router.post('/getInstructor', getinstructor)
router.get('/seeMyCourses/:id',seeMyCourses)
router.get('/seeCourse/:name',seeCourse)
router.get('/seeExams/:name',seeExams)
router.post('/addQuestionBank/',addQuestionBank)
router.get('/openQuestionBank/',openQuestionBank)
router.post('/addMcqQuestion/',addMcqQuestion)
router.put('/editMcqQuestion/',editMcqQuestion)
module.exports = router