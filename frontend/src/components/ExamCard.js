import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Button,Badge,ListGroup, ListGroupItem } from "react-bootstrap";
import {faPencilAlt , faTrash} from '@fortawesome/free-solid-svg-icons';
import styles from '../pages/Instructor.module.css'; 
import { FaPlus,FaMinusCircle } from 'react-icons/fa';
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
      <Modal
      isOpen={true}
      onRequestClose={() => {setEditing(false); onFinishEditExam()}}
      className={styles['modal']}
      overlayClassName={styles['overlay']}
    >
      <h2 className={styles['form-title']}>Edit Exam</h2>
      <div style={{ paddingTop: '72px' }}>
      <form onSubmit={handleSaveClick} className={styles['form']} >
        <div className={styles['form-group']}>
          <label className={styles['form-label']}>
            Course Name:
            <input
              type="text"
              className={styles['form-control']}
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
            />
          </label>
        </div>
        <div className={styles['form-group']}>
          <label className={styles['form-label']}>
            Exam Title:
            <input
              type="text"
              className={styles['form-control']}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
        </div>
        <div className={styles['form-group']}>
          <label className={styles['form-label']}>
            Start Time:
            <input
  type="datetime-local"
  className={styles['form-control']}
  value={new Date(startTime).toISOString().slice(0, -1)}
  onChange={(event) => {
    const inputDate = new Date(event.target.value);
    const inputValue = event.target.value.trim();
    if (inputValue === '' || inputValue === '0') return;
    const timestamp = inputDate.getTime() - (inputDate.getTimezoneOffset() * 60000);
    setStartTime((inputDate + "z"))
  }}
/>




              </label>
              </div>
              <div className={styles['form-group']}>
              <label className={styles['form-label']}>
              End Time:
              <input
  type="datetime-local"
  className={styles['form-control']}
  value={new Date(endTime).toISOString().slice(0, -1)}
  onChange={(event) => {
    const inputDate = new Date(event.target.value);
    const inputValue = event.target.value.trim();
    if (inputValue === '' || inputValue === '0') return;
    const timestamp = inputDate.getTime() - (inputDate.getTimezoneOffset() * 60000);
    setEndTime((inputDate + "z"))
  }}
/>

              </label>
              </div>
              <div className={styles['form-group']}>
                
              <label className={styles['form-label']}>Exam Specifications:</label>
              <button
              type="button"
              className={styles['btn-icon']}
              onClick={handleAddSpec}
              >
              <FaPlus />
              </button>
              <ul>
  {specs.map((spec, index) => (
    <li key={index} className={styles['form-subgroup']}>
      <div className={styles['form-subgroup-fields']}>
        <div className={styles['form-subgroup-controls']}>
          {specs.length > 1 && (
            <div
              
              className={styles['btn-icon']}
              onClick={() => handleRemoveSpec(index)}
            >
              <FaMinusCircle />
            </div>
          )}
        </div>
        <label className={styles['form-label']}>
          Chapter:
          <input
            type="text"
            className={styles['form-control']}
            value={spec.chapter}
            onChange={(event) => handleSpecChange(index, 'chapter', event.target.value)}
          />
        </label>
        <label className={styles['form-label']}>
  Category:
  <select
    className={styles['form-control']}
    value={spec.category}
    onChange={(event) => handleSpecChange( index, 'category', event.target.value)}
  >
    <option value="Easy">Easy</option>
    <option value="Medium">Medium</option>
    <option value="Hard">Hard</option>
  </select>
</label>

        <label className={styles['form-label']}>
          Number of Questions:
          <input
            type="number"
            className={styles['form-control']}
            value={spec.numQuestions}
            onChange={(event) => handleSpecChange(index, 'numQuestions', parseInt(event.target.value))}
          />
        </label>
      </div>
    </li>
  ))}
</ul>

              </div>
              <div className={styles['form-group']}>
              <button type="submit" className={styles['btn-primary']}>
              Save Changes
              </button>
              <button type="button" className={styles['btn-secondary']} onClick={() => {setEditing(false); onFinishEditExam()}}>
              Cancel
              </button>
              </div>
              </form>
      </div>
      </Modal>
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
          <Card.Text>Start Time:{new Date(exam.startTime).toLocaleDateString()} {new Date(exam.startTime).toLocaleTimeString([], { timeZone: 'UTC' })}</Card.Text>
          <Card.Text>End Time: {new Date(exam.endTime).toLocaleDateString()} {new Date(exam.endTime).toLocaleTimeString([], { timeZone: 'UTC' })}</Card.Text>
          <p>
            Status:{' '}
            <Badge variant={isFinished ? 'success' : 'danger'}>{isFinished ? 'Finished' : 'Not Finished'}</Badge>
          </p>
         
          <p>
         
            <Badge variant='danger'>{ 'Specifications'}</Badge>
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