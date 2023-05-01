import React, { useState } from 'react';
import axios from 'axios';
import { useInstructorsContext } from '../hooks/useInstrcutorContext';
import Modal from 'react-modal';
import { FaPlus, FaMinus , FaMinusCircle } from 'react-icons/fa';
import styles from '../pages/Instructor.module.css';
import { Form , Button } from 'react-bootstrap';
Modal.setAppElement('#root'); // this line is required by react-modal

function CreateExamForm({ onClose }) {
  const [courseName, setCourseName] = useState('');
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [examType, setExamType] = useState(''); 
  const [specs, setSpecs] = useState([{chapter: '', category: 'Easy', numQuestions: '',grade:''}]); // Default specification
  const { state,dispatch } = useInstructorsContext()
  const[isLoading,setIsLoading] = useState(false)
  const[user,setUser] = useState(JSON.parse(localStorage.getItem('user')))
const [questionBanks, setQuestionBanks] = useState([]);
  const handleSubmit = async (event) => {
    //loop over specs and check if all fields are filled
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
    else if(startDateTime<Date.now()){
      alert("Start time must be in the future")
      console.log("start time in the past")
    }
    else{

    console.log('here5');
    setIsLoading(true)
    const specsJson = specs.map(spec => ({
      chapter: spec.chapter,
      category: spec.category,
      numQuestions: spec.numQuestions,
      grade: spec.grade
    }));

    try {
      const response = await axios.post('/instructor/createExam', {
        courseName,
        title,
        type:examType,
        startTime:startTime+"z",
        endTime:endTime+"z",
        specs: specsJson,
      });

      console.log(response.data);
      alert("Exam Created Successfully");
      dispatch({type: 'CREATE_EXAM'})
      setIsLoading(false)
      console.log(state.secVersion)
      // handle success response here
    } catch (error) {
      console.error(error);
      // handle error here
    }
    console.log('here');
    onClose();}
  };

  const handleAddSpec = () => {
    setSpecs([...specs, {chapter: '', category: 'Easy', numQuestions: '' , grade:''}]);
  };

  const handleRemoveSpec = (index) => {
    setSpecs(prevSpecs => {
      const newSpecs = [...prevSpecs];
      newSpecs.splice(index, 1);
      return newSpecs;
    });
  };

  const handleSpecChange = (event, index, field) => {
    const updatedSpecs = [...specs];
    updatedSpecs[index][field] = event.target.value;
    setSpecs(updatedSpecs);
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      className={styles['modal']}
      overlayClassName={styles['overlay']}
    >
      {isLoading && (
        <div className={styles['loader']}></div>
      )}
      <h2 className={styles['form-title']}>Create New Exam</h2>
      <form onSubmit={handleSubmit} className={styles['form']} >
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
            Course Name:
            <select
            className={styles['form-control']}
           value={courseName}
           onChange={(event) =>{ setCourseName(event.target.value);
            const fetchData =  () => { 
                 fetch(`/instructor/seeCourse/${event.target.value}`)
              .then(async response => await response.json())
              .then(data => setQuestionBanks(data))
              .catch(error => console.error(error));}
              fetchData();}}
>
  {user.courses.map((course) => (
    <option key={course} value={course}>
      {course.charAt(0).toUpperCase() + course.slice(1)}
    </option>
  ))}
</select>

          </label>
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
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              />
              </label>
              </div>
              <div className={styles['form-group']}>
              <label className={styles['form-label']}>
              End Time:
              <input
              type="datetime-local"
              className={styles['form-control']}
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
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
          <Form.Select  value={spec.chapter} onChange={(event) => handleSpecChange(event, index, 'chapter')} className={styles['form-control']}>
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
    onChange={(event) => handleSpecChange(event, index, 'category')}
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
            onChange={(event) => handleSpecChange(event, index, 'numQuestions')}
          />
        </label>
        <label className={styles['form-label']}>
          Grade:
          <input
            type="number"
            className={styles['form-control']}
            value={spec.grade}
            onChange={(event) => handleSpecChange(event, index, 'grade')}
          />
        </label>
      </div>
    </li>
  ))}
</ul>

              </div>
              <div className={styles['form-group']}>
              <button type="submit" className={styles['btn-primary']}>
              Create Exam
              </button>
              <button type="button" className={styles['btn-secondary']} onClick={onClose}>
              Cancel
              </button>
              </div>
              </form>
              </Modal>
              );
              }
              
              export default CreateExamForm;
