import React, { useState } from 'react';
import axios from 'axios';
import styles from '../pages/Instructor.module.css';


function ExamCard({ exam, onDelete , onEdit ,onFinishEditExam}) {
  const isFinished = new Date() > new Date(exam.endTime);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(exam.title);
  const [courseName, setCourseName] = useState(exam.courseName);
  const [startTime, setStartTime] = useState(exam.startTime);
  const [endTime, setEndTime] = useState(exam.endTime);
  const [specs, setSpecs] = useState(exam.specs);
  const [isLoading, setIsLoading] = useState(false);


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
      <div>
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
          </div>
        ))}

        <button onClick={handleAddSpec}>Add Spec</button>

        <button onClick={handleSaveClick}>Save</button>
        <button onClick={() => {setEditing(false); onFinishEditExam()}}>Cancel</button>
      </div>
    );
  }
  
  return (
    <div>
      <h3>{exam.title}</h3>
      <p>Course : {exam.courseName}</p>
      <p>Start Time: {new Date(exam.startTime).toLocaleString()}</p>
      <p>End Time: {new Date(exam.endTime).toLocaleString()}</p>

      <p>Status: {isFinished ? "Finished" : "Not Finished"}</p>
      {exam.specs.map((spec, index) => (
        <div key={index}>
          <p>Chapter: {spec.chapter}</p>
          <p>Category: {spec.category}</p>
          <p>Number of Questions: {spec.numQuestions}</p>
        </div>
      ))}
      {<button onClick={handleEditClick }>Edit</button>}
      <button onClick={handleDeleteClick}>Delete</button>
      
    </div>
  );
}

export default ExamCard;
