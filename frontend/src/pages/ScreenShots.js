import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import InstructorNavbar from '../components/instructorNavbar';
const Screenshots = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [screenshots, setScreenshots] = useState([]);
  const courseName = searchParams.get('courseName'); 
  const examId = searchParams.get('examId');
  const studentId = searchParams.get('studentId');
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  useEffect(() => {
    if (!user)
    { 
      navigate('/'); return  ; 
    }
    else if (user.role != "instructor")
     { navigate('/StudentPage'); return  ;}
     document.title = "Online Assessment Simulator";
    const fetchScreenshots = async () => {
      try {
        console.log(studentId);
        const response = await axios.get(`/instructor/getScreenshots/?courseName=${courseName}&examId=${examId}&studentId=${studentId}`);
          console.log(response.data.screenshots[0]);
        setScreenshots(response.data.screenshots);
      } catch (error) {
        console.error('Failed to retrieve screenshots', error);
      }
    };

    fetchScreenshots();
  }, [courseName, studentId, examId]);

  return (
    <div className="container mt-5">
      <InstructorNavbar />
    <Row className="mt-5" style={{paddingTop:'72px'}}>
      {screenshots.map((screenshot, index) => (
        <Col key={index} xs={12} md={6} lg={4} className="mb-4">
          <img src={screenshot} alt={`Screenshot ${index + 1}`} className="img-fluid" />
        </Col>
      ))}
    </Row>
    </div>
  );
};
export default Screenshots;