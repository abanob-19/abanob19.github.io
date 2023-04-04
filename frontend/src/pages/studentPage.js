import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import StudentNavbar from "../components/StudentNavbar";
 import styles from './Instructor.module.css';
// import LoginForm from "../components/loooogin";


// components
// import LoginForm from "../components/LoginForm"
const StudentPage = () => {
  
  const { state, dispatch } = useInstructorsContext()
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        console.log(state.userx)
    }, [])
  
    return (
      <div>
           { <StudentNavbar/> }
          <h1>My Courses</h1>
          <ul>
              {  user.courses.map((course) => (
                  <li key={course}>
                      {course}
                      
<Button as={Link} to={`/StudentCourseExams/${course}`} variant="success">Exams</Button>
<Button as={Link} to={`/StudentGrades/${course}`} variant="success">Grades</Button>

                  </li>
              ))}
          </ul>
      </div>
  )
  
}

export default StudentPage