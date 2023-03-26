import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom';
const Course = () => {
    const { courseName } = useParams()
    const [courseData, setCourseData] = useState(null)

    useEffect(() => {
        console.log("courseName:", courseName);
        const fetchData = async () => {
            const response = await fetch(`/instructor/seeCourse/${courseName}`);

            const json = await response.json()
            setCourseData(json)
        }
        fetchData()
    }, [courseName])
    

    if (!courseData) {
        return <div>Loading...</div>
    }
  


    return (
        <div>
            <h1>{courseName}</h1>
            <ul>
                {courseData.map((questionBank) => (
                    <li key={questionBank._id}>
                         <Link to={`/QuestionBank/?questionBankName=${questionBank.title}&name=${questionBank.course}`}> {questionBank.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Course
