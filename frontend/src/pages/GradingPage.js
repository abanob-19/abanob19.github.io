import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import styles from '../pages/Instructor.module.css';
import InstructorNavbar from "../components/instructorNavbar";
const GradingPage = () => {
    const location = useLocation();
  const [questions, setQuestions] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const courseName = searchParams.get('courseName'); 
  const examId = searchParams.get('examId');
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [students, setStudents] = useState(null);
  const[index, setIndex] = useState(0);
const [answers, setAnswers] = useState(null);
const [version, setVersion] = useState(0);
const [loading, setLoading] = useState(true);
const [selectedOption, setSelectedOption] = useState([]);
const [allGraded, setAllGraded] = useState(false);
const [subVersion, setSubVersion] = useState(0);
const [allStudentsGraded, setAllStudentsGraded] = useState(false);
  useEffect(() => {
    // Fetch questions from backend API
    const fetchQuestions = async () => {
        // if(currentStudentId && students[0] && currentStudentId._id.equals(students[0]))
      try {
        if (currentStudentId) {
            setLoading(true);
          const response = await axios.get(`/instructor/getExamTextQuestions/?studentId=${currentStudentId}&courseName=${courseName}&examId=${examId}`);
          setLoading(false);
          setQuestions(response.data.questions);
          setAnswers(response.data.answers)
       //   allGraded(response.data.questions);
          setSelectedOption(new Array(response.data.questions.length).fill(null))
          // Assuming response.data contains the fetched data
          console.log(response.data);
          
        }
        else {
            setAllStudentsGraded(true);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    }
 // loop over the questions to see if all of them are graded
    const allGraded = async (questions) => {
        var graded=true
        for (let i = 0; i < questions.length; i++) {
            if(!questions[i].graded)
            {
                graded=false
                break;
            }}
        setAllGraded(graded);}
    fetchQuestions();
    
  }, [currentStudentId , subVersion]);
  
  useEffect(() => {
    // Fetch questions from backend API
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`/instructor/getStudentsForExam/?courseName=${courseName}&examId=${examId}`);
        setStudents(response.data); 
        console.log(response.data);
        if (response.data.length>0){
        setCurrentStudentId(response.data[0]);
       setLoading(true); 
       setAllStudentsGraded(false); 
    }
    else{
        setCurrentStudentId(null);
        setLoading(false);
    }
    setSubVersion(subVersion+1);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    }
  
    fetchStudents();
  }, [version]);
  
  const handleNextStudent = () => {
    // Update current student ID
    console.log(index);
    setLoading(true);
    if(index<students.length-1){
    setCurrentStudentId(students[index+1]);
    setIndex(index+1);}
    setLoading(false);
    setAllGraded(false);
    // Fetch questions for next student
    // (similar to the useEffect hook in step 1)
  };
const handleOptionSelect = (index,option) => {
   // update selectedOption array to reflect the selected grade of given index 
      console.log(index,option);
        const newSelectedOption = [...selectedOption];
        newSelectedOption[index] = option ;
        console.log(newSelectedOption);
        setSelectedOption(newSelectedOption);
        
    
}
const handleSubmitAnswers = async(questionId , index) => {
    // Collect answers from UI (e.g., selected radio buttons)
   if(!selectedOption[index]){
         alert("please select an option")
            return;
        }

console.log(questionId, index , selectedOption[index]);
setLoading(true);
// post to backend using body {questionId selectedOption[index] , studentId , examId , courseName} 
await axios.post('/instructor/submitAnswers', {questionId:questionId, grade: selectedOption[index] , studentId: currentStudentId , examId:examId , courseName:courseName})
.then((response) => {
    console.log(response);
    if (response.status === 200) {
        alert("graded successfully");
        setVersion(version+1);
    }
    else{
        alert("error");
    }
})
.catch((error) => {
    console.log(error);
    alert("error");
});
setLoading(false);

    // Send answers to backend API for grading
    // Update UI with graded results
  };

  // Render questions UI
  // ...
  if (loading) {
    return (
        <div className={styles['container']}>
          <div className={styles['loader']}></div>
        </div>
      );
  }
  if (allStudentsGraded) {
    return (
        <div>
            <InstructorNavbar />
            <h1>All Students Graded</h1>
        </div>
      );
  }
  return (
    <div>
    <InstructorNavbar />
      <h1>Exam Questions</h1>
      {questions.map((question, index) => (
        <div key={index}> 
          <Question question={question} answer={answers[index]} onChoose={(option)=>handleOptionSelect(index,option)} />
          {!question.graded && selectedOption[index] && <button onClick={() => handleSubmitAnswers(question._id, index)}>Submit</button>}
          {question.graded && <p>graded</p>}
        </div>
      ))}
        {/* {allGraded && <button onClick={handleNextStudent}> Next Student</button>} */}
    </div>
  );

};
const Question = ({ question, answer,onChoose }) => {
    const [selectedOption, setSelectedOption] = useState(null); // State variable for selected option
  
    const options = Array.from({ length: parseInt(question.grade) + 1 }, (_, index) => index);
  
    const handleOptionSelect = (option) => {
        console.log(option);
       setSelectedOption(option); // Update the state with the selected option
       onChoose(option)
      
    };
  
    return (
      <div>
        <h3> Question : {question.text}</h3>
        <p>Answer : {answer} </p>
        <p>choose grade</p>
        {(!question.graded)&&<ul>
          {options.map((option, index) => (
            <AnswerOption key={index} option={option} onSelect={handleOptionSelect} selectedOption={selectedOption} /> // Pass the callback function to the AnswerOption component
          ))}
        </ul>}
        
      </div>
    );
  };
  
  
  const AnswerOption = ({ option, onSelect , selectedOption }) => {
    const handleSelect = (event) => {
        console.log(event.target.value);
      onSelect(event.target.value); // Pass the selected option to the callback function
      
    };
  
    return (
      <div>
        <label>{option}</label>
        <input type="radio" name={option} value={option} onChange={handleSelect} checked={option==parseInt(selectedOption)} />
      </div>
    );
  };
  
export default GradingPage;
