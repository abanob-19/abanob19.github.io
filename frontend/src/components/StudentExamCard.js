import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../pages/Instructor.module.css';
import { Navigate } from 'react-router-dom';
import { Card, Button, Badge, Alert } from 'react-bootstrap';

function StudentExamCard({ exam, onSampleClick }) {
 
  const diffInMs = new Date(exam.endTime) - new Date();
  const now = new Date (Date.now()) 
const startTime = (new Date(exam.startTime)).setHours((new Date(exam.startTime)).getHours() - 3) ;
const remainingToStart = startTime > now ? (startTime - now) / 1000 : 0;
const endTime =  (new Date(exam.endTime)).setHours((new Date(exam.endTime)).getHours() - 3) ;
const remainingToEnd = endTime > now ? (endTime - now) / 1000 : 0;
const isFinished = (remainingToEnd == 0);

  const duration = (new Date(exam.endTime) - new Date(exam.startTime)) / 3600000;
  const diffInHours = diffInMs / 3600000; // divide by the number of milliseconds in an hour
  // const canStart = diffInHours > duration / 2 && remainingToStart == 0;
  const canStart =!isFinished&& remainingToStart == 0
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const handleSample = async () => {
    console.log('executed sample');
    onSampleClick();
  };
  useEffect(() => {
    //console.log('remaining to start', remainingToStart);
    //console.log('remaining to end', remainingToEnd , exam.endTime , exam.title);
   
    const intervalId = setInterval(() => {
      const timeLeft = remainingToStart;
      const timeLeft2 = remainingToEnd;
      if (timeLeft <= 0) {
        clearInterval(intervalId);
        setRemainingTime(null);
      } else {
        const days = Math.floor(timeLeft / 86400);
        const hours = Math.floor((timeLeft % 86400) / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = Math.floor(timeLeft % 60);
        setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingToStart]);

 

 
  if (isLoading) {
    return (
      <div className={styles['container']}>
        <div className={styles['loader']}></div>
      </div>
    );
  }

  return (
    <Card className={styles.courseCard} style={{ margin: '10px', padding: '10px' ,textAlign: 'center' }} >
      <Card.Body>
        <Card.Title className={styles.cardTitle}>{exam.title}</Card.Title>
        {exam.courseName && (
          <Card.Subtitle className='mb-2 text-muted'>
            Course: {exam.courseName.charAt(0).toUpperCase() + exam.courseName.slice(1)}
          </Card.Subtitle>
        )}
        <Card.Text>
        {!canStart && <Alert variant='warning'>Not Open</Alert>}
          {remainingToStart > 0 && <p>Remaining Time: {remainingTime} </p>}
          {remainingToStart == 0 && !isFinished && <Alert variant='warning'>Open</Alert>}
          <p>Start Time: {new Date(exam.startTime).toISOString().split('T')[0]} {new Date(exam.startTime).toLocaleTimeString([], { timeZone: 'UTC' })}</p>
          <p>End Time: {new Date(exam.endTime).toISOString().split('T')[0]}  {new Date(exam.endTime).toLocaleTimeString([], { timeZone: 'UTC' })}</p>

          <p>
            Status:{' '}
            <Badge variant={isFinished ? 'success' : 'danger'}>{isFinished ? 'Finished' : 'Not Finished'}</Badge>
          </p>
        </Card.Text>
        {canStart && <Button onClick={handleSample} className="mr-3 rounded-pill  " >Start Exam</Button> }
        
      </Card.Body>
    </Card>
  );
}

export default StudentExamCard;
