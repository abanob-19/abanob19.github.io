import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import styles from '../pages/Instructor.module.css';
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
const [verion, setVersion] = useState(0);
const [loading, setLoading] = useState(true);
const [selectedOption, setSelectedOption] = useState([]);
  useEffect(() => {
    // Fetch questions from backend API
    const fetchQuestions = async () => {
      try {
        if (currentStudentId) {
            setLoading(true);
          const response = await axios.get(`/instructor/getExamTextQuestions/?studentId=${currentStudentId}&courseName=${courseName}&examId=${examId}`);
          setLoading(false);
          setQuestions(response.data.questions);
          setAnswers(response.data.answers)
          setSelectedOption(new Array(response.data.questions.length).fill(null))
          // Assuming response.data contains the fetched data
          console.log(response.data);
          
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    }
  
    fetchQuestions();
  }, [currentStudentId]);
  
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
    }
    else{
        setLoading(false);
    }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    }
  
    fetchStudents();
  }, [verion]);
  
//   const handleNextStudent = () => {
//     // Update current student ID
//     setLoading(true);
//     if(index<students.length-1){
//     setIndex(index+1);
//     setCurrentStudentId(students[index]);}
// setLoading(false);
//     // Fetch questions for next student
//     // (similar to the useEffect hook in step 1)
//   };
const handleOptionSelect = (index) => {
   // update selectedOption array to reflect the selected grade of given index 
    return (event) => {
        const newSelectedOption = [...selectedOption];
        newSelectedOption[index] = event.target.value;
        setSelectedOption(newSelectedOption);
        };
    
}
const handleSubmitAnswers = (questionId , index) => {
    // Collect answers from UI (e.g., selected radio buttons)
   
console.log(questionId, index , selectedOption[index]);
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
  return (
    <div>
      <h1>Exam Questions</h1>
      {questions.map((question, index) => (
        <div> 
        <Question key={index} question={question} answer={answers[index]} onSelect={handleOptionSelect(index)} />
        {!question.graded && selectedOption[index]&&<button onClick={handleSubmitAnswers(question._id , index )} > Submit </button> }
        {question.graded && <p>graded</p>}
        </div>
      ))}
      
     
    </div>
 );

};
const Question = ({ question, answer,onSelect }) => {
    const [selectedOption, setSelectedOption] = useState(null); // State variable for selected option
  
    const options = Array.from({ length: parseInt(question.grade) + 1 }, (_, index) => index);
  
    const handleOptionSelect = (option) => {
      setSelectedOption(option); // Update the state with the selected option
      onSelect(option)
    };
  
    return (
      <div>
        <h3> Question : {question.text}</h3>
        <p>Answer : {answer} </p>
        <p>choose grade</p>
        <ul>
          {options.map((option, index) => (
            <AnswerOption key={index} option={option} onSelect={handleOptionSelect} /> // Pass the callback function to the AnswerOption component
          ))}
        </ul>
        
      </div>
    );
  };
  
  
  const AnswerOption = ({ option, onSelect }) => {
    const handleSelect = (event) => {
      onSelect(event.target.value); // Pass the selected option to the callback function
    };
  
    return (
      <div>
        <label>{option}</label>
        <input type="radio" name={option} value={option} onChange={handleSelect} />
      </div>
    );
  };
  
export default GradingPage;
