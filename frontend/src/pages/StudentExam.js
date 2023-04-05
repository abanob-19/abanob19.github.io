import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import styles from '../pages/Instructor.module.css';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const StudentExam = () => {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [buttonText, setButtonText] = useState('Submit');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseName = searchParams.get('courseName'); 
  const examId = searchParams.get('examId');
  const duration = searchParams.get('duration'); 
    const title = searchParams.get('title');
    const endTime = searchParams.get('endTime');
  const [version, setVersion] = useState(0);    
  const { state, dispatch } = useInstructorsContext()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [submitted, setSubmitted] = useState(false);
  const[isSubmitting,setIsSubmitting]=useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/student/getQuestionsForExam?courseName=${courseName}&examId=${examId}&Id=${user._id}`);
      const data = await response.json()
      const q=data.Questions;
      setQuestions(q);
      
    setSubmitted(data.submitted);
    
      var i=0;
      for (i=0;i<data.answers.length;i++){
        answers[data.Questions[i]._id]=data.answers[i];
        }
      setAnswers(answers);
      console.log(answers);
     
    }
    fetchData();
    
  }, [version,state.secVersion]);

  const handleAnswerChange = (questionId, choiceIndex) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: choiceIndex
    }));
  };

  const handleSubmit = async() => {
    // You can save the answers to the server here
    setButtonText('Submitting...');
    setIsSubmitting(true);
    const response= await fetch(`/student/submitExam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseName,
          examId,
          Id: user._id,
          answers: answers,
          sumbitted:true
        })
      })
      .then(response => {
        console.log(response);
        setSubmitted(true);
        setIsSubmitting(false);
        setButtonText('Submitted');
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
    console.log(answers);
  };

  if (!questions) {
    return (
      <div className={styles['container']}>
        <div className={styles['loader']}></div>
      </div>
    );
  }
  if (submitted)      { 
  return (
    <div>
    <h1>{courseName}</h1>
        <h2>{title}</h2>
  <Button as={Link} to={`/StudentPage/`} variant="success">submitted ,return to home page</Button>
  
 
  </div>
  )
}

  return (
    <div>
        <h1>{courseName}</h1>
        <h2>{title}</h2>
        <h3>Duration: {duration} hours</h3>
        <h3>remaining time: {(new Date(endTime)-new Date())/3600000}</h3>

      {questions.map((question, index) => (
        <div key={question._id}>
          <h2> ({index + 1}) {question.text}  ({question.grade} grades)</h2>
          <ul className={styles['choices-list']}>
          {question.choices.map((choice, choiceIndex) => (
            <li key={choiceIndex}>
              <label>
              <input type="radio" name={`question${index}`} value={choice} checked={answers[question._id] === choiceIndex}
                    onChange={() => handleAnswerChange(question._id, choiceIndex)}/>
                <span className={styles['choice-number']}>  ({String.fromCharCode(97 + choiceIndex)})</span> 
                <span className={styles['choice-text']}>{choice}</span>
              </label>
            </li>
          ))}
          </ul>
        </div>
      ))}
      {!submitted&&!isSubmitting&&<button className ={styles['button']}onClick={handleSubmit}>{buttonText}</button>}
      {isSubmitting&&<p className ={styles['button']}>Submitting...</p>}
 

    </div>
  );
  
};

export default StudentExam;
