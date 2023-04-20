import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentExamCard from '../components/StudentExamCard';
import { useParams } from "react-router-dom";
 import StudentNavbar from '../components/StudentNavbar';
 import { useInstructorsContext } from '../hooks/useInstrcutorContext'
 import styles from './Instructor.module.css';
 import { useNavigate } from "react-router-dom";
 import { useInRouterContext, Navigate } from 'react-router-dom'

function StudentGrades() {
 // const { navigate } = useInRouterContext();
  const navigate = useNavigate();
  const [exams, setExams] = useState(null);
  const { courseName } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { state,dispatch } = useInstructorsContext()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
 
  


  useEffect( () => {
    setIsLoading(true);
    axios.get(`/student/seeExamsForGrades/?courseName=${courseName}&studentId=${user._id}`)
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
  }, []);
if(!exams|| isLoading){
  return  <div className={styles['container']}>
  <div className={styles['loader']}></div>
</div>
}

  return (
    <div>
      <StudentNavbar/>
      {exams.map(exam => (
       <div key={exam._id}> 
        <h1>{exam.title}</h1>
        <h2>Grade: {exam.totalGrade} / {exam.totalPossibleGrade}</h2>
        </div>
      ))}
    </div>
  );
}


export default StudentGrades;
