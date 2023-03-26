import { useEffect } from "react"
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import { Link } from 'react-router-dom';

const InstructorCourses = () => {
    const { state, dispatch } = useInstructorsContext()
    useEffect(() => {
        console.log(state.userx)
    }, [])

    return (
        <div>
            <h1>My Courses</h1>
            <ul>
                {state.userx.courses.map((course) => (
                    <li key={course}>
                        <Link to={`/Course/${course}`}>{course}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default InstructorCourses
