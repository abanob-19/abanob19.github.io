const mongoose = require('mongoose')

const Schema = mongoose.Schema

const examSpecsSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique:true
  },
  type: {
    type: String,
    required: true
  },
  startTime:{ 
    type: Date , 
    required : true
},
  endTime:{ 
    type: Date , 
    required : true
},
  specs: {
    type: Array,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  graded: {
    type: Boolean,
    required: true
  },
 
}, { timestamps: true })

module.exports = mongoose.model('examSpecs', examSpecsSchema)