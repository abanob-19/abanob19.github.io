const Student = require('../models/studentModel')
const mongoose = require('mongoose')
const Course = require('../models/courseModel')
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
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
const uploadFile = async (req, res) => {
  const { courseName,studentId, examId , questionId } = req.body;
  console.log(req.file)
  // const attachment = {
  //   filename: req.file.filename,
  // };
  
  const folderPath = `./uploads/studentAttachments/${studentId}/${courseName}/${examId}`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  const filePath = `${folderPath}/${questionId}.${req.file.originalname.split('.').pop()}`;
  fs.renameSync(req.file.path, filePath);
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
          for(j=0;j<student.exams.length;j++){
            
            if((student.exams[j].examId.equals(examId.trim()))&&(student.exams[j].courseName==courseName) ){
              exam=student.exams[j]
              var k=0;
              for(k=0;k<student.exams[j].questions.length;k++){
                if(exam.questions[k]._id.equals(questionId.trim())&&(!exam.questions[k].graded)){
                  console.log("here")
                  exam.questions[k].studentAttachment=filePath
                  exams[j]=exam
                  break;
                }
              }
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
  }
  
};
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

const seeMyCourses=async(req,res)=>{
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({error: 'No such student'})     }
    const student =   await Student.findById({_id: id})
    if(!student) {
             return res.status(400).json({error: 'No such student'})
          }
           res.status(200).json(student.courses)
  
  }  
  const seeExamsForGrades=async(req,res)=>{
    const { courseName , studentId } = req.query
    const student =   await Student.findById({_id: studentId.trim()})
  if(!student) {
           return res.status(400).json({error: 'No such student'})
        }
      //  return student.exams that have courseName = name
      const exams = student.exams.filter((exam) => exam.courseName === courseName.trim() && exam.graded===true);

    res.status(200).json(exams)
  }
  const seeExams=async(req,res)=>{
    const { name } = req.params
    const course =   await Course.findOne({name})
    if(!course) {
             return res.status(400).json({error: 'No such course'})
          }
          const exams=course.exams.sort((a, b) => {
            const dateA = new Date(a.endTime);
            const dateB = new Date(b.endTime);
            if (dateA < dateB) {
              return -1;
            } else if (dateA > dateB) {
              return 1;
            } else {
              // If the dates are equal, compare the times
              const timeA = dateA.getTime();
              const timeB = dateB.getTime();
              if (timeA < timeB) {
                return -1;
              } else if (timeA > timeB) {
                return 1;
              } else {
                return 0;
              }
            }
          });
          var exams2=[]
          var j=0;
          for(j=0;j<exams.length;j++){
            if((new Date(course.exams[j].endTime)).setHours((new Date(course.exams[j].endTime)).getHours() - 3 )>= new Date(Date.now()))
            exams2.push(exams[j])
          }
    res.status(200).json(exams2)
  }

  const getQuestionsForExam = async (req, res) => {
    const examId= req.query.examId;
   
      const courseName = req.query.courseName;
    
       const  id  = req.query.Id
    // if (!mongoose.Types.ObjectId.isValid(id.trim())) {
    //         return res.status(400).json({error: ' Invalid Id No such student'})     }
    const student =   await Student.findById({_id: id.trim()})
    if(!student) {
             return res.status(400).json({error: 'No such student'})
          }
    
    console.log(examId , courseName);
    try {
      const examx = student.exams.find((exam) => exam.examId.equals(examId.trim()));
      var drawingsForStudent1=[]
     
      if (examx) {
        console.log("already generated");
        for (let i = 0; i < examx.questions.length; i++) {
          if(examx.questions[i].drawing)
            drawingsForStudent1.push(examx.questions[i].drawing)
            else 
            drawingsForStudent1.push(null)
          }
        return res.send({Questions:examx.questions , submitted:examx.submitted, answers:examx.studentAnswers , drawingsForStudent:drawingsForStudent1});
      }
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
        const { chapter, category, numQuestions , grade} = specsArray[i];
  
        // find the question bank in the questionBanks array by name
        const questionBank = myCourse.questionBanks.find((qb) => qb.title === chapter);
  
        // find the questions in the questions array with the given category and numQuestions
        const questionsForChapter = _.sampleSize(questionBank.questions.filter((q) => q.category === category), numQuestions);
        const selectedQuestions = questionsForChapter.slice(0, numQuestions);
      //loop over questions to set grade for each question
        for(let j=0;j<selectedQuestions.length;j++){
          selectedQuestions[j].grade=grade
        }
        // add the questions to the array
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
          question.graded=false
          questions.push(question);
        }
      }
      
      var totalGrade=0;
      //loop over questions to calculate total grade
      for(let i=0;i<questions.length;i++){
        totalGrade+=parseInt(questions[i].grade)
      }
  
      // return the questions
      const examForStudent= {
        examId:exam._id,
        title:exam.title,
        courseName:courseName,
        questions:questions,
        studentAnswers:new Array(questions.length).fill(''),
        studentGrades:new Array(questions.length).fill(0),
        totalGrade:0,
        totalPossibleGrade:totalGrade,
        submitted:false,
        graded:false,
      }
      const drawingsForStudent=new Array(questions.length).fill(null)
      student.exams.push(examForStudent)
      await student.save()
      return res.send({Questions:questions , submitted:examForStudent.submitted, answers:examForStudent.studentAnswers, drawingsForStudent:drawingsForStudent});
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
  };
  const SubmitExam = async (req, res) => {
    const examId= req.body.examId;
    const answers=req.body.answers
    const courseName = req.body.courseName;
    const  id  = req.body.Id
    const drawings=req.body.drawings
  // if (!mongoose.Types.ObjectId.isValid(id.trim())) {
  //         return res.status(400).json({error: ' Invalid Id No such student'})     }
  const student =   await Student.findById({_id: id.trim()})
  if(!student) {
           return res.status(400).json({error: 'No such student'})
        }
  
  console.log(examId , courseName);
  try {
    const examx = student.exams.find((exam) => exam.examId.equals(examId.trim()) && exam.courseName===courseName);
    if (examx) {
      console.log("found");
    }
    else{
      console.log("no such exam")
    }
    var totalGrade=0
    const answerEntries = Object.entries(answers);
    const questionAnswers = answerEntries.map(([questionId, answer]) => ({ questionId, answer }));

    console.log(questionAnswers.length)
    // loop through the answers array and store every answer in the corresponding question.studentAnswer in questions array in the exam
    for (let i = 0; i < questionAnswers.length; i++) {
      //get questionId and answer from  answers which ia a json object of the form {questionId:answer}


      const { questionId, answer } = questionAnswers[i];
      console.log(questionId,answer)
      const index = examx.questions.findIndex((q) => q._id.equals(questionId));
      examx.studentAnswers[index]=answer
      const question = examx.questions.find((q) => q._id.equals(questionId));
      
      // calculate the grade for the question
      //get the choice text of the choice that has the same index as the answer
      if(question.type=='mcq'){
      const choice = question.choices[answer];
      const correctAnswer = question.answer;
      if (correctAnswer===choice) {
        examx.studentGrades[index] = parseInt(question.grade);;
        totalGrade+=parseInt(question.grade);
        examx.questions[i].graded=true
      } else {
        examx.studentGrades[index] = 0;
        examx.questions[i].graded=true
      }}
      else if(question.type=='text'){
        if(drawings){
          if(drawings[questionId]){
           examx.questions[i].drawing=drawings[questionId]
          }
        }
      }
     
    }
    examx.totalGrade=totalGrade
    examx.submitted=true
    // update the exams array of the student with the edited exam examx
    const index = student.exams.findIndex((exam) => exam.examId.equals(examId.trim()) && exam.courseName===courseName);
    student.exams[index] = examx;
    // save the student
    await student.save();
    console.log("Submitted")
   res.send("Submitted")
  }
  catch(err){
    console.log(err)
    res.status(500).send(err);
  }
}
const saveAnswers = async (req, res) => {
  const examId= req.body.examId;
  const answers=req.body.answers
  const courseName = req.body.courseName;
  const  id  = req.body.Id
  const drawings=req.body.drawings
// if (!mongoose.Types.ObjectId.isValid(id.trim())) {
//         return res.status(400).json({error: ' Invalid Id No such student'})     }
const student =   await Student.findById({_id: id.trim()})
if(!student) {
         return res.status(400).json({error: 'No such student'})
      }

console.log(examId , courseName);
try {
  const examx = student.exams.find((exam) => exam.examId.equals(examId.trim()) && exam.courseName===courseName);
  if (examx) {
    console.log("found");
  }
  else{
    console.log("no such exam")
  }
  var totalGrade=0
  const answerEntries = Object.entries(answers);
  const questionAnswers = answerEntries.map(([questionId, answer]) => ({ questionId, answer }));

  console.log(questionAnswers.length)
  // loop through the answers array and store every answer in the corresponding question.studentAnswer in questions array in the exam
  for (let i = 0; i < questionAnswers.length; i++) {
    //get questionId and answer from  answers which ia a json object of the form {questionId:answer}


    const { questionId, answer } = questionAnswers[i];
    console.log(questionId,answer)
    const index = examx.questions.findIndex((q) => q._id.equals(questionId));
    examx.studentAnswers[index]=answer
    const question = examx.questions.find((q) => q._id.equals(questionId));
    
    // calculate the grade for the question
    //get the choice text of the choice that has the same index as the answer
    if(question.type=='mcq'){
    const choice = question.choices[answer];
    const correctAnswer = question.answer;
    if (correctAnswer===choice) {
      examx.studentGrades[index] = parseInt(question.grade);;
      totalGrade+=parseInt(question.grade);
      examx.questions[i].graded=true
    } else {
      examx.studentGrades[index] = 0;
      examx.questions[i].graded=true
    }}
    else if(question.type=='text'){
      if(drawings){
        if(drawings[questionId]){
         examx.questions[i].drawing=drawings[questionId]
        }
        else{
          examx.questions[i].drawing=null
        }
      }
    }
   
  }
  examx.totalGrade=totalGrade
  // update the exams array of the student with the edited exam examx
  const index = student.exams.findIndex((exam) => exam.examId.equals(examId.trim()) && exam.courseName===courseName);
  student.exams[index] = examx;
  // save the student
  await student.save();
  console.log("saved")
 res.send("saved")
}
catch(err){
  console.log(err)
  res.status(500).send(err);
}
}
const saveScreenshot = async (req, res) => {
  const { courseName,studentId, examId } = req.body;
  const screenshotDataUrl = req.body.screenshot;
  const filename = `screenshot_${Date.now()}.png`;
  const directoryPath = path.join(__dirname, 'screenshots', `${courseName}`, `${examId}`, `${studentId}`);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const filepath = path.join(directoryPath, filename);
  
  const buffer = Buffer.from(screenshotDataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  fs.writeFile(filepath, buffer, (err) => {
    if (err) {
      console.error('Failed to save screenshot', err);
      res.status(500).send('Failed to save screenshot');
    } else {
      console.log(`Saved screenshot to ${filepath}`);
      res.status(200).json({ message: 'Screenshot saved' });
    }
  });
};



module.exports = {
  getStudent,
  seeMyCourses,
  seeExams,
  getQuestionsForExam,
  SubmitExam,
  saveScreenshot,
  seeExamsForGrades,
  uploadFile,
  downloadFile,
  saveAnswers,
}