const Student = require('../models/studentModel')
const mongoose = require('mongoose')
const Course = require('../models/courseModel')
const _ = require('lodash');

const getStudent = async (req, res) => {
    const { username , password} = req.body
  
  //   if (!mongoose.Types.ObjectId.isValid(id)) {
  //     return res.status(404).json({error: 'No such instructor'})
  //   }
  
    const student =   await Student.findOne({ username , password })
  
    if ((!student)) {
      return res.status(404).json({error: 'No such Student or instructor'})
    }
  // console.log(instructor.username)
    res.status(200).json(student)
  }

const seeMyCourses=async(req,res)=>{
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: 'No such student'})     }
    const student =   await Student.findById({_id: id})
    if(!student) {
             return res.status(400).json({error: 'No such student'})
          }
           res.status(200).json(student.courses)
  
  }  
  const seeExams=async(req,res)=>{
    const { name } = req.params
    const course =   await Course.findOne({name})
    if(!course) {
             return res.status(400).json({error: 'No such course'})
          }
    res.status(200).json(course.exams)
  }

  const getQuestionsForExam = async (req, res) => {
    const examId= req.query.examId;
   
      const courseName = req.query.courseName;
    
       const  id  = req.query.Id
    // if (!mongoose.Types.ObjectId.isValid(id.trim())) {
    //         return res.status(400).json({error: ' Invalid Id No such student'})     }
    const student =   await Student.findById({_id: id.trim()})
    if(!student) {
             return res.status(400).json({error: 'No such student'})
          }
    
    console.log(examId , courseName);
    try {
      const examx = student.exams.find((exam) => exam.examId.equals(examId.trim()));
      if (examx) {
        console.log("already generated");
        return res.send({Questions:examx.questions , submitted:examx.submitted, answers:examx.studentAnswers});
      }
      let exam = null;
      let myCourse=null;
      // find the exam in MongoDB by id in the given course
      await Course.findOne(
        { name: courseName },
      )
        .then((course) => {
          if (!course) {
            console.log("Course not found");
            return;
          }
          else{
            myCourse=course 
          }
  
           // since we used $elemMatch, the result is an array with one element
          // do something with the exam
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
        
  for( let i=0;i<myCourse.exams.length;i++){
    
    if(myCourse.exams[i]._id.equals(examId.trim())){
      exam=myCourse.exams[i]
      console.log("found")
      break;
    }
  }
  if(!exam){
    return res.status(400).json({error: 'No such exam'})
  }
      
        
      // extract the specs array from the exam
      const specsArray = exam.specs;
  
      // initialize an empty array to store the questions
      const questions = [];
  
      // loop through the specs array
      
      for (let i = 0; i < specsArray.length; i++) {
        const { chapter, category, numQuestions } = specsArray[i];
  
        // find the question bank in the questionBanks array by name
        const questionBank = myCourse.questionBanks.find((qb) => qb.title === chapter);
  
        // find the questions in the questions array with the given category and numQuestions
        const questionsForChapter = _.sampleSize(questionBank.questions.filter((q) => q.category === category), numQuestions);
        const selectedQuestions = questionsForChapter.slice(0, numQuestions);
  
        // add the questions to the array
        questions.push(...selectedQuestions);
      }
      var totalGrade=0;
      //loop over questions to calculate total grade
      for(let i=0;i<questions.length;i++){
        totalGrade+=parseInt(questions[i].grade)
      }
  
      // return the questions
      const examForStudent= {
        examId:exam._id,
        title:exam.title,
        courseName:courseName,
        questions:questions,
        studentAnswers:new Array(questions.length).fill(null),
        studentGrades:new Array(questions.length).fill(0),
        totalGrade:0,
        totalPossibleGrade:totalGrade,
        submitted:false,
        graded:false,
      }
      student.exams.push(examForStudent)
      await student.save()
      return res.send({Questions:questions , submitted:examForStudent.submitted, answers:examForStudent.studentAnswers});
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  };
  const SubmitExam = async (req, res) => {
    const examId= req.body.examId;
    const answers=req.body.answers
    const courseName = req.body.courseName;
    const  id  = req.body.Id
  // if (!mongoose.Types.ObjectId.isValid(id.trim())) {
  //         return res.status(400).json({error: ' Invalid Id No such student'})     }
  const student =   await Student.findById({_id: id.trim()})
  if(!student) {
           return res.status(400).json({error: 'No such student'})
        }
  
  console.log(examId , courseName);
  try {
    const examx = student.exams.find((exam) => exam.examId.equals(examId.trim()) && exam.courseName===courseName);
    if (examx) {
      console.log("found");
    }
    else{
      console.log("no such exam")
    }
    var totalGrade=0
    const answerEntries = Object.entries(answers);
    const questionAnswers = answerEntries.map(([questionId, answer]) => ({ questionId, answer }));

    console.log(questionAnswers.length)
    // loop through the answers array and store every answer in the corresponding question.studentAnswer in questions array in the exam
    for (let i = 0; i < questionAnswers.length; i++) {
      //get questionId and answer from  answers which ia a json object of the form {questionId:answer}


      const { questionId, answer } = questionAnswers[i];
      console.log(questionId,answer)
      const index = examx.questions.findIndex((q) => q._id.equals(questionId));
      examx.studentAnswers[index]=answer
      const question = examx.questions.find((q) => q._id.equals(questionId));
      
      // calculate the grade for the question
      //get the choice text of the choice that has the same index as the answer
      if(question.type=='mcq'){
      const choice = question.choices[answer];
      const correctAnswer = question.answer;
      if (correctAnswer===choice) {
        examx.studentGrades[index] = parseInt(question.grade);;
        totalGrade+=parseInt(question.grade);
      } else {
        examx.studentGrades[index] = 0;
      }}
     
    }
    examx.totalGrade=totalGrade
    examx.submitted=true
    // update the exams array of the student with the edited exam examx
    const index = student.exams.findIndex((exam) => exam.examId.equals(examId.trim()) && exam.courseName===courseName);
    student.exams[index] = examx;
    // save the student
    await student.save();
    console.log("Submitted")
   res.send("Submitted")
  }
  catch(err){
    console.log(err)
    res.status(500).send(err);
  }
}



module.exports = {
  getStudent,
  seeMyCourses,
  seeExams,
  getQuestionsForExam,
  SubmitExam,
}