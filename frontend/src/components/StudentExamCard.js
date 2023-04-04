import React, { useState } from 'react';
import axios from 'axios';
import styles from '../pages/Instructor.module.css';
import { Navigate } from 'react-router-dom';

function StudentExamCard({ exam, onSampleClick}) {
  const isFinished = new Date() > new Date(exam.endTime);
  const diffInMs =  new Date(exam.endTime)-new Date() ;
  const remainingToStart =  (new Date(exam.startTime)-new Date() )/3600000;

  const duration=(new Date(exam.endTime)-new Date(exam.startTime))/3600000
const diffInHours = diffInMs / 3600000; // divide by the number of milliseconds in an hour
const canStart=(diffInHours>(duration/2 )) &&(remainingToStart <0);
  const [isLoading, setIsLoading] = useState(false);

const handleSample = async() => {
  console.log("executed sample");
  onSampleClick();
}

  if(isLoading){
    return  <div className={styles['container']}>
    <div className={styles['loader']}></div>
  </div>
    }

  return (
    <div>
      <h3>{exam.title}</h3>
        {(remainingToStart >0) && <p>Remaining to start: {remainingToStart} hours</p>}
       { (remainingToStart <0) &&!isFinished && < p>open</p> }
      <p>Course : {exam.courseName}</p>
      <p>Start Time: {new Date(exam.startTime).toLocaleString()}</p>
      <p>End Time: {new Date(exam.endTime).toLocaleString()}</p>
      <p>Status: {isFinished ? "Finished" : "Not Finished"}</p>
     { canStart && <button onClick={handleSample}>Start Exam</button> }
 
    </div>
  );
}

export default StudentExamCard;
