import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from "react-router-dom";
import InstructorNavbar from '../components/instructorNavbar';
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import styles from './Instructor.module.css';
import { useNavigate } from "react-router-dom";
import { useInRouterContext } from 'react-router-dom'
import { Button } from 'react-bootstrap';
function GradeExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState(null);
  const[version,setVersion]=useState(0)
  const { state,dispatch } = useInstructorsContext()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/instructor/seeExamsForGrade/${user._id}`);
        setExams(response.data);
        console.log("executed get")
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  if (!exams) {
    return (
      <div className={styles['container']}>
        <div className={styles['loader']}></div>
      </div>
    );
  }

  return (
    <div>
      <InstructorNavbar/>
      <h1>Courses Exams</h1>
      {exams.map(exam => (
        <div key={exam._id}>
            
            EXAM:
          <Link to={`/GradingPage/?courseName=${exam.courseName}&examId=${exam._id}`}>
            {exam.title}
          </Link> 
          <Button as={Link} to={`/ExamStudents/?courseName=${exam.courseName}&examId=${exam._id}`} variant="primary">Screen Shots</Button>
          <div>
          Course:{exam.courseName} 
        </div>
        </div>
      ))}
    </div>
  );
}

export default GradeExams;
