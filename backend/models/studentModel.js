const mongoose = require('mongoose')

const Schema = mongoose.Schema

const studentSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },role: {
    type: String,
    default:"student"
  },
  courses: {
    type: [String],
    default: [],
  },
  exams: {
    type: [],
    default: [],
  },
}, { timestamps: true })

module.exports = mongoose.model('student', studentSchema)