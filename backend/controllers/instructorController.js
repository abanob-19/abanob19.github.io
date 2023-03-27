const Instructor = require('../models/instructorModel')
const ExamSpecs = require('../models/examSpecsModel')
const Course = require('../models/courseModel')
const mongoose = require('mongoose')
const x =require('../models/examBankModel')
const examBank=x.examBank
const mcqQuestion=x.mcqQuestion
const textQuestion=x.textQuestion
const getinstructors = async (req, res) => {
  const instructors = await Instructor.find({}).sort({createdAt: -1})
  res.status(200).json(instructors)
}
const getinstructor = async (req, res) => {
  const { username , password} = req.body
  const instructor =   await Instructor.findOne({ username , password })
  if ((!instructor)) {
    return res.status(404).json({error: 'No such instructor '})
  }
  res.status(200).json(instructor)
}
const seeMyCourses=async(req,res)=>{
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({error: 'No such instructor'})     }
  const instructor =   await Instructor.findById({_id: id})
  if(!instructor) {
           return res.status(400).json({error: 'No such instructor'})
        }
         res.status(200).json(instructor.courses)

}
const seeCourse=async(req,res)=>{
  const { name } = req.params
  const course =   await Course.findOne({name})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
         res.status(200).json(course.questionBanks)

}
const seeExams=async(req,res)=>{
  const { name } = req.params
  const course =   await Course.findOne({name})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
         res.status(200).json(course.exams)
}
const createExam=async(req,res)=>{
  const { courseName,title,startTime,endTime , specs } = req.body
 
      const course =   await Course.findOne({name : courseName})
      console.log(courseName)
      if(!course) {
               return res.status(400).json({error: 'No such course'})
            }
            const examSpecs = new ExamSpecs()
            examSpecs.title=title
            examSpecs.startTime=startTime
            examSpecs.endTime=endTime
            examSpecs.specs=specs
       course.exams.push(examSpecs) 
       await course.save();    
       res.status(200).json({course})
}
const editExam=async(req,res)=>{
  const { courseName,title,startTime,endTime , specs ,oldTitle} = req.body
 
      const course =   await Course.findOne({name : courseName})
      if(!course) {
               return res.status(400).json({error: 'No such course'})
            }
            const examSpecs = new ExamSpecs()
            examSpecs.title=title
            examSpecs.startTime=startTime
            examSpecs.endTime=endTime
            examSpecs.specs=specs
            var targetExam;
            var targetExamIndex = 0;
            for (
              targetExamIndex = 0;
              targetExamIndex < course.exams.length;
              targetExamIndex++
            ) {
              if (course.exams[targetExamIndex].title == oldTitle) {
                targetExam = course.exams[targetExamIndex];
                break;
              }
            }
            if (!targetExam) {
              res.status(400);
              throw new Error("Exam does not exist");
            }
       course.exams[targetExamIndex] =examSpecs
       await course.save();    
       res.status(200).json(course);
}
const deleteExam=async(req,res)=>{
  const { courseName,title} = req.body
 
      const course =   await Course.findOne({name : courseName})
      if(!course) {
               return res.status(400).json({error: 'No such course'})
            }
           
            var targetExam;
            var targetExamIndex = 0;
            for (
              targetExamIndex = 0;
              targetExamIndex < course.exams.length;
              targetExamIndex++
            ) {
              if (course.exams[targetExamIndex].title == title) {
                targetExam = course.exams[targetExamIndex];
                break;
              }
            }
            if (!targetExam) {
              res.status(400);
              throw new Error("Exam does not exist");
            }
       course.exams.splice(targetExamIndex,1)
       await course.save();    
       res.status(200).json(course);
}

const addQuestionBank=async(req,res)=>{
  const { questionBankName,name } = req.body
  const course =   await Course.findOne({name})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
        try {
              const questionBank = new examBank()
              questionBank.title=questionBankName
              questionBank.course=name
              const course =   await Course.findOne({name})
              course.questionBanks.push(questionBank)
              await course.save()
            const course1 =   await Course.findOne({name})
              res.status(200).json(course1)
            } catch (error) {
              res.status(400).json({ error: error.message })
            }

}


