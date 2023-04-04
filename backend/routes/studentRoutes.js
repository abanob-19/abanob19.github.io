const express = require('express')
const {
  getStudent,
  seeMyCourses,
  seeExams,
  getQuestionsForExam,
} = require('../controllers/studentController')
const router = express.Router()

router.post('/getStudent', getStudent)
router.get('/seeMyCourses',seeMyCourses)
router.get('/seeExams/:name',seeExams)
router.get('/getQuestionsForExam/', getQuestionsForExam)
module.exports = router