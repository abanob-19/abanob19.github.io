import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Button,Badge,ListGroup, ListGroupItem } from "react-bootstrap";
import {faPencilAlt , faTrash} from '@fortawesome/free-solid-svg-icons';
import styles from '../pages/Instructor.module.css';
import { Navigate } from 'react-router-dom';
import { PencilSquare, Trash } from 'react-bootstrap-icons';  

function ExamCard({ exam, onDelete , onEdit ,onFinishEditExam , onSampleClick}) {
  const isFinished = new Date() > new Date(exam.endTime);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(exam.title);
  const [courseName, setCourseName] = useState(exam.courseName);
  const [startTime, setStartTime] = useState(exam.startTime);
  const [endTime, setEndTime] = useState(exam.endTime);
  const [specs, setSpecs] = useState(exam.specs);
  const [isLoading, setIsLoading] = useState(false);

const handleSample = async() => {
  console.log("executed sample");
  onSampleClick();
// Navigate(`/SampleExam/?courseName=${courseName}&examId=${exam._id}`)
// console.log(`/SampleExam/?courseName=${courseName}&examId=${exam._id}`)
  // await axios.get(`/instructor/getQuestionsForExam/${courseName}&${exam._id}`)
  // .then(response => {
  //   console.log("executed sample");
  //   alert("Sample questions generated successfully");
  // })
  // .catch(error => {
  //   console.error(error);
  // }).finally(() => {
  //     setIsLoading(false);
  //     });
}

  const handleDeleteClick = () => {
    onDelete();
  };

  const handleEditClick = () => {
    setEditing(true);
    onEdit();
  };

  const handleSaveClick = async() => {
    setIsLoading(true);
    await axios.put(`/instructor/editExam/`, {
        courseName,
        title,
         startTime,
         endTime,
         specs,
         id:exam._id
    })
    .then(response => {
      console.log("executed edit");
      setEditing(false);
      alert("Exam edited successfully");
      
    })
    .catch(error => {
      console.error(error);
    }).finally(() => {
        setIsLoading(false);
        });
    onFinishEditExam();
  };

  const handleAddSpec = () => {
    setSpecs(prevSpecs => [...prevSpecs, { chapter: '', category: '', numQuestions: 0 }]);
  };
  const handleRemoveSpec = (index) => {
    setSpecs(prevSpecs => {
      const newSpecs = [...prevSpecs];
      newSpecs.splice(index, 1);
      return newSpecs;
    });
  };
  const handleSpecChange = (index, field, value) => {
    setSpecs(prevSpecs => {
      const newSpecs = [...prevSpecs];
      newSpecs[index][field] = value;
      return newSpecs;
    });
  };
  if(isLoading){
    return  <div className={styles['container']}>
    <div className={styles['loader']}></div>
  </div>
    }
  if (editing) {
    return (
      <div style={{ paddingTop: '72px' }}>
      <label> Title: <input type="text" value={title} onChange={e => setTitle(e.target.value)} /></label>
      <label> Course Name : <input type="text" value={courseName} onChange={e => setCourseName(e.target.value)} /></label>
      <label> Start Time:  <input
          type="datetime-local"
          value={new Date(startTime).toISOString().slice(0, -1)}
          onChange={(event) => setStartTime(event.target.value)}
        /></label>
<label> End Time:  <input
          type="datetime-local"
          value={new Date(endTime).toISOString().slice(0, -1)}
          onChange={(event) => setEndTime(event.target.value)}
        /></label>
        {specs.map((spec, index) => (
          <div key={index}>
          <label>  Chapter : <input type="text" value={spec.chapter} onChange={e => handleSpecChange(index, 'chapter', e.target.value)} /></label>
          <label> Category: <input type="text" value={spec.category} onChange={e => handleSpecChange(index, 'category', e.target.value)} /></label>
          <label> Number of Questions:<input type="number" value={spec.numQuestions} onChange={e => handleSpecChange(index, 'numQuestions', parseInt(e.target.value))} /></label>
          {specs.length > 1 && (
      <button onClick={() => handleRemoveSpec(index)}>Remove Spec</button>
    )}
          </div>
        ))}

        <button onClick={handleAddSpec}>Add Spec</button>

        <button onClick={handleSaveClick}>Save</button>
        <button onClick={() => {setEditing(false); onFinishEditExam()}}>Cancel</button>
      </div>
    );
  }
  
  return (
    <div style={{ paddingTop: '72px' }}>
      <Card style={{ marginBottom: "1rem" }  } className={styles.courseCard}>
        <Card.Header className={styles.cardTitle}>
          <h3>{exam.title}</h3>&nbsp;
          <FontAwesomeIcon onClick= {handleEditClick } icon={faPencilAlt} className={styles['nav-link-hover']} /> &nbsp;
          <FontAwesomeIcon onClick={handleDeleteClick} icon={faTrash} className={styles['nav-link-hover']} />

        </Card.Header>
        <Card.Body>
          {exam.courseName && (
            <Card.Subtitle className='mb-2 text-muted'>
              Course: {exam.courseName.charAt(0).toUpperCase() + exam.courseName.slice(1)}
            </Card.Subtitle>
          )}
          <Card.Text>Start Time: {new Date(exam.startTime).toLocaleString()}</Card.Text>
          <Card.Text>End Time: {new Date(exam.endTime).toLocaleString()}</Card.Text>
          <p>
            Status:{' '}
            <Badge variant={isFinished ? 'success' : 'danger'}>{isFinished ? 'Finished' : 'Not Finished'}</Badge>
          </p>
          <ListGroup>
            {exam.specs.map((spec, index) => (
              <ListGroupItem key={index}>
                <div>
                  <strong>Chapter:</strong> {spec.chapter}
                </div>
                <div>
                  <strong>Category:</strong> {spec.category}
                </div>
                <div>
                  <strong>Number of Questions:</strong> {spec.numQuestions}
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
          <div className={`${styles.cardButtons} d-flex justify-content-center`} style={{ marginTop: '20px' }}>
  <Button variant="info" onClick={handleSample} className="mr-3 rounded-pill px-5 py-3 font-weight-bold">View Sample</Button>
</div>


          
        </Card.Body>
      </Card>
    </div>
  );
}

export default ExamCard;