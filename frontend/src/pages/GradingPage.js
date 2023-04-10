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
//   const handlePreviousStudent = () => {
//     // Update current student ID
//     setLoading(true);
//     if(index!=0){
//     setIndex(index-1);
//     setCurrentStudentId(students[index]);
//     }
//     setLoading(false);
    // Fetch questions for next student
    // (similar to the useEffect hook in step 1)
  // };
  const handleSubmitAnswers = () => {
    // Collect answers from UI (e.g., selected radio buttons)
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
        <Question key={index} question={question} answer={answers[index]} />
      ))}
      
     
    </div>
 );

};
const Question = ({ question,answer }) => {
    const options = Array.from({ length: parseInt(question.grade) + 1 }, (_, index) => index);
    return (
      <div>
       
        
        <h3> Question : {question.text}</h3>
        <p>Answer : {answer} </p>
        <p>choose grade</p>
        <ul>
          {options.map((option, index) => (
            <AnswerOption key={index} option={option} />  
          ))}
        </ul>
        {/* <button onClick={handleSubmitAnswer}>Submit</button> */}
      </div>
    );
  };
  
  const AnswerOption = ({ option }) => {
    return (
      <div>
        <label>{option}</label>
        <input type="radio" name={option} value={option} />
        </div>
    );
  };
export default GradingPage;
