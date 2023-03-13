const mongoose = require('mongoose')
const examBankSchema = require('../models/examBankModel')

const Schema = mongoose.Schema

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  questionBanks: {
    type: [examBankSchema],
    required: true
  },
  exams: {
    type: [String],
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('course', courseSchema)