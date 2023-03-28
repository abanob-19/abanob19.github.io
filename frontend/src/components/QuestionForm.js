import React, { useState } from 'react';

const QuestionForm = ({ onFinish }) => {
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    choices: ['', ''],
    answer: '',
    category: '',
    grade: '',
  });

  const handleNewQuestionChange = (event) => {
    setNewQuestion({
      ...newQuestion,
      [event.target.name]: event.target.value
    });
  };

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
  };

  const handleRemoveChoice = (index) => {
    const updatedChoices = [...newQuestion.choices];
    updatedChoices.splice(index, 1);

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
    <div>
      <form>
        <label>
          Question Text:
          <input type="text" name="text" value={newQuestion.text} onChange={handleNewQuestionChange} />
        </label>
        <br />
        <label>
          Choices:
          <br />
          {newQuestion.choices.map((choice, index) => (
            <div key={index}>
              <input type="text" value={choice} onChange={(event) => handleNewChoiceChange(event, index)} />
              <button type="button" onClick={() => handleRemoveChoice(index)}>Remove Choice</button>
            </div>
          ))}
          <button type="button" onClick={handleAddChoice}>Add Choice</button>
        </label>
        <br />
        <label>
          Answer:
          <input type="text" name="answer" value={newQuestion.answer} onChange={handleNewQuestionChange} />
        </label>
        <br />
        <label>
          Category:
          <input type="text" name="category" value={newQuestion.category} onChange={handleNewQuestionChange} />
        </label>
        <br />
        <label>
            Grade:
            <input type="text" name="grade" value={newQuestion.grade} onChange={handleNewQuestionChange} />
        </label>
      </form>
      <button onClick={handleFinish}>Finish</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default QuestionForm;
