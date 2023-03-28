
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';

const Course = () => {
  const [questionBanks, setQuestionBanks] = useState([]);
  const [newQuestionBankName, setNewQuestionBankName] = useState(null);
  const [editingQuestionBankId, setEditingQuestionBankId] = useState(null);

  const { courseName } = useParams();
  const[version,setVersion]=useState(0);

  useEffect(() => {
    // Fetch question banks from server and update state
    const fetchData = async () => { 
        await fetch(`/instructor/seeCourse/${courseName}`)
      .then(async response => await response.json())
      .then(data => setQuestionBanks(data))
      .catch(error => console.error(error));}
      fetchData();
      console.log(questionBanks);
     
  }, [version]);
const[newBank,setNewBank]=useState(false)
  const handleNewQuestionBankClick = () => {
    // Show the new question bank input field
    setNewQuestionBankName("");
    setEditingQuestionBankId(null);
    setNewBank(true)
  };

  const handleNewQuestionBankNameChange = event => {
    setNewQuestionBankName(event.target.value);
  };

   const handleNewQuestionBankSubmit = async () => {
    // Send a POST request to create the new question bank
    fetch(`/instructor/addQuestionBank`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ questionBankName: newQuestionBankName,
        name: courseName })
    })
      .then(async response => await response.json())
      .then(data => {
        setQuestionBanks([...questionBanks, data]);
        setNewQuestionBankName(null);
        setNewBank(false);
        setVersion(version => version + 1);
      })
      .catch(error => console.error(error));
      
      
   };

  const handleQuestionBankEditClick = (questionBankId) => {
    // Show the edit input field for the selected question bank
    const questionBankToEdit = questionBanks.find(questionBank => questionBank._id === questionBankId);
   
    setNewQuestionBankName(questionBankToEdit.title);
    setEditingQuestionBankId(questionBankId);
  };

  const handleQuestionBankNameChange = event => {
    setNewQuestionBankName(event.target.value);
  };

  const handleQuestionBankSubmit = async (questionBankId) => {
    // Send a PUT request to update the selected question bank
    await fetch(`/instructor/editQuestionBank/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id:questionBankId,
        name: courseName,
        qname: newQuestionBankName })
    })
      .then(async response =>await response.json())
      .then(data => {
        setQuestionBanks(questionBanks.map(questionBank => {
          if (questionBank.id === questionBankId) {
            return data;
          } else {
            return questionBank;
          }
        }));
        setNewQuestionBankName(null);
        setEditingQuestionBankId(null);
        setVersion(version => version + 1);
      })
      .catch(error => console.error(error));
   };

  const handleQuestionBankDelete = (questionBankId) => {
  
    fetch(`/instructor/deleteQuestionBank/`, {
      method: "Delete",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: questionBankId,
            name: courseName })
    })
      .then(response => {
        if (response.ok) {
          setQuestionBanks(questionBanks.filter(questionBank => questionBank.id !== questionBankId));
        } else {
          console.error("Failed to delete question bank.");
          console.error(response);
        }
        setVersion(version => version + 1);
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Question Banks</h1>
      <button onClick={handleNewQuestionBankClick}>Add Question Bank</button>
      <br />
      <br />
      {newQuestionBankName !== null && newBank&& (
        <div>
            
          <input type="text" value={newQuestionBankName} onChange={handleNewQuestionBankNameChange} />
          <button onClick={handleNewQuestionBankSubmit}>Add</button>
          <button onClick={() => {setNewQuestionBankName(null);setNewBank(false);}}>Cancel</button>
        </div>
      )}
      {questionBanks.map(questionBank => (
        <div key={questionBank._id}>
          {editingQuestionBankId === questionBank._id ? (
            <div>
              <input type="text" value={newQuestionBankName} onChange={handleQuestionBankNameChange} />
              <button onClick={() => handleQuestionBankSubmit(questionBank._id)}>Save</button>
              <button onClick={() => setEditingQuestionBankId(null)}>Cancel</button>
            </div>
          ) : (
            <div>
                
              <Link to={`/QuestionBank/?questionBankName=${questionBank.title}&name=${questionBank.course}`}>{questionBank.title}</Link>
              <button onClick={() => handleQuestionBankEditClick(questionBank._id)}>Edit</button>
              <button onClick={() => handleQuestionBankDelete(questionBank._id)}>Delete</button>
            </div>)}
        </div>
        ))}
    </div>
    );
};
export default Course;