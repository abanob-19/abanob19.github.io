const Student = require('../models/studentModel')
const mongoose = require('mongoose')
const Course = require('../models/courseModel')
const _ = require('lodash');


// // get all workouts
// const getinstructors = async (req, res) => {
//   const instructors = await Instructor.find({}).sort({createdAt: -1})
//   res.status(200).json(instructors)
// }

// get a single workout
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
        return res.send(examx.questions);
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
  
      // return the questions
      const examForStudent= {
        examId:exam._id,
        title:exam.title,
        questions:questions,
        totalGrade:0
      }
      student.exams.push(examForStudent)
      await student.save()
      return res.send(questions);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  };

// create a new workout
// const createinstructor = async (req, res) => {
//   const {username, password } = req.body

//   // add to the database
//   try {
//     const instructor = await Instructor.create({ username, password })
//     res.status(200).json(instructor)
//   } catch (error) {
//     res.status(400).json({ error: error.message })
//   }
// }

// const deleteWorkout = async (req, res) => {
//     const { id } = req.params
  
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({error: 'No such workout'})
//     }
  
//     const workout = await Workout.findOneAndDelete({_id: id})
  
//     if(!workout) {
//       return res.status(400).json({error: 'No such workout'})
//     }
  
//     res.status(200).json(workout)
//   }
  
//   // update a workout
//   const updateWorkout = async (req, res) => {
//     const { id } = req.params
  
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({error: 'No such workout'})
//     }
  
//     const workout = await Workout.findOneAndUpdate({_id: id}, {
//       ...req.body
//     })
  
//     if (!workout) {
//       return res.status(400).json({error: 'No such workout'})
//     }
  
//     res.status(200).json(workout)
//   }

module.exports = {
  getStudent,
  seeMyCourses,
  seeExams,
  getQuestionsForExam,
}