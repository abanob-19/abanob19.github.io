import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentExamCard from '../components/StudentExamCard';
import { useParams } from "react-router-dom";
 import StudentNavbar from '../components/StudentNavbar';
 import { useInstructorsContext } from '../hooks/useInstrcutorContext'
 import styles from './Instructor.module.css';
 import { useNavigate } from "react-router-dom";
 import { useInRouterContext, Navigate } from 'react-router-dom'

function StudentCourseExams() {
 // const { navigate } = useInRouterContext();
  const navigate = useNavigate();
  const [exams, setExams] = useState(null);
  const { courseName } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { state,dispatch } = useInstructorsContext()
 
  function handleStart  (examId)  {
    console.log("executed Start");
    // onSampleClick();
  navigate(`/StudentExam/?courseName=${courseName}&examId=${examId}`)
   console.log(`/SampleExam/?courseName=${courseName}&examId=${examId}`)

  }


  useEffect( () => {
    setIsLoading(true);
    axios.get(`/student/seeExams/${courseName}`)
      .then(response => {
        setExams(response.data);
        console.log("executed get")
       // console.log(state.secVersion)

      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [state.secVersion]);
if(!exams|| isLoading){
  return  <div className={styles['container']}>
  <div className={styles['loader']}></div>
</div>
}

  return (
    <div>
      <StudentNavbar/>
      {exams.map(exam => (
        
         <StudentExamCard key={exam._id} exam={exam}    onSampleClick={()=>handleStart(exam._id)}/>
        
      ))}
    </div>
  );
}


export default StudentCourseExams;
