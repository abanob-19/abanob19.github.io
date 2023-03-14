const mongoose = require('mongoose')

const Schema = mongoose.Schema
const mcqQuestionSchema = new Schema({
  
  text: {
    type: String,
    required: true,
  },
  choiceA: {
    type: String,
    required: true,
  },
  choiceB: {
    type: String,
    required: true,
  },
  choiceC: {
    type: String,
    required: true,
  },
  choiceD: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
  },
  type:{
    type:String,
    required:true,
  },
});
const textQuestionSchema = new Schema({
  
  text: {
    type: String,
    required: true,
  }, 
  type:{
    type:String,
    required:true,
  },
});
const examBankSchema = new Schema({
    title: {
      type: String,
      required: true,
      unique: true,
    },
    course: {
      type: String,
      required: true,
    },
    questions: {
      type: [mcqQuestionSchema| textQuestionSchema],
      default: [],
    },
  });
  examBank=mongoose.model('examBank', examBankSchema)
  mcqQuestion = mongoose.model('mcqQuestion', mcqQuestionSchema)
  textQuestion = mongoose.model('textQuestion', textQuestionSchema)
  module.exports ={examBank, mcqQuestion,textQuestion}