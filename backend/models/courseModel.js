const mongoose = require('mongoose')
const x =require('../models/examBankModel')
const examBank=x.examBank

const Schema = mongoose.Schema

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  questionBanks: 
  { type: [examBank.Schema], required: true }
  ,
  exams: {
    type: [String],
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('course', courseSchema)