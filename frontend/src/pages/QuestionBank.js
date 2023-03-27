import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react"
//import QuestionForm from "../components/QuestionForm";
import QuestionForm from "../components/QuestionForm";
const QuestionBank = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const questionBankName = searchParams.get('questionBankName'); 
    const name = searchParams.get('name');
    const [questionBank, setQuestionBank] = useState(null);
    const [version, setVersion] = useState(0);
    const [editedChoice, setEditedChoice] = useState(null);
    const [editedChoiceIndex, setEditedChoiceIndex] = useState(null);
    const [editedQuestionIndex, setEditedQuestionIndex] = useState(null);
    const [AddedChoice, setAddedChoice] = useState(null);

    const handleEditChoice = (index,qIndex) => {
        setEditedChoiceIndex(index);
        setEditedChoice(questionBank.questions[qIndex].choices[index]);
        setEditedQuestionIndex(qIndex);
      };
    
      const handleFinishEditChoice = (newChoice,question) => {
        // const updatedQuestionBank = { ...questionBank };
        // updatedQuestionBank.questions[editedChoiceIndex].choices[editedChoice] = newChoice;
        question.choices[editedChoiceIndex] = newChoice;
        fetch('/instructor/editMcqQuestion', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              questionBankName,
              name,
              text: question.text,
              choices: question.choices,
              answer: question.answer,
              category: question.category,
              id: question._id,
            })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to edit question');
              }
              return response.json();
            })
            .then(json => {
              console.log(json);
              setDisplayForm(false);
              setVersion(version => version + 1); // force re-render
            })
            .catch(error => {
              console.error(error);
              alert('Failed to edit question');
            });
       setVersion(version => version + 1); // force re-render
        setEditedChoice(null);
        setEditedChoiceIndex(null);
        setEditedQuestionIndex(null);
      };
    //create a function to handle delete choice
    const handleDeleteChoice = (index) => {
        console.log("delete choice", index);
    }
    //create a function to handle edit question
    const handleEditQuestion = () => {
        console.log("edit question");
    }
    //create a function to handle delete question
    const handleDeleteQuestion = (question) => {
        fetch('/instructor/deleteMcqQuestion', {
          method: 'Delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            questionBankName,
            name,
            id: question,
          })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to delete question');
            }
            return response.json();
          })
          .then(json => {
            console.log(json);
            setVersion(version => version + 1); // force re-render
          })
          .catch(error => {
            console.error(error);
            alert('Failed to delete question');
          });
      }
    
    //create a function to handle add choice
    const[editedQuestionIndexforAddChoice,setEditedQuestionIndexforAddChoice]=useState(null);
    const handleAddChoice = (qIndex) => {
        setAddedChoice("")
        setEditedQuestionIndexforAddChoice(qIndex);
    }
   const handleFinishAddedChoice=(AddedChoice,question)=>{
        // const updatedQuestionBank = { ...questionBank };
        // updatedQuestionBank.questions[editedChoiceIndex].choices[editedChoice] = newChoice;
        question.choices.push(AddedChoice);
        fetch('/instructor/editMcqQuestion', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              questionBankName,
              name,
              text: question.text,
              choices: question.choices,
              answer: question.answer,
              category: question.category,
              id: question._id,
            })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to edit question');
              }
              return response.json();
            })
            .then(json => {
              console.log(json);
              setDisplayForm(false);
              setVersion(version => version + 1); // force re-render
            })
            .catch(error => {
              console.error(error);
              alert('Failed to edit question');
            });
       setVersion(version => version + 1); // force re-render
        setAddedChoice(null);
        setEditedQuestionIndexforAddChoice(null);
      };


    //create a function to handle edit answer
    const handleEditAnswer = () => {
        console.log("edit answer");
    }
    //create a function to handle edit category
    const handleEditCategory = () => {
        console.log("edit category");
    }
 
    const url = `/instructor/openQuestionBank?questionBankName=${questionBankName}&name=${name}`;
    const fetchData = async () => {
      const response = await fetch(url);
      const json = await response.json();
      setQuestionBank(json);
      console.log(json);
    };
    useEffect(() => {
      if (!questionBankName) return; // add a check for undefined
  
      
      fetchData();
    }, [questionBankName, name,version]);
  
    
  
   
  const handleAddQuestion = () => {
    setDisplayForm(true);
  }

  const [displayForm, setDisplayForm] = useState(false);

  const handleFinish = (newQuestion) => {
    fetch('/instructor/addMcqQuestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        questionBankName,
        name,
        text: newQuestion.text,
        choices: newQuestion.choices,
        answer: newQuestion.answer,
        category: newQuestion.category
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add question');
        }
        return response.json();
      })
      .then(json => {
        console.log(json);
        setDisplayForm(false);
        setVersion(version => version + 1); // force re-render
      })
      .catch(error => {
        console.error(error);
        alert('Failed to add question');
      });
  }
  
  

  return (
    <div>
      <h1>{questionBankName}</h1>
      <p>{name}</p>
      <button onClick={handleAddQuestion}>Add Question</button>

      {displayForm && <QuestionForm onFinish={handleFinish} />}

      {questionBank &&
        questionBank.questions &&
        questionBank.questions.map((question,qIndex) => (
          <div key={question._id}>
            <h3>{question.text}</h3>{" "}
            <button onClick={() => handleDeleteQuestion(question._id)}>
              Delete Question
            </button>
            {editedQuestionIndexforAddChoice == qIndex && AddedChoice != null ? (
               
              <div>
                
              <input
                type="text"
                value={AddedChoice}
                onChange={(e) => setAddedChoice(e.target.value)}
              />
              <button onClick={() => handleFinishAddedChoice(AddedChoice,question)}>
                Finish
              </button>
            </div>
            ):(
            <button onClick={() => handleAddChoice(qIndex)}>
              Add Choice
            </button>
            )}


            <ul>
              {question.choices.map((choice, index) => (
                <li key={index}>
                  {editedChoiceIndex == index && editedChoice != null && editedQuestionIndex==qIndex ? (
                    <div>
                      <input
                        type="text"
                        value={editedChoice}
                        onChange={(e) => setEditedChoice(e.target.value)}
                      />
                      <button onClick={() => handleFinishEditChoice(editedChoice,question)}>
                        Finish
                      </button>
                    </div>
                  ) : (
                    <div>
                      {choice}
                      <button onClick={() => handleEditChoice(index,qIndex)}>Edit</button>
                      <button onClick={() => handleDeleteChoice(index)}>
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <p>Answer: {question.answer}</p>
            <p>Category: {question.category}</p>
          </div>
        ))}
    </div>
  );
};

export default QuestionBank;