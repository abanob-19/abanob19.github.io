import React, { useState } from 'react';
import axios from 'axios';
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import styles from '../pages/Instructor.module.css';


function CreateExamForm({ onClose }) {
  const [courseName, setCourseName] = useState('');
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [specs, setSpecs] = useState([{chapter: '', category: '', numQuestions: ''}]); // Default specification
  const { state,dispatch } = useInstructorsContext()
  const[isLoading,setIsLoading] = useState(false)
  const handleSubmit = async (event) => {
    event.preventDefault();
   setIsLoading(true)
    const specsJson = specs.map(spec => ({
      chapter: spec.chapter,
      category: spec.category,
      numQuestions: spec.numQuestions
    }));

    try {
      const response = await axios.post('/instructor/createExam', {
        courseName,
        title,
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
    onClose();
  };

  const handleAddSpec = () => {
    setSpecs([...specs, {chapter: '', category: '', numQuestions: ''}]);
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
  if(isLoading){
  return  <div className={styles['container']}>
  <div className={styles['loader']}></div>
</div>}
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Course Name:
        <input
          type="text"
          value={courseName}
          onChange={(event) => setCourseName(event.target.value)}
        />
      </label>
      <br />
      <label>
        Exam Title:
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <br />
      <label>
        Start Time:
        <input
          type="datetime-local"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
        />
      </label>
      <br />
      <label>
        End Time:
        <input
          type="datetime-local"
          value={endTime}
          onChange={(event) => setEndTime(event.target.value)}
        />
      </label>
      <br />
      <label>Exam Specifications:</label>
      <br />
      {specs.map((spec, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Chapter"
            value={spec.chapter}
            onChange={(event) => handleSpecChange(event, index, 'chapter')}
          />
          <input
            type="text"
            placeholder="Category"
            value={spec.category}
            onChange={(event) => handleSpecChange(event, index, 'category')}
          />
          <input
            type="text"
            placeholder="Number of Questions"
            value={spec.numQuestions}
            onChange={(event) => handleSpecChange(event, index, 'numQuestions')}
          />
            {specs.length > 1 && (
      <button onClick={() => handleRemoveSpec(index)}>Remove Spec</button>
    )}
        </div>
      ))}
      <button type="button" onClick={handleAddSpec}>
        Add Specification
      </button>
      <br />
      <button type="submit">Create Exam</button>
      <button onClick={onClose}>Cancel</button>
    </form>
  );
}

export default CreateExamForm;
