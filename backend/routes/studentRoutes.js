const express = require('express')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {
  getStudent,
  seeMyCourses,
  seeExams,
  getQuestionsForExam,
  SubmitExam,
  saveScreenshot,
  seeExamsForGrades,
  uploadFile,
  downloadFile,
  saveAnswers,
} = require('../controllers/studentController')
const router = express.Router()

router.post('/getStudent', getStudent)
router.post('/submitExam', SubmitExam)
router.get('/seeMyCourses',seeMyCourses)
router.get('/seeExams/:name',seeExams)
router.get('/getQuestionsForExam/', getQuestionsForExam)
router.post('/saveScreenshot', saveScreenshot)
router.get('/seeExamsForGrades/',seeExamsForGrades)
router.post('/uploadFile', upload.single('attachment'),uploadFile)
router.get('/downloadFile/', downloadFile)
router.post('/saveAnswers',saveAnswers)
module.exports = router