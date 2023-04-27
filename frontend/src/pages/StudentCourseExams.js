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
 
  function handleStart  (examId,title,duration, endTime)  {
    console.log("executed Start");
    // onSampleClick();
  navigate(`/StudentExam/?courseName=${courseName}&examId=${examId}&duration=${duration}&title=${title}+&endTime=${endTime}`)
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
  
  return <div> <StudentNavbar/>  <div className={styles['container']} style={{ paddingTop: '72px' }}>
  <div className={styles['loader']}></div>
</div>
</div>
}

  return (
    <div style={{ paddingTop: '72px' }}>
      <StudentNavbar/>
      {exams.map(exam => (
        
         <StudentExamCard key={exam._id} exam={exam}    onSampleClick={()=>handleStart(exam._id,exam.title,  (new Date(exam.endTime)-new Date(exam.startTime))/3600000
        , exam.endTime)}/>
        
      ))}
    </div>
  );
}


export default StudentCourseExams;
