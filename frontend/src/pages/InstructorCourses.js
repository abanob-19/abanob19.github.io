import { useEffect, useState } from "react"
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import { Link } from 'react-router-dom';
import InstructorNavbar from "../components/instructorNavbar";
import styles from './Instructor.module.css';
import { Card, Button, Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
const InstructorCourses = () => {
    const { state, dispatch } = useInstructorsContext()
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
const navigate = useNavigate();
    useEffect(() => {
      if (!user)
      { 
        navigate('/'); return  ; 
      }
      else if (user.role != "instructor")
       { navigate('/StudentPage'); return  ;}        console.log(state.userx)
    }, [])

    return (
        <div>
             { <InstructorNavbar/> }
             <h1 style={{ paddingTop: '72px' }} className={styles.courses} >My Courses</h1>
            <Container fluid className="d-flex flex-wrap justify-content-center" >
        {user.courses.map((course) => (
          <Card key={course} className={styles.courseCard} >
            <Card.Body>
              <Card.Title className={styles.cardTitle} >{course.charAt(0).toUpperCase() + course.slice(1)}</Card.Title>
              <div className={styles.cardButtons}>
                <Button as={Link} to={`/Course/${course}`} variant="primary" className="mr-3 rounded-pill px-5 py-3 font-weight-bold">Banks</Button>
                <Button as={Link} to={`/CourseExams/${course}`}variant="secondary" className="rounded-pill px-5 py-3 font-weight-bold">Exams</Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </Container>
           
        </div>
    )
}

export default InstructorCourses
