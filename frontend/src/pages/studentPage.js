import { useInstructorsContext } from '../hooks/useInstrcutorContext';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Card, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentNavbar from "../components/StudentNavbar";
import styles from './Instructor.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaClipboardList, FaChartLine } from 'react-icons/fa';
import { FaPlusCircle } from 'react-icons/fa';
import { Flipper, Flipped } from 'react-flip-toolkit';
import{faTrophy} from '@fortawesome/free-solid-svg-icons';
const StudentPage = () => {
  
  const { state, dispatch } = useInstructorsContext()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    console.log(state.userx)
  }, [])
  
  return (
    <div>
      <StudentNavbar />
      <h1 style={{ paddingTop: '72px' }} className={styles.courses} >My Courses</h1>
      <Container fluid className="d-flex flex-wrap justify-content-center" >
        {user.courses.map((course) => (
          <Card key={course} className={styles.courseCard} >
            <Card.Body>
              <Card.Title className={styles.cardTitle} >{course.charAt(0).toUpperCase() + course.slice(1)}</Card.Title>
           
<div className={styles.cardButtons}>
  <Button as={Link} to={`/StudentCourseExams/${course}`} variant="primary" className="mr-3 rounded-pill px-5 py-3 font-weight-bold">
    <FaClipboardList className="mr-2" /> Exams
  </Button>
  <Button as={Link} to={`/StudentGrades/${course}`} variant="secondary" className="rounded-pill px-5 py-3 font-weight-bold">
  <FaChartLine className="mr-2" /> Grades
  </Button>
</div>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </div>
  )
  
}

export default StudentPage
