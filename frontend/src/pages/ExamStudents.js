import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
const ExamStudents = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [students, setStudents] = useState([]);
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

  return (
    <div>
      {students.map(student => (
        <div key={student._id}>
          <Button as={Link} to={`/ScreenShots/?courseName=${courseName}&examId=${examId}&studentId=${student._id}`} variant="primary" style={{ marginBottom: '10px' }}>
            {student._id}
          </Button>
        </div>
      ))}
    </div>
  );
  
  
};
export default ExamStudents;