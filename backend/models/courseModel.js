const mongoose = require('mongoose')
const x =require('../models/examBankModel')
const ExamSpecs = require('../models/examSpecsModel')
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
    type: [ExamSpecs.Schema],
    required: true,
    default : [],
  },
  students: {
    type: [String],
    required: true,
    default : [],
  },

}, { timestamps: true })

module.exports = mongoose.model('course', courseSchema)