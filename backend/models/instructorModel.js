const mongoose = require('mongoose')

const Schema = mongoose.Schema

const instructorSchema = new Schema({
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
    default:"instructor"
  },
  courses: {
    type: [String],
    default: [],
  },
}, { timestamps: true })

module.exports = mongoose.model('instructor', instructorSchema)