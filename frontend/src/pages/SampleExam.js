import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import styles from '../pages/Instructor.module.css';
import InstructorNavbar from '../components/instructorNavbar';
import axios from 'axios';
const SampleExam = () => {
  const [questions, setQuestions] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseName = searchParams.get('courseName'); 
  const examId = searchParams.get('examId');
  const [version, setVersion] = useState(0);    
  const { state, dispatch } = useInstructorsContext()

  useEffect(() => {
    console.log("Component mounted");
    async function fetchData() {
      const response = await fetch(`/instructor/getQuestionsForExam?courseName=${courseName}&examId=${examId}`);
      const data = await response.json();
      setQuestions(data);
    }
    fetchData();
  }, [version,state.secVersion]);
  const handleDownload = async (attachment) => {
    try {
      const response = await axios.get(`/instructor/downloadFile/?attachment=${attachment}`, {
        responseType: 'blob', // set the response type to blob to handle binary data
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
      // create a temporary link and click it to download the file
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', attachment);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };
  if(!questions){
    return  <div className={styles['container']}>
    <div className={styles['loader']}></div>
  </div>
    }

  return (
    <div>
        <InstructorNavbar/>
      <h1>Questions</h1>
      {questions.map(question => (
        <div key={question._id}>
          <h2>{question.text}</h2>
          {question.attachment &&  <button onClick={() => handleDownload(question.attachment)}>Download Attachments</button>}
          <p>Category: {question.category}</p>
          <p>Grade: {question.grade}</p>
         {question.type=='mcq'&& <ul>
            {question.choices.map((choice, index) => (
              <li key={index}>
                {choice}
                {choice === question.answer && <FontAwesomeIcon icon={faCheck} />}
              </li>
            ))}
          </ul>}
        </div>
      ))}
    </div>
  );
}

export default SampleExam;
