const Instructor = require('../models/instructorModel')
const Course = require('../models/courseModel')
const mongoose = require('mongoose')
const x =require('../models/examBankModel')
const examBank=x.examBank
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
  const { questionBankName,name } = req.body
  const course =   await Course.findOne({name})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
        try {
              const questionBank = course.questionBanks.find(element => element.title == questionBankName);
              res.status(200).json(questionBank)
            } catch (error) {
              res.status(400).json({ error: error.message })
            }

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
  addQuestionBank,
  openQuestionBank,
}