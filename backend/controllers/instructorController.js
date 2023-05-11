const Instructor = require('../models/instructorModel')
const Student = require('../models/studentModel')
const ExamSpecs = require('../models/examSpecsModel')
const Course = require('../models/courseModel')
const mongoose = require('mongoose')
const x =require('../models/examBankModel')
const examBank=x.examBank
const { ObjectId } = require('mongodb');
const mcqQuestion=x.mcqQuestion
const textQuestion=x.textQuestion
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile)
const _ = require('lodash');
const { log } = require('console')

const viewPdf=async(req,res)=>{
  const { courseName,qb_id,q_id } = req.params
  console.log(courseName)
  console.log(q_id)
  const course =   await Course.findOne({name:courseName})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
        
              const questionBank = (examBank)(course.questionBanks.find(element => element._id == qb_id));
              
              if(!questionBank){
                return res.status(400).json({error: 'No such bank'})
              }
              var questionBanks = course.questionBanks;
              const updatedQuestionList=questionBank.questions
              var targetQuestionIndex = 0;
              for (
                targetQuestionIndex = 0;
                targetQuestionIndex < updatedQuestionList.length;
                targetQuestionIndex++
              ) {
                if (updatedQuestionList[targetQuestionIndex]._id == q_id) {
                  // targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              res.status(200).json(updatedQuestionList[targetQuestionIndex].attachment.data)
             

}
// donwload pdf or image in a given path 

const downloadFile = async (req, res) => {
  const { attachment } = req.query;
  console.log(attachment)
  const filePath = `${attachment}`;
  res.download(filePath, (err) => {
    console.log("downloading");
      if (err) {
          console.log(err);
          res.status(404).send('File not found');
      }
  });
}
const getImage=async(req,res)=>{
  const { attachment } = req.query;
const filePath = `${attachment}`;
console.log(attachment)

    
    try {
      
      res.status(200).send(`data:image/png;base64,${fs.readFileSync(filePath, { encoding: 'base64' })}`);
    } catch (error) {
      console.error('Failed to retrieve ', error);
      res.status(500).send('Failed to retrieve ');
    }
}
const uploadFile = async (req, res) => {
  const courseName = req.body.courseName;
  const questionId = req.body.questionId;
  const questionBankId = req.body.questionBankId;
  // const attachment = {
  //   filename: req.file.filename,
  // };
  const course = await Course.findOne({ name: courseName });
  if (!course) {
    return res.status(400).json({ error: 'No such course' });
  }
  const questionBank = course.questionBanks.find(qb => qb._id == questionBankId);
  if (!questionBank) {
    return res.status(400).json({ error: 'No such question bank' });
  }
  const question = questionBank.questions.find(q => q._id == questionId);
  if (!question) {
    return res.status(400).json({ error: 'No such question' });
  }
  const folderPath = `./uploads/question-banks/${questionBankId}`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  const filePath = `${folderPath}/${questionId}.${req.file.originalname.split('.').pop()}`;
  fs.renameSync(req.file.path, filePath);
  var questionBanks = course.questionBanks;
  // question.attachment = filePath;
  var targetExamIndex = 0;
  var targetExam;
  for (
    targetExamIndex = 0;
    targetExamIndex < course.questionBanks.length;
    targetExamIndex++
  ) {
    if (course.questionBanks[targetExamIndex]._id == questionBankId) {
      targetExam = questionBanks[targetExamIndex];
      break;
    }
  }
  const updatedQuestionList = questionBanks[targetExamIndex].questions;

  var targetQuestionIndex = 0;
  for (
    targetQuestionIndex = 0;
    targetQuestionIndex < updatedQuestionList.length;
    targetQuestionIndex++
  ) {
    if (updatedQuestionList[targetQuestionIndex]._id == questionId) {
      break;
    }
  }
  updatedQuestionList[targetQuestionIndex].attachment = filePath;
  targetExam.questions = updatedQuestionList;
  questionBanks[targetExamIndex] = targetExam;
  const courseUptaded = await Course.findOneAndUpdate(
    { name: courseName },
    { questionBanks: questionBanks }
  );
  if (courseUptaded) {
    const course1 = await Course.findOne({ name: courseName });
    res.status(200).json(course1);
  } else {
    res.status(400);
    throw new Error('Error occured');
  }
  
};
const uploadChoiceAttachments = async (req, res) => {
  const courseName = req.body.courseName;
  const questionId = req.body.questionId;
  const questionBankId = req.body.questionBankId;
  const choiceIndex = req.body.choiceIndex;
  // const attachment = {
  //   filename: req.file.filename,
  // };
  console.log(questionId)
  const course = await Course.findOne({ name: courseName });
  if (!course) {
    console.log("no such course")
    return res.status(400).json({ error: 'No such course' });
  }
  const questionBank = course.questionBanks.find(qb => qb._id == questionBankId);
  if (!questionBank) {
    console.log("no such question bank")
    return res.status(400).json({ error: 'No such question bank' });
  }
  const question = questionBank.questions.find(q => q._id == questionId);
  if (!question) {
    console.log("no such question")
    return res.status(400).json({ error: 'No such question' });
  }
  const folderPath = `./uploads/choices/${questionBankId}/${questionId}`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  const filePath = `${folderPath}/${choiceIndex}.${req.file.originalname.split('.').pop()}`;
  fs.renameSync(req.file.path, filePath);
  console.log("rename done")
  var questionBanks = course.questionBanks;
  // question.attachment = filePath;
  var targetExamIndex = 0;
  var targetExam;
  for (
    targetExamIndex = 0;
    targetExamIndex < course.questionBanks.length;
    targetExamIndex++
  ) {
    if (course.questionBanks[targetExamIndex]._id == questionBankId) {
      targetExam = questionBanks[targetExamIndex];
      break;
    }
  }
  const updatedQuestionList = questionBanks[targetExamIndex].questions;

  var targetQuestionIndex = 0;
  for (
    targetQuestionIndex = 0;
    targetQuestionIndex < updatedQuestionList.length;
    targetQuestionIndex++
  ) {
    if (updatedQuestionList[targetQuestionIndex]._id == questionId) {
      break;
    }
  }
  updatedQuestionList[targetQuestionIndex].choiceAttachments[choiceIndex] = filePath;
  targetExam.questions = updatedQuestionList;
  questionBanks[targetExamIndex] = targetExam;
  const courseUptaded = await Course.findOneAndUpdate(
    { name: courseName },
    { questionBanks: questionBanks }
  );
  if (courseUptaded) {
    const course1 = await Course.findOne({ name: courseName });
    res.status(200).json(course1);
  } else {
    res.status(400);
    console.log("error occuredx")
    throw new Error('Error occured');
    
  }
  
};
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
const seeExamsForGrade=async(req,res)=>{
  const { id } = req.params
  console.log(id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
          console.log("here")   }
  const instructor =   await Instructor.findById({_id: id})
  if(!instructor) {
           return res.status(400).json({error: 'No such instructor'})
        }
    //for each course in instructor.courses get the exams not graded yet and return them
    var exams=[]
    for (var i = 0; i < instructor.courses.length; i++) {
      const course = await Course.findOne({name: instructor.courses[i]})
      if (course){
        //get all students in this course
        const students = await Student.find({ courses: { $in: [instructor.courses[i]] } });
      for (var j = 0; j < course.exams.length; j++) {
        //loop over students and check if they have taken this exam and if it is graded or not
        var flag =true
        for (var k = 0; k < students.length; k++) { 
          // get exam in student.exams with the same id as course.exams[j]._id
          const exam = students[k].exams.find(e => e.examId .equals(course.exams[j]._id))
          console.log(exam)
      if(exam)
          { if (!exam.graded||exam.graded==false){
           flag=false
         }}
        }
        console.log(flag   , course.exams[j].title)
        if((flag==false) &&(new Date(course.exams[j].endTime)).setHours((new Date(course.exams[j].endTime)).getHours() - 3 )< new Date(Date.now())){
          exams.push(course.exams[j])
        }
      }
    }}
    res.status(200).json(exams)
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
       // Sort exams by start time
const exams=course.exams.sort((a, b) => {
  const dateA = new Date(a.startTime);
  const dateB = new Date(b.startTime);
  if (dateA < dateB) {
    return 1;
  } else if (dateA > dateB) {
    return -1;
  } else {
    // If the dates are equal, compare the times
    const timeA = dateA.getTime();
    const timeB = dateB.getTime();
    if (timeA < timeB) {
      return 1;
    } else if (timeA > timeB) {
      return -1;
    } else {
      return 0;
    }
  }
});


         res.status(200).json(exams)
}
const createExam=async(req,res)=>{
  const { courseName,title,type,startTime,endTime , specs } = req.body
 
      const course =   await Course.findOne({name : courseName})
      console.log(courseName)
      if(!course) {
               return res.status(400).json({error: 'No such course'})
            }
            const examSpecs = new ExamSpecs()
            examSpecs.title=title
            examSpecs.type=type
            examSpecs.startTime=startTime
            examSpecs.endTime=endTime
            examSpecs.specs=specs
            examSpecs.courseName=courseName
            examSpecs.graded=false
       course.exams.push(examSpecs) 
       await course.save();    
       res.status(200).json({course})
}

const editExam=async(req,res)=>{
  const { courseName,title,type,startTime,endTime , specs ,id} = req.body
 
      const course =   await Course.findOne({name : courseName})
      if(!course) {
               return res.status(400).json({error: 'No such course'})
            }
            console.log(id)
            const examSpecs = new ExamSpecs()
            examSpecs._id=id
            examSpecs.title=title
            examSpecs.startTime=startTime
            examSpecs.endTime=endTime
            examSpecs.type=type
            examSpecs.specs=specs
            examSpecs.courseName=courseName
            var targetExam;
            var targetExamIndex = 0;
            for (
              targetExamIndex = 0;
              targetExamIndex < course.exams.length;
              targetExamIndex++
            ) {
              if (course.exams[targetExamIndex]._id == id) {
                targetExam = course.exams[targetExamIndex];
                break;
              }
            }
            if (!targetExam) {
              res.status(400);
              throw new Error("Exam does not exist");
            }
       console.log(id , examSpecs._id)     
       course.exams[targetExamIndex] =examSpecs
       await course.save();    
       res.status(200).json(course);
}
const deleteExam=async(req,res)=>{
  const { courseName,id} = req.body
  console.log(courseName , id)
      const course =   await Course.findOne({name : courseName})
      if(!course) {
               return res.status(400).json({error: 'No such course'})
            }
           
           
            var targetExam;
            var targetExamIndex = 0;
            for (
              targetExamIndex = 0;
              targetExamIndex < course.exams.length;
              targetExamIndex++
            ) {
              if (course.exams[targetExamIndex]._id == id) {
                targetExam = course.exams[targetExamIndex];
                break;
              }
            }
            if (!targetExam) {
              res.status(400);
              throw new Error("Exam does not exist");
            }
       course.exams.splice(targetExamIndex,1)
       await course.save();    
       res.status(200).json(course);
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
  const questionBankName = req.query.questionBankName;
  const name = req.query.name;
  const course =   await Course.findOne({name})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
        try {
              const questionBank = course.questionBanks.find(element => element.title == questionBankName);
              if(!questionBank){
                return res.status(400).json({error: 'No such bank'})
              }
              res.status(200).json(questionBank)
            } catch (error) {
              res.status(400).json({ error: error.message })
            }

}
const deleteQuestionBank=async(req,res)=>{
  const { id,name } = req.body
  console.log(id , name)
  const course =   await Course.findOne({name})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
        try {
              //const questionBank = course.questionBanks.find(element => element.title == questionBankName);
              
              var targetExamIndex = 0;
              for (
                targetExamIndex = 0;
                targetExamIndex < course.questionBanks.length;
                targetExamIndex++
              ) {
                if (course.questionBanks[targetExamIndex]._id == id) {
                  break;
                }
              }
              course.questionBanks.splice(targetExamIndex,1)
              await course.save()
              const course1 =   await Course.findOne({name})
              res.status(200).json(course1)
            } catch (error) {
              res.status(400).json({ error: error.message })
            }

}
const editQuestionBank=async(req,res)=>{
  const { id,name ,qname} = req.body
  console.log(id , name,qname)
  const course =   await Course.findOne({name})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
        
              //const questionBank = course.questionBanks.find(element => element.title == questionBankName);
              
              var targetExamIndex = 0;
              for (
                targetExamIndex = 0;
                targetExamIndex < course.questionBanks.length;
                targetExamIndex++
              ) {
                if (course.questionBanks[targetExamIndex]._id == id) {
                  break;
                }}
              
              // course.questionBanks.splice(targetExamIndex,1)
            const questionBanks=course.questionBanks
              var targetExam = questionBanks[targetExamIndex];
              targetExam.title = qname;
              targetExam.course = name;
              questionBanks[targetExamIndex] = targetExam;
              // (course.questionBanks.find(element => element.title == questionBankName)).questions.push(question);
              //  await course.save()
              const courseUptaded = await Course.findOneAndUpdate(
                { name: name},
                { questionBanks: questionBanks })
                res.status(200).json(courseUptaded)

}
const addMcqQuestion=async(req,res)=>{
  const { questionBankName,name,text,choices,answer,category  , type,attachment} = req.body
  const course =   await Course.findOne({name})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
        try {
              const questionBank = (examBank)(course.questionBanks.find(element => element.title == questionBankName));
              
              if(!questionBank){
                return res.status(400).json({error: 'No such bank'})
              }
              var questionBanks = course.questionBanks;
              var question=null
              console.log(type)
              if(type=="mcq"){
              question=new mcqQuestion()
              question.text=text
              question.choices=choices
              question.answer=answer;
              question.category=category;
              question.attachment=attachment;
              question.choiceAttachments=new Array(question.choices.length).fill(null),
              console.log(question)}
              else if(type=="text"){
                console.log("text")
               question=new textQuestion()
              question.text=text
              question.category=category;
              question.attachment=attachment
              }
              const updatedQuestionList=questionBank.questions
              updatedQuestionList.push(question);
              var targetExam;
              var targetExamIndex = 0;
              for (
                targetExamIndex = 0;
                targetExamIndex < questionBanks.length;
                targetExamIndex++
              ) {
                if (questionBanks[targetExamIndex].title == questionBankName) {
                  targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              if (!targetExam) {
                console.log("Bank does not exist");
                res.status(400);
                throw new Error("Bank does not exist");
              }
              targetExam.questions = updatedQuestionList;
              targetExam.title = questionBankName;
              targetExam.course = name;
              questionBanks[targetExamIndex] = targetExam;
              // (course.questionBanks.find(element => element.title == questionBankName)).questions.push(question);
              //  await course.save()
              const courseUptaded = await Course.findOneAndUpdate(
                { name: name },
                { questionBanks: questionBanks }
                
              );
              if (courseUptaded) {
                res.status(200).json(updatedQuestionList);
              } else {
                res.status(400)
                console.log("Error Course not updated");
                throw new Error("Error occured");
              }
             
            // const course1 =   await Course.findOne({name})
            //   res.status(200).json(course1)
            } catch (error) {
              console.log(error)
              res.status(400).json({ error: error.message })
            }

}

const editMcqQuestion=async(req,res)=>{
  const { questionBankId,name,text,choices,answer,category,id , index} = req.body
  console.log(id)
  const course =   await Course.findOne({name})
  if(!course) {
    console.log("no such course")
           return res.status(400).json({error: 'No such course'})
          
        }
        try {
              const questionBank = (examBank)(course.questionBanks.find(element => element._id == questionBankId));
              const questionx=questionBank.questions.find(element => element._id == id)
              if(!questionBank){
                return res.status(400).json({error: 'No such bank'})
              }
              var questionBanks = course.questionBanks;
              var question=null
              if(questionx.type=="mcq"){
               question=new mcqQuestion()
              question.text=text
              question._id=id
              question.choices=choices
              question.answer=answer;
              question.category=category;
              question.attachment=questionBank.questions.find(element => element._id == id).attachment
              if(questionx.choiceAttachments){
              const diff=choices.length-questionx.choiceAttachments.length
              if(diff>0){
                for(let i=0;i<diff;i++){
                  if(!question.choiceAttachments){
                    question.choiceAttachments=new Array(diff).fill(null);
                    break;
                  }
                       
                  question.choiceAttachments.push(null)
                }
              
              }
              
              if(index){
                if(questionx.choiceAttachments[index]){
                fs.unlink(questionx.choiceAttachments[index], (err) => {
                  if (err) {
                   console.error(err);
                 } else {
                   console.log(`Deleted file at ${questionx.choiceAttachments[index]}`);
                 }
                  });}
                question.choiceAttachments = [
                  ...questionx.choiceAttachments.slice(0, index),
                  ...questionx.choiceAttachments.slice(index + 1),
                ];
                
                 
               
                console.log(question.choiceAttachments)
                for (let i = 0; i < question.choiceAttachments.length; i++) {
                  if(question.choiceAttachments[i]){
                  const folderPath = `./uploads/choices/${questionBankId}/${id}`;
                  
                  const filePath = `${folderPath}/${i}.${question.choiceAttachments[i].split('.').pop()}`;
                fs.rename(question.choiceAttachments[i], filePath, (err) => {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log(`Renamed `);
                  }
                });
                question.choiceAttachments[i]=filePath}}
              }
            else
              question.choiceAttachments=questionx.choiceAttachments}
              else{
                question.choiceAttachments=new Array(questionx.choices.length).fill(null);
              }
            }
              else if(questionx.type=="text"){
                 question=new textQuestion()
                question.text=text
                question.category=category;
                question.attachment=questionBank.questions.find(element => element._id == id).attachment
                }
                const updatedQuestionList=questionBank.questions
             
              var targetQuestionIndex = 0;
              for (
                targetQuestionIndex = 0;
                targetQuestionIndex < updatedQuestionList.length;
                targetQuestionIndex++
              ) {
                if (updatedQuestionList[targetQuestionIndex]._id == id) {
                  // targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              updatedQuestionList[targetQuestionIndex]=question;
              var targetExam;
              var targetExamIndex = 0;
              for (
                targetExamIndex = 0;
                targetExamIndex < questionBanks.length;
                targetExamIndex++
              ) {
                if (questionBanks[targetExamIndex]._id == questionBankId) {
                  targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              if (!targetExam) {
                res.status(400);
                console.log("Bank does not exist");
                throw new Error("Bank does not exist");
                
              }
              targetExam.questions = updatedQuestionList;
              targetExam.course = name;
              questionBanks[targetExamIndex] = targetExam;
              // (course.questionBanks.find(element => element.title == questionBankName)).questions.push(question);
              //  await course.save()
              const courseUptaded = await Course.findOneAndUpdate(
                { name: name },
                { questionBanks: questionBanks }
                
              );
              if (courseUptaded) {
                const course1 =   await Course.findOne({name})
             
                res.status(200).json(course1);
              } else {
                res.status(400);
                console.log("Error Course not updated")
                throw new Error("Error occured");
                ;
              }
             
            
            } catch (error) {
              res.status(400).json({ error: error.message })
              console.log(error)
            }

}
const editMcqQuestionAttachment=async(req,res)=>{
  const { questionBankId,name,text,choices,answer,category,id , index} = req.body
  console.log(id)
  const course =   await Course.findOne({name})
  if(!course) {
    console.log("no such course")
           return res.status(400).json({error: 'No such course'})
          
        }
        try {
              const questionBank = (examBank)(course.questionBanks.find(element => element._id == questionBankId));
              const questionx=questionBank.questions.find(element => element._id == id)
              if(!questionBank){
                return res.status(400).json({error: 'No such bank'})
              }
              var questionBanks = course.questionBanks;
              var question=null
              if(questionx.type=="mcq"){
               question=new mcqQuestion()
              question.text=text
              question._id=id
              question.choices=choices
              question.answer=answer;
              question.category=category;
              question.attachment=questionBank.questions.find(element => element._id == id).attachment
              if(questionx.choiceAttachments){
              const diff=choices.length-questionx.choiceAttachments.length
              if(diff>0){
                for(let i=0;i<diff;i++){
                  if(!question.choiceAttachments){
                    question.choiceAttachments=new Array(diff).fill(null);
                    break;
                  }
                       
                  question.choiceAttachments.push(null)
                }
              
              }
              
              if(index){
                if(questionx.choiceAttachments[index]){
                fs.unlink(questionx.choiceAttachments[index], (err) => {
                  if (err) {
                   console.error(err);
                 } else {
                   console.log(`Deleted file at ${questionx.choiceAttachments[index]}`);
                 }
                  });}
                question.choiceAttachments = [
                  ...questionx.choiceAttachments.slice(0, index),
                  ...questionx.choiceAttachments.slice(index + 1),
                ];
                
                 
               
                console.log(question.choiceAttachments)
              }
            else
              question.choiceAttachments=questionx.choiceAttachments}
              else{
                question.choiceAttachments=new Array(questionx.choices.length).fill(null);
              }
            }
              else if(questionx.type=="text"){
                 question=new textQuestion()
                question.text=text
                question.category=category;
                question.attachment=questionBank.questions.find(element => element._id == id).attachment
                }
                const updatedQuestionList=questionBank.questions
             
              var targetQuestionIndex = 0;
              for (
                targetQuestionIndex = 0;
                targetQuestionIndex < updatedQuestionList.length;
                targetQuestionIndex++
              ) {
                if (updatedQuestionList[targetQuestionIndex]._id == id) {
                  // targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              updatedQuestionList[targetQuestionIndex]=question;
              var targetExam;
              var targetExamIndex = 0;
              for (
                targetExamIndex = 0;
                targetExamIndex < questionBanks.length;
                targetExamIndex++
              ) {
                if (questionBanks[targetExamIndex]._id == questionBankId) {
                  targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              if (!targetExam) {
                res.status(400);
                console.log("Bank does not exist");
                throw new Error("Bank does not exist");
                
              }
              targetExam.questions = updatedQuestionList;
              targetExam.course = name;
              questionBanks[targetExamIndex] = targetExam;
              // (course.questionBanks.find(element => element.title == questionBankName)).questions.push(question);
              //  await course.save()
              const courseUptaded = await Course.findOneAndUpdate(
                { name: name },
                { questionBanks: questionBanks }
                
              );
              if (courseUptaded) {
                const course1 =   await Course.findOne({name})
             
                res.status(200).json(course1);
              } else {
                res.status(400);
                console.log("Error Course not updated")
                throw new Error("Error occured");
                ;
              }
             
            
            } catch (error) {
              res.status(400).json({ error: error.message })
              console.log(error)
            }

}


const deleteMcqQuestion=async(req,res)=>{
  const { questionBankId,name,id } = req.body
  console.log(id)
  const course =   await Course.findOne({name})
  if(!course) {
    console.log("no such course")
           return res.status(400).json({error: 'No such course'})
        }
        try {
              const questionBank = (examBank)(course.questionBanks.find(element => element._id == questionBankId));
              
              if(!questionBank){
                console.log("no such bank")
                return res.status(400).json({error: 'No such bank'})
              }
              var questionBanks = course.questionBanks;
              const updatedQuestionList=questionBank.questions
              var targetQuestionIndex = 0;
              for (
                targetQuestionIndex = 0;
                targetQuestionIndex < updatedQuestionList.length;
                targetQuestionIndex++
              ) {
                if (updatedQuestionList[targetQuestionIndex]._id == id) {
                  // targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              const folder= `./uploads/choices/${questionBankId}/${id}`
              var flag=false
              //loop over choiceAttachments to check that at least one is not null
              for (let i=0;i<updatedQuestionList[targetQuestionIndex].choiceAttachments.length;i++){
                if(updatedQuestionList[targetQuestionIndex].choiceAttachments[i]){
                   flag=true
                }
              }
              if (flag)
             { 
              fs.rm(folder, { recursive: true }, (err) => {
                if (err) {
                 console.error(err);
               } else {
                 console.log(`Deleted file at ${folder}`);
               }
                });}
                if(updatedQuestionList[targetQuestionIndex].attachment){fs.unlink(updatedQuestionList[targetQuestionIndex].attachment, (err) => {
                  if (err) {
                   console.error(err);
                 } else {
                   console.log(`Deleted file at}`);
                 }
                  });}
              updatedQuestionList.splice(targetQuestionIndex, 1)
              var targetExam;
              var targetExamIndex = 0;
              for (
                targetExamIndex = 0;
                targetExamIndex < questionBanks.length;
                targetExamIndex++
              ) {
                if (questionBanks[targetExamIndex]._id == questionBankId) {
                  targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              if (!targetExam) {
                console.log("Bank does not exist")
                res.status(400);
                throw new Error("Bank does not exist");
              }
              targetExam.questions = updatedQuestionList;
              targetExam.course = name;
              questionBanks[targetExamIndex] = targetExam;
              // (course.questionBanks.find(element => element.title == questionBankName)).questions.push(question);
              //  await course.save()
              const courseUptaded = await Course.findOneAndUpdate(
                { name: name },
                { questionBanks: questionBanks }
                
              );
              if (courseUptaded) {
                const course1 =   await Course.findOne({name})
             
                res.status(200).json(course1);
              } else {
                res.status(400);
                console.log("Error Course not updated")
                throw new Error("Error occured");
              }
             
            
            } catch (error) {
              console.log(error)
              res.status(400).json({ error: error.message })
            }

}
const deleteMcqQuestionAttachment=async(req,res)=>{
  const { questionBankId,name,id } = req.body
  console.log(id)
  const course =   await Course.findOne({name})
  if(!course) {
           return res.status(400).json({error: 'No such course'})
        }
        try {
              const questionBank = (examBank)(course.questionBanks.find(element => element._id == questionBankId));
              
              if(!questionBank){
                return res.status(400).json({error: 'No such bank'})
              }
              var questionBanks = course.questionBanks;
              const updatedQuestionList=questionBank.questions
              var targetQuestionIndex = 0;
              for (
                targetQuestionIndex = 0;
                targetQuestionIndex < updatedQuestionList.length;
                targetQuestionIndex++
              ) {
                if (updatedQuestionList[targetQuestionIndex]._id == id) {
                  // targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              const q= updatedQuestionList[targetQuestionIndex]
              
                fs.unlink(q.attachment, (err) => {
                  if (err) {
                   console.error(err);
                 } else {
                   console.log(`Deleted file at ${q.attachment}`);
                 }
                  });
              q.attachment=null
              updatedQuestionList[targetQuestionIndex]=q
              var targetExam;
              var targetExamIndex = 0;
              for (
                targetExamIndex = 0;
                targetExamIndex < questionBanks.length;
                targetExamIndex++
              ) {
                if (questionBanks[targetExamIndex]._id == questionBankId) {
                  targetExam = questionBanks[targetExamIndex];
                  break;
                }
              }
              if (!targetExam) {
                res.status(400);
                throw new Error("Bank does not exist");
              }
              targetExam.questions = updatedQuestionList;
              targetExam.course = name;
              questionBanks[targetExamIndex] = targetExam;
              // (course.questionBanks.find(element => element.title == questionBankName)).questions.push(question);
              //  await course.save()
              const courseUptaded = await Course.findOneAndUpdate(
                { name: name },
                { questionBanks: questionBanks }
                
              );
              if (courseUptaded) {
                const course1 =   await Course.findOne({name})
             
                res.status(200).json(course1);
              } else {
                res.status(400);
                throw new Error("Error occured");
              }
             
            
            } catch (error) {
              res.status(400).json({ error: error.message })
            }

}

const addStudents=async(req,res)=>{
  const {name,students}=req.body
  const course =   await Course.findOne({name})

  if(!course) {
    return res.status(400).json({error: 'No such course'})
 }
 var i
 for( i=0;i<students.length;i++){
 course.students.push(students[i])
 await course.save()
}
 
 res.status(200).json("done")
}
const getQuestionsForExam = async (req, res) => {
  const examId= req.query.examId;
    const courseName = req.query.courseName;
  
  console.log(examId , courseName);
  try {
    let exam = null;
    let myCourse=null;
    // find the exam in MongoDB by id in the given course
    await Course.findOne(
      { name: courseName },
    )
      .then((course) => {
        if (!course) {
          console.log("Course not found");
          return;
        }
        else{
          myCourse=course 
        }

         // since we used $elemMatch, the result is an array with one element
        // do something with the exam
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
      
for( let i=0;i<myCourse.exams.length;i++){
  console.log(myCourse.exams[i]._id.toString())
    console.log(examId.toString())
  if(myCourse.exams[i]._id.equals(examId.trim())){
    exam=myCourse.exams[i]
    console.log("found")
    break;
  }
}
if(!exam){
  return res.status(400).json({error: 'No such exam'})
}
    
      
    // extract the specs array from the exam
    const specsArray = exam.specs;

    // initialize an empty array to store the questions
    const questions = [];

    // loop through the specs array
    for (let i = 0; i < specsArray.length; i++) {
      const { chapter, category, numQuestions } = specsArray[i];

      // find the question bank in the questionBanks array by name
      const questionBank = myCourse.questionBanks.find((qb) => qb.title === chapter);

      // find the questions in the questions array with the given category and numQuestions
      const questionsForChapter = _.sampleSize(questionBank.questions.filter((q) => q.category === category), numQuestions);
      const selectedQuestions = questionsForChapter.slice(0, numQuestions);

      for (let j = 0; j < selectedQuestions.length; j++) {
        const question = selectedQuestions[j];
        const variables = {};

        // replace variables in the question text
        question.text = question.text.replace(/%%([^%]+)%%/g, (match, variable) => {
          if (!variables[variable]) {
            variables[variable] = Math.floor(Math.random() * 1000);
          }
          return variables[variable];
        });
        const regex = /equation\((.*?)\)/g; // matches any text inside 'equation(...)' and captures it

         question.text = question.text.replace(regex, (match, equation) => {
          return eval(equation); // evaluates the captured equation and returns its result
        });
        // check if the question type is mcq
        if (question.type === "mcq") {
          // loop through the choices
          for (let k = 0; k < question.choices.length; k++) {
            const choice = question.choices[k];
           
            // replace variables in the choice text
            question.choices[k] = choice.replace(/%%([^%]+)%%/g, (match, variable) => {
              if (!variables[variable]) {
                variables[variable] = Math.floor(Math.random() * 1000);
              }
              return variables[variable];
            });
            const regex = /equation\((.*?)\)/g; // matches any text inside 'equation(...)' and captures it
            const choice2=question.choices[k]
             question.choices[k]= choice2.replace(regex, (match, equation) => {
             return eval(equation); // evaluates the captured equation and returns its result
           });
            if(question.answer==choice)
            question.answer = question.choices[k];

          }
        }

        // add the modified question to the array
        questions.push(question);
      }
    }
    

    // return the questions
    return res.send(questions);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};
// get student ids taking an exam with examId and courseName from student collection and return them

const getStudentsForExam = async (req, res) => {
  const examId= req.query.examId;
  const courseName = req.query.courseName;
  console.log("here")
  console.log(examId , courseName);
  try {
    //retireve array of all students
    const students = await Student.find();
    var i=0;
    var studentsTakingExam=[];
    for(i=0;i<students.length;i++){
      var j=0;
      for(j=0;j<students[i].exams.length;j++){
        if(students[i].exams[j].examId.equals(examId.trim())){
          var k=0;
         console.log(students[i].exams[j].questions.length)
          for(k=0;k<students[i].exams[j].questions.length;k++){
            console.log(students[i].exams[j].questions[k].type, students[i].exams[j].questions[k].graded)
            if(students[i].exams[j].questions[k].type=="text" && (students[i].exams[j].questions[k].graded==false)){
          studentsTakingExam.push(students[i]._id)
        break ;}
        }
      }
    }}
    
    console.log(studentsTakingExam)
    return res.send(studentsTakingExam);

    
    // await Student.find(
    //   { "exams.examId":  examId.trim()},
    // )
    //   .then((students) => {
    //     if (!students) {
    //       console.log("No students found");
    //       return;
    //     }
    //     else{
    //       console.log(students)
    //       return res.send(students);
    //     }
    //   })
    //   .catch((error) => {
    //     // handle error
    //     console.log(error);
    //   });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
};
const getStudentsForExam2 = async (req, res) => {
  const examId= req.query.examId;
  const courseName = req.query.courseName;
  console.log("here")
  console.log(examId , courseName);
  try {
    //retireve array of all students
    const students = await Student.find();
    var i=0;
    var studentsTakingExam=[];
    for(i=0;i<students.length;i++){
      var j=0;
      for(j=0;j<students[i].exams.length;j++){
        if(students[i].exams[j].examId.equals(examId.trim())){    
          studentsTakingExam.push(students[i])
          break;
        
      }
    }}
    console.log(studentsTakingExam)
    return res.send(studentsTakingExam);

    
    // await Student.find(
    //   { "exams.examId":  examId.trim()},
    // )
    //   .then((students) => {
    //     if (!students) {
    //       console.log("No students found");
    //       return;
    //     }
    //     else{
    //       console.log(students)
    //       return res.send(students);
    //     }
    //   })
    //   .catch((error) => {
    //     // handle error
    //     console.log(error);
    //   });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
};
// make a function that takes an examId and courseName and studentId and returns the questions that have type text and the answers for the student  with studentId
const getExamTextQuestions = async (req, res) => {
  const examId= req.query.examId;
  const courseName = req.query.courseName;
  const studentId = req.query.studentId;
  console.log(examId , courseName,studentId);
  var questions=[]
  var answers=[]
  var drawings=[]
  let exams=null
  let exam=null
  try {
    await Student.findById(studentId)
      .then(async (student) => {
        if (!student) {
          console.log("Student not found");
          return;
        }
        else{
          var j=0;
          exams=student.exams
          for(j=0;j<student.exams.length;j++){
            if((student.exams[j].examId.equals(examId.trim()))&&(student.exams[j].courseName==courseName)){
              exam=student.exams[j]
              var k=0;
              for(k=0;k<student.exams[j].questions.length;k++){
                if(student.exams[j].questions[k].type=="text" && (!student.exams[j].questions[k].graded)){
                  
                  console.log(student.exams[j].studentAnswers)
                  questions.push(student.exams[j].questions[k])
                  answers.push(student.exams[j].studentAnswers[k])
                  drawings.push(student.exams[j].questions[k].drawing)
                }
              }
            }
        }
  }
  if(answers.length==0)
  {
    exam.graded=true
    exams[j]=exam
    student.exams=exams
    await student.save()
  }
       
  return res.send({questions:questions,answers:answers,drawings:drawings});
})
      .catch((error) => {
        // handle error
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
};
const submitAnswers = async (req, res) => {
  const examId= req.body.examId;
  const courseName = req.body.courseName;
  const studentId = req.body.studentId;
  const questionId = req.body.questionId;
  const grade = req.body.grade;
  try {
    await Student.findById(studentId)
      .then(async (student) => {
        if (!student) {
          console.log("Student not found");
          return;
        }
        else{
          let exams=student.exams
          let exam=null
          var j=0;
          var flag=true
          for(j=0;j<student.exams.length;j++){
            
            if((student.exams[j].examId.equals(examId.trim()))&&(student.exams[j].courseName==courseName) ){
              exam=student.exams[j]
              var k=0;
              for(k=0;k<student.exams[j].questions.length;k++){
                if(exam.questions[k]._id.equals(questionId.trim())&&(!exam.questions[k].graded)){
                  console.log("here")
                  exam.studentGrades[k]=parseInt(grade)
                  exam.questions[k].graded=true
                  exam.totalGrade=exam.totalGrade+parseInt(grade)
                  
                  break;
                }
              }
              for(k=0;k<student.exams[j].questions.length;k++){
                if(exam.questions[k].graded==false){
                  flag=false
                }
              }
              if (flag)
              exam.graded=true
              exams[j]=exam
              console.log(exam)
              //update student exams array with the new exam
              student.exams=exams
              await student.save()
              break;
            }
        }
        // let exams=student.exams
  }
  return res.status(200).send("success");
})
      .catch((error) => {
        // handle error
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }}
    
  const getScreenshots = async (req, res) => {
    const { courseName, studentId, examId } = req.query;
    console.log(courseName, studentId, examId);
    const directoryPath = path.join(__dirname, 'screenshots', `${courseName}`, `${examId}`, `${studentId}`);
    
    try {
      const files = await fs.promises.readdir(directoryPath);
      const screenshots = files.map((file) => {
        const filePath = path.join(directoryPath, file);
        return `data:image/png;base64,${fs.readFileSync(filePath, { encoding: 'base64' })}`;
      });
      
      res.status(200).json({ screenshots });
    } catch (error) {
      console.error('Failed to retrieve screenshots', error);
      res.status(500).send('Failed to retrieve screenshots');
    }
  };
  






module.exports = {
  seeMyCourses,
  getinstructor,
  seeCourse,
  seeExams,
  createExam,
  editExam,
  deleteExam,
  addQuestionBank,
  openQuestionBank,
  deleteQuestionBank,
  editQuestionBank,
  addMcqQuestion,
  editMcqQuestion,
  deleteMcqQuestion,
  addStudents,
  uploadFile,
  viewPdf,
  getQuestionsForExam,
  seeExamsForGrade,
  getStudentsForExam,
  getStudentsForExam2,
  getExamTextQuestions,
  submitAnswers,
  getScreenshots,
  downloadFile,
  getImage,
  uploadChoiceAttachments,
  editMcqQuestionAttachment,
  deleteMcqQuestionAttachment,
}