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
    questions: {
      type: [mcqQuestionSchema| textQuestionSchema],
      required: true,
    },
  });
  module.exports = mongoose.model('examBank', examBankSchema)
  module.exports = mongoose.model('mcqQuestion', mcqQuestionSchema)
  module.exports = mongoose.model('textQuestion', textQuestionSchema)