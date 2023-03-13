const Student = require('../models/studentModel')
const mongoose = require('mongoose')

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
}