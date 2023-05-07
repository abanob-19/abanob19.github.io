import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import styles from '../pages/Instructor.module.css';
import InstructorNavbar from '../components/instructorNavbar';
const ExamStudents = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [students, setStudents] = useState(null);
  const courseName = searchParams.get('courseName'); 
  const examId = searchParams.get('examId');
  
  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const response = await axios.get(`/instructor/getStudentsForExam2/?courseName=${courseName}&examId=${examId}`);
        setStudents(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Failed to retrieve students', error);
      }
    };

    fetchScreenshots();
  }, []);
if(!students) {
  return  <div className={styles['container']}>
  <div className={styles['loader']}></div>
</div>
};
  return (
    <div className="container mt-5">
      <InstructorNavbar />
      <h1 className="text-center mb-4" style={{ paddingTop: '32px' }}>Students List</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Student ID</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>
                <Link
                  to={`/ScreenShots/?courseName=${courseName}&examId=${examId}&studentId=${student._id}`}
                  className="btn btn-primary"
                >
                  {student._id}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  
};
export default ExamStudents;