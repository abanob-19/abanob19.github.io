import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Button,Badge,ListGroup, ListGroupItem } from "react-bootstrap";
import {faPencilAlt , faTrash} from '@fortawesome/free-solid-svg-icons';
import styles from '../pages/Instructor.module.css'; 
import { FaPlus,FaMinusCircle } from 'react-icons/fa';
function ExamCard({ exam, onDelete , onEdit ,onFinishEditExam , onSampleClick,questionBanks2 ,yourIndex  }) {
  const now = new Date (Date.now())  

  const startTime1 = (new Date(exam.startTime)).setHours((new Date(exam.startTime)).getHours() - 3) ;
  const remainingToStart = startTime1 > now ? (startTime1 - now) / 1000 : 0;
  const endTime1 =  (new Date(exam.endTime)).setHours((new Date(exam.endTime)).getHours() - 3) ;
  const remainingToEnd = endTime1 > now ? (endTime1 - now) / 1000 : 0;
const isFinished = (remainingToEnd == 0);
  

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(exam.title);
  const [courseName, setCourseName] = useState(exam.courseName);
  const [startTime, setStartTime] = useState(exam.startTime);
  const [endTime, setEndTime] = useState(exam.endTime);
  const [examType, setExamType] = useState(exam.type);
  const [specs, setSpecs] = useState(exam.specs);
  const [isLoading, setIsLoading] = useState(false);
  const [questionBanks, setQuestionBanks] = useState([]);
  const[warning,setWarning]=useState(false)
useEffect(() => {
 //loop over specs and check if there is a questionBank name that is not in the questionBanks2 array
  for (let i = 0; i < specs.length; i++) {
    if (!questionBanks2.includes(specs[i].chapter)) {
      setWarning(true)
      console.log("question bank not found")
    }
  }
  if(specs.length==0){
    setWarning(true)
  }
}, [])
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
    const fetchData =  () => { 
      fetch(`/instructor/seeCourse/${exam.courseName}`)
   .then(async response => await response.json())
   .then(data => setQuestionBanks(data))
   .catch(error => console.error(error));}
   fetchData();
  };

  const handleSaveClick = async(event) => {
    event.preventDefault();
    const startDateTime = Date.parse(startTime);
    const endDateTime = Date.parse(endTime);
        var flag=false
        var flag2=false
        for (let i = 0; i < specs.length; i++) {
          if (specs[i].chapter === '' || specs[i].category === '' || specs[i].numQuestions === '' || specs[i].grade === '') {
            console.log(specs[i].chapter,specs[i].category,specs[i].numQuestions,specs[i].grade)
           flag=true
           console.log("specs empty")
          }
        }
        console.log("here")
        //loop over specs and check if there is a duplicate
        for (let i = 0; i < specs.length; i++) {
          for (let j = i+1; j < specs.length; j++) {
            if (specs[i].chapter === specs[j].chapter && specs[i].category === specs[j].category) {
              flag2=true
              console.log("duplicate specs")
            }
          }
        }
        console.log("here2")
        if(title==='' || flag){
          alert("Please fill all fields")
          console.log("title or specs emoty")
        }
        else if (flag2){
          alert("Please remove duplicate specifications")
          console.log("duplicate specs")
        }
        else if(isNaN(startDateTime) || isNaN(endDateTime)){
          alert("Please enter a valid date")
          console .log("invalid date")
        }
        else if(startDateTime>endDateTime){
          alert("Start time must be before end time")
          console.log("start time after end time")
        }
      
        else{
    
    setIsLoading(true);
    await axios.put(`/instructor/editExam/`, {
        courseName,
        title,
        type:examType,
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
   } };

  const handleAddSpec = () => {
    setSpecs(prevSpecs => [...prevSpecs, { chapter: '', category: 'Easy', numQuestions: 0 ,grade:0 }]);
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
      <div style={{}}>
      <form onSubmit={handleSaveClick} className={styles['form']} >
        <div className={styles['form-group']}>
          <label className={styles['form-label']}>
             {courseName.charAt(0).toUpperCase() + courseName.slice(1)}
           
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
            Exam Type:
             <select
            className={styles['form-control']}
           value={examType}
            onChange={(event) => setExamType(event.target.value)}
>
  
<option value="Quiz">Quiz</option>
  <option value="Final">Final</option>
  <option value="MidTerm">MidTerm</option>
  <option value="Assignment">Assignment</option>
 
</select>
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
          Bank:
          <Form.Select  value={spec.chapter} onChange={(event) => handleSpecChange( index, 'chapter',event.target.value)} className={styles['form-control']}>
               <option value="">Select Bank</option>
                {questionBanks.map((bank,index) => (
                  <option key={index} value={bank.title}>{bank.title}</option>
                ))}
              </Form.Select>
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
        <label className={styles['form-label']}>
          Grade:
          <input
            type="number"
            className={styles['form-control']}
            value={spec.grade}
            onChange={(event) => handleSpecChange( index,'grade', parseInt(event.target.value))}
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
        {warning && <p style={{color:'red', fontSize: '0.8em'}}>One of Question Banks declared not found, please edit</p>}

        <Card.Body>
          {exam.courseName && (
            <Card.Subtitle className='mb-2 text-muted'>
              Course: {exam.courseName.charAt(0).toUpperCase() + exam.courseName.slice(1)}
            </Card.Subtitle>
          )}
          <Card.Text>Start Time:{new Date(exam.startTime).toISOString().split('T')[0]} {new Date(exam.startTime).toLocaleTimeString([], { timeZone: 'UTC' })}</Card.Text>
          <Card.Text>End Time: {new Date(exam.endTime).toISOString().split('T')[0]}  {new Date(exam.endTime).toLocaleTimeString([], { timeZone: 'UTC' })}</Card.Text>
          <Card.Text>Exam Type: {exam.type}</Card.Text>

          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
  <span>Status:{' '}</span>
  {!isFinished && (
    <div style={{  color: 'red', padding: '4px' }}>
      Not Finished
    </div>
  )}
  {isFinished && (
    <div style={{ color: 'green', padding: '4px' }}>
      Finished
    </div>
  )}
</div>

          <ListGroup>
            {exam.specs.map((spec, index) => (
              <ListGroupItem key={index}>
                
                <div>
                  <strong>Bank:</strong> {spec.chapter}
                </div>
                <div>
                  <strong>Category:</strong> {spec.category}
                </div>
                <div>
                  <strong>Number of Questions:</strong> {parseInt(spec.numQuestions)}
                </div>
                <div>
                  <strong>Grade:</strong> {parseInt(spec.grade)}
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