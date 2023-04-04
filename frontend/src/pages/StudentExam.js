import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCheck } from '@fortawesome/free-solid-svg-icons';
 import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import styles from '../pages/Instructor.module.css';

const StudentExam = () => {
  const [questions, setQuestions] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseName = searchParams.get('courseName'); 
  const examId = searchParams.get('examId');
  const [version, setVersion] = useState(0);    
  const { state, dispatch } = useInstructorsContext()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));


  useEffect(() => {
    console.log("Component mounted");
    async function fetchData() {
      const response = await fetch(`/student/getQuestionsForExam?courseName=${courseName}&examId=${examId}&Id=${user._id}`);
      const data = await response.json();
      setQuestions(data);
    }
    fetchData();
  }, [version,state.secVersion]);
  if(!questions){
    return  <div className={styles['container']}>
    <div className={styles['loader']}></div>
  </div>
    }

  return (
    <div>
      <h1>Questions</h1>
      {questions.map(question => (
        <div key={question._id}>
          <h2>{question.text}</h2>
          <p>Grade: {question.grade}</p>
          <ul>
            {question.choices.map((choice, index) => (
              <li key={index}>
                {choice}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default StudentExam;
