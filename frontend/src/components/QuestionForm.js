import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from '../pages/Instructor.module.css';
import { FaTimes } from 'react-icons/fa';
import { Form , Button } from 'react-bootstrap';
const QuestionForm = ({ onFinish ,isOpen}) => {
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    choices: ['', ''],
    answer: '',
    category: '',
    grade: '',
    type:'mcq',
  });
const[type,setType]=useState("mcq")
const[numberOfChoices,setNumberOfChoices]=useState(2)
  const handleNewQuestionChange = (event) => {
    
    setNewQuestion({
      ...newQuestion,
      [event.target.name]: event.target.value
    });
    console.log(event.target.name,event.target.value)
  };
  // const handleTypeChange = (event) => {
  //   setType(event.target.value);
  //   setNewQuestion(prevQuestion => ({
  //     ...prevQuestion,
  //     [event.target.name]: event.target.value
  //   }));
  // };
  
  const handleNewChoiceChange = (event, index) => {
    const updatedChoices = [...newQuestion.choices];
    updatedChoices[index] = event.target.value;

    setNewQuestion({
      ...newQuestion,
      choices: updatedChoices
    });
  };

  const handleAddChoice = () => {
    const updatedChoices = [...newQuestion.choices, ''];

    setNewQuestion({
      ...newQuestion,
      choices: updatedChoices
    });
    setNumberOfChoices(numberOfChoices+1)
  };

  const handleRemoveChoice = (index) => {
    const updatedChoices = [...newQuestion.choices];
    updatedChoices.splice(index, 1);
    setNumberOfChoices(numberOfChoices-1)

    setNewQuestion({
      ...newQuestion,
      choices: updatedChoices
    });
  };

  const handleFinish = () => {
    onFinish(newQuestion);
  };
  const handleCancel = () => {
    onFinish(null);
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={handleCancel}
      className={styles['modal']}
      overlayClassName={styles['overlay']}
    >
      <div className="modal-header">
        <h2 className="modal-title">Add Question</h2>
        <button className="close-button" onClick={handleCancel}>
          <FaTimes />
        </button>
      </div>
      <div className="modal-body">
        <Form>
          <Form.Group controlId="formQuestionType">
            <Form.Label>Question Type:</Form.Label>
            <Form.Control as="select" name="type" value={newQuestion.type} onChange={handleNewQuestionChange}>
              <option value="mcq">MCQ</option>
              <option value="text">Text</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formQuestionText">
            <Form.Label>Question Text:</Form.Label>
            <Form.Control type="text" name="text" value={newQuestion.text} onChange={handleNewQuestionChange} style={{width:'90%'}} />
          </Form.Group>
          {newQuestion.type === 'mcq' && (
            <Form.Group controlId="formQuestionChoices">
              <Form.Label>Choices:</Form.Label>
              <br />
              {newQuestion.choices.map((choice, index) => (
                <div key={index}>
                  <Form.Control type="text" value={choice} onChange={(event) => handleNewChoiceChange(event, index)} />
                  {numberOfChoices > 2 && (
                    <Button variant="danger" type="button" onClick={() => handleRemoveChoice(index)}>
                      Remove Choice
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="primary" type="button" onClick={handleAddChoice}>
                Add Choice
              </Button>
            </Form.Group>
          )}
          {newQuestion.type === 'mcq' && (
            <Form.Group controlId="formQuestionAnswer">
              <Form.Label>Answer:</Form.Label>
              <Form.Select name="answer"  value={newQuestion.answer} onChange={handleNewQuestionChange} style={{width:'20%'}}>
                {newQuestion.choices.map((choice, index) => (
                  <option key={index} value={choice}>{choice}</option>
                ))}
              </Form.Select>
              {/* <Form.Control type="text" name="answer" value={newQuestion.answer} onChange={handleNewQuestionChange} /> */}
            </Form.Group>
          )}
          <Form.Group controlId="formQuestionCategory">
            <Form.Label>Category:</Form.Label>
            <Form.Select name="category"  value={newQuestion.category} onChange={handleNewQuestionChange} style={{width:'15%'}}>
      <option value="Easy">Easy</option>
      <option value="Medium">Medium</option>
      <option value="Hard">Hard</option>
    </Form.Select>
            {/* <Form.Control type="text" name="category" value={newQuestion.category} onChange={handleNewQuestionChange} /> */}
          </Form.Group>
          <Form.Group controlId="formQuestionGrade">
            <Form.Label>Grade:</Form.Label>
            <Form.Control type="number" name="grade" value={newQuestion.grade} onChange={handleNewQuestionChange} style={{width:'15%'}} />
          </Form.Group>
        </Form>
      </div>
      <div className="modal-footer">
        <Button variant="primary" onClick={handleFinish}>
          Finish
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default QuestionForm;
