const express = require('express')
const {
  getStudent,
  seeMyCourses,
  seeExams,
  getQuestionsForExam,
  SubmitExam,
  saveScreenshot,
} = require('../controllers/studentController')
const router = express.Router()

router.post('/getStudent', getStudent)
router.post('/submitExam', SubmitExam)
router.get('/seeMyCourses',seeMyCourses)
router.get('/seeExams/:name',seeExams)
router.get('/getQuestionsForExam/', getQuestionsForExam)
router.post('/saveScreenshot', saveScreenshot)
module.exports = router