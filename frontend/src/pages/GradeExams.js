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
  const [selectedCourse, setSelectedCourse] = useState("all");
 
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };
  useEffect(() => {
    if (!user)
    { 
      navigate('/'); return  ; 
    }
    else if (user.role != "instructor")
     { navigate('/StudentPage'); return  ;}
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
    <div className="container mt-5">
      <InstructorNavbar />
      <h1 className="text-center mb-4" style={{paddingTop:'32px'}}>{selectedCourse.charAt(0).toUpperCase()+selectedCourse.slice(1)} Exams</h1>
      <div className="d-flex justify-content-center mb-4">
        <label htmlFor="courseSelect" className="me-2">
          Select Course:
        </label>
        <select
          id="courseSelect"
          value={selectedCourse}
          onChange={handleCourseChange}
        >
          <option value="all">All</option>
          {user.courses.map((course) => (
            <option key={course._id} value={course}>
              {course.charAt(0).toUpperCase()+course.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <table className="table table-bordered table-hover mx-auto">
        <thead>
          <tr>
            <th scope="col">Exam</th>
            <th scope="col">Course</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams
            .filter((exam) =>
              selectedCourse === "all"
                ? true
                : exam.courseName === selectedCourse
            )
            .map((exam) => (
              <tr key={exam._id}>
                <td>
                  
                    {exam.title}
                  
                </td>
                <td>{exam.courseName.charAt(0).toUpperCase()+exam.courseName.slice(1)}</td>
                <td>
                  <Link
                    to={`/ExamStudents/?courseName=${exam.courseName}&examId=${exam._id}`}
                    className="btn btn-primary me-2"
                  >
                    Screen Shots
                  </Link>
                  <Link
                    to={`/GradingPage/?courseName=${exam.courseName}&examId=${exam._id}&title=${exam.title}`}
                    className="btn btn-secondary"
                  >
                    Grade Exam
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default GradeExams;