const openQuestionBank=async(req,res)=>{
  const questionBankName = req.query.questionBankName;
  const name = req.query.name;
  const course =   await Course.findOne({name})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
        try {
              const questionBank = course.questionBanks.find(element => element.title == questionBankName);
              if(!questionBank){
                return res.status(400).json({error: 'No such bank'})
              }
              res.status(200).json(questionBank)
            } catch (error) {
              res.status(400).json({ error: error.message })
            }

}
const deleteQuestionBank=async(req,res)=>{
  const { questionBankName,name } = req.body
  const course =   await Course.findOne({name})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
        try {
              const questionBank = course.questionBanks.find(element => element.title == questionBankName);
              if(!questionBank){
                return res.status(400).json({error: 'No such bank'})
              }
              var targetExamIndex = 0;
              for (
                targetExamIndex = 0;
                targetExamIndex < course.questionBanks.length;
                targetExamIndex++
              ) {
                if (course.questionBanks[targetExamIndex].title == questionBankName) {
                  break;
                }
              }
              course.questionBanks.splice(targetExamIndex,1)
              await course.save()
              const course1 =   await Course.findOne({name})
              res.status(200).json(course1)
            } catch (error) {
              res.status(400).json({ error: error.message })
            }

}
const addMcqQuestion=async(req,res)=>{
  const { questionBankName,name,text,choices,answer,category } = req.body
  const course =   await Course.findOne({name})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
        try {
              const questionBank = (examBank)(course.questionBanks.find(element => element.title == questionBankName));
              
              if(!questionBank){
                return res.status(400).json({error: 'No such bank'})
              }
              var questionBanks = course.questionBanks;
              const question=new mcqQuestion()
              question.text=text
              question.choices=choices
              question.answer=answer;
              question.category=category;
              const updatedQuestionList=questionBank.questions
              updatedQuestionList.push(question);
              var targetExam;
              var targetExamIndex = 0;
              for (
                targetExamIndex = 0;
                targetExamIndex < questionBanks.length;
                targetExamIndex++
              ) {
                if (questionBanks[targetExamIndex].title == questionBankName) {
                  targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              if (!targetExam) {
                res.status(400);
                throw new Error("Bank does not exist");
              }
              targetExam.questions = updatedQuestionList;
              targetExam.title = questionBankName;
              targetExam.course = name;
              questionBanks[targetExamIndex] = targetExam;
              // (course.questionBanks.find(element => element.title == questionBankName)).questions.push(question);
              //  await course.save()
              const courseUptaded = await Course.findOneAndUpdate(
                { name: name },
                { questionBanks: questionBanks }
                
              );
              if (courseUptaded) {
                res.status(200).json(updatedQuestionList);
              } else {
                res.status(400);
                throw new Error("Error occured");
              }
             
            // const course1 =   await Course.findOne({name})
            //   res.status(200).json(course1)
            } catch (error) {
              res.status(400).json({ error: error.message })
            }

}

const editMcqQuestion=async(req,res)=>{
  const { questionBankName,name,text,choices,answer,category,id } = req.body
  const course =   await Course.findOne({name})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
        try {
              const questionBank = (examBank)(course.questionBanks.find(element => element.title == questionBankName));
              
              if(!questionBank){
                return res.status(400).json({error: 'No such bank'})
              }
              var questionBanks = course.questionBanks;
              const question=new mcqQuestion()
              question.text=text
              question.choices=choices
              question.answer=answer;
              question.category=category;
              const updatedQuestionList=questionBank.questions
             
              var targetQuestionIndex = 0;
              for (
                targetQuestionIndex = 0;
                targetQuestionIndex < updatedQuestionList.length;
                targetQuestionIndex++
              ) {
                if (updatedQuestionList[targetQuestionIndex]._id == id) {
                  // targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              updatedQuestionList[targetQuestionIndex]=question;
              var targetExam;
              var targetExamIndex = 0;
              for (
                targetExamIndex = 0;
                targetExamIndex < questionBanks.length;
                targetExamIndex++
              ) {
                if (questionBanks[targetExamIndex].title == questionBankName) {
                  targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              if (!targetExam) {
                res.status(400);
                throw new Error("Bank does not exist");
              }
              targetExam.questions = updatedQuestionList;
              targetExam.title = questionBankName;
              targetExam.course = name;
              questionBanks[targetExamIndex] = targetExam;
              // (course.questionBanks.find(element => element.title == questionBankName)).questions.push(question);
              //  await course.save()
              const courseUptaded = await Course.findOneAndUpdate(
                { name: name },
                { questionBanks: questionBanks }
                
              );
              if (courseUptaded) {
                const course1 =   await Course.findOne({name})
             
                res.status(200).json(course1);
              } else {
                res.status(400);
                throw new Error("Error occured");
              }
             
            
            } catch (error) {
              res.status(400).json({ error: error.message })
            }

}


const deleteMcqQuestion=async(req,res)=>{
  const { questionBankName,name,id } = req.body
  console.log(id)
  const course =   await Course.findOne({name})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
        try {
              const questionBank = (examBank)(course.questionBanks.find(element => element.title == questionBankName));
              
              if(!questionBank){
                return res.status(400).json({error: 'No such bank'})
              }
              var questionBanks = course.questionBanks;
              const updatedQuestionList=questionBank.questions
              var targetQuestionIndex = 0;
              for (
                targetQuestionIndex = 0;
                targetQuestionIndex < updatedQuestionList.length;
                targetQuestionIndex++
              ) {
                if (updatedQuestionList[targetQuestionIndex]._id == id) {
                  // targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              updatedQuestionList.splice(targetQuestionIndex, 1)
              var targetExam;
              var targetExamIndex = 0;
              for (
                targetExamIndex = 0;
                targetExamIndex < questionBanks.length;
                targetExamIndex++
              ) {
                if (questionBanks[targetExamIndex].title == questionBankName) {
                  targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              if (!targetExam) {
                res.status(400);
                throw new Error("Bank does not exist");
              }
              targetExam.questions = updatedQuestionList;
              targetExam.title = questionBankName;
              targetExam.course = name;
              questionBanks[targetExamIndex] = targetExam;
              // (course.questionBanks.find(element => element.title == questionBankName)).questions.push(question);
              //  await course.save()
              const courseUptaded = await Course.findOneAndUpdate(
                { name: name },
                { questionBanks: questionBanks }
                
              );
              if (courseUptaded) {
                const course1 =   await Course.findOne({name})
             
                res.status(200).json(course1);
              } else {
                res.status(400);
                throw new Error("Error occured");
              }
             
            
            } catch (error) {
              res.status(400).json({ error: error.message })
            }

}

const addStudents=async(req,res)=>{
  const {name,students}=req.body
  const course =   await Course.findOne({name})

  if(!course) {
    return res.status(400).json({error: 'No such course'})
 }
 var i
 for( i=0;i<students.length;i++){
 course.students.push(students[i])
 await course.save()
}
 
 res.status(200).json("done")
}
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
  seeMyCourses,
  getinstructor,
  seeCourse,
  seeExams,
  createExam,
  editExam,
  deleteExam,
  addQuestionBank,
  openQuestionBank,
  deleteQuestionBank,
  addMcqQuestion,
  editMcqQuestion,
  deleteMcqQuestion,
  addStudents,
}