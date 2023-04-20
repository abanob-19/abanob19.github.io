import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
const Screenshots = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [screenshots, setScreenshots] = useState([]);
  const courseName = searchParams.get('courseName'); 
  const examId = searchParams.get('examId');
  const studentId = searchParams.get('studentId');
  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        console.log(studentId);
        const response = await axios.get(`/instructor/getScreenshots/?courseName=${courseName}&examId=${examId}&studentId=${studentId}`);
          
        setScreenshots(response.data.screenshots);
      } catch (error) {
        console.error('Failed to retrieve screenshots', error);
      }
    };

    fetchScreenshots();
  }, [courseName, studentId, examId]);

  return (
    <>
      {screenshots.map((screenshot) => (
        <img src={screenshot} alt="Screenshot" />
      ))}
    </>
  );
};
export default Screenshots;