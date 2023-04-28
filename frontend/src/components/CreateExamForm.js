import React, { useState } from 'react';
import axios from 'axios';
import { useInstructorsContext } from '../hooks/useInstrcutorContext';
import Modal from 'react-modal';
import { FaPlus, FaMinus , FaMinusCircle } from 'react-icons/fa';
import styles from '../pages/Instructor.module.css';

Modal.setAppElement('#root'); // this line is required by react-modal

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
          Chapter:
          <input
            type="text"
            className={styles['form-control']}
            value={spec.chapter}
            onChange={(event) => handleSpecChange(event, index, 'chapter')}
          />
        </label>
        <label className={styles['form-label']}>
          Category:
          <input
            type="text"
            className={styles['form-control']}
            value={spec.category}
            onChange={(event) => handleSpecChange(event, index, 'category')}
          />
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
