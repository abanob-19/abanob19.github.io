import { useEffect, useState } from "react"
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import InstructorNavbar from "../components/instructorNavbar";



const InstructorCourses = () => {
    const { state, dispatch } = useInstructorsContext()
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        console.log(state.userx)
    }, [])

    return (
        <div>
             { <InstructorNavbar/> }
            <h1>My Courses</h1>
            <ul>
                {  user.courses.map((course) => (
                    <li key={course}>
                        {course}
                        <Button as={Link} to={`/Course/${course}`} variant="primary">Question Banks</Button>
<Button as={Link} to={`/CourseExams/${course}`} variant="success">Exams</Button>

                    </li>
                ))}
            </ul>
        </div>
    )
}

export default InstructorCourses
