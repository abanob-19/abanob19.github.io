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
                grade: question.grade,
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
    const handleDeleteChoice=(index,question)=>{
        // const updatedQuestionBank = { ...questionBank };
        // updatedQuestionBank.questions[editedChoiceIndex].choices[editedChoice] = newChoice;
        if(question.choices.length==2)
            alert("You can't delete more choices");
        else
        {
        question.choices.splice(index,1);
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
                grade: question.grade,
              id: question._id,
            })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to delete choice');
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
              alert('Failed to elete choice');
            });
          }  //setVersion(version => version + 1); // force re-render
      };
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
                grade: question.grade,
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
    const[editedQuestionIndexforEditAnswer,setEditedQuestionIndexforEditAnswer]=useState(null);
    const[editedAnswer,setEditedAnswer]=useState(null);

    const handleEditAnswer = (qIndex) => {
        setEditedAnswer(questionBank.questions[qIndex].answer)
        setEditedQuestionIndexforEditAnswer(qIndex)
        
    }
    const handleFinishEditAnswer=(newAnswer,question)=>{
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
              answer: newAnswer,
              category: question.category,
                grade: question.grade,
              id: question._id,
            })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to edit answer');
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
              alert('Failed to edit answer');
            });
      // setVersion(version => version + 1); // force re-render
       setEditedAnswer(null)
       setEditedQuestionIndexforEditAnswer(null)
    }
    const[editedQuestionIndexforEditCategory,setEditedQuestionIndexforEditCategory]=useState(null);
    const[editedCategory,setEditedCategory]=useState(null);

    //create a function to handle edit category
    const handleEditCategory = (qIndex) => {
        setEditedCategory(questionBank.questions[qIndex].category)
        setEditedQuestionIndexforEditCategory(qIndex)
        
    }
    const handleFinishEditCategory=(newCategory,question)=>{
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
              category: newCategory,
                grade: question.grade,
              id: question._id,
            })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to edit category');
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
              alert('Failed to edit category');
            });
      // setVersion(version => version + 1); // force re-render
       setEditedCategory(null)
       setEditedQuestionIndexforEditCategory(null)
    }
    const[editedQuestionIndexforEditGrade,setEditedQuestionIndexforEditGrade]=useState(null);
    const[editedGrade,setEditedGrade]=useState(null);

    //create a function to handle edit category
    const handleEditGrade = (qIndex) => {
        console.log(qIndex)
        if(questionBank.questions[qIndex].grade==undefined||questionBank.questions[qIndex].grade==null){
            setEditedGrade(0)
        }
        else
        {
        setEditedGrade(questionBank.questions[qIndex].grade)
        
        }
        setEditedQuestionIndexforEditGrade(qIndex)
        console.log(editedGrade)
    }
    const handleFinishEditGrade=(newGrade,question)=>{
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
                grade: newGrade,
              id: question._id,
            })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to edit Grade');
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
              alert('Failed to edit Grade');
            });
      // setVersion(version => version + 1); // force re-render
       setEditedGrade(null)
       setEditedQuestionIndexforEditGrade(null)
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
        category: newQuestion.category,
        grade: newQuestion.grade,
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
                      <button onClick={() => handleDeleteChoice(index,question)}>
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {editedQuestionIndexforEditAnswer == qIndex && editedAnswer != null ? (
               
               <div>
                 
               <input
                 type="text"
                 value={editedAnswer}
                 onChange={(e) => setEditedAnswer(e.target.value)}
               />
               <button onClick={() => handleFinishEditAnswer(editedAnswer,question)}>
                 Finish
               </button>
             </div>
             ):(
                <div>
                Answer: {question.answer}
             <button onClick={() => handleEditAnswer(qIndex)}>
               Edit Answer
             </button>
             </div>
             )}
              {editedQuestionIndexforEditCategory == qIndex && editedCategory != null ? (
               
               <div>
                 
               <input
                 type="text"
                 value={editedCategory}
                 onChange={(e) => setEditedCategory(e.target.value)}
               />
               <button onClick={() => handleFinishEditCategory(editedCategory,question)}>
                 Finish
               </button>
             </div>
             ):(
                <div>
                Category: {question.category}
             <button onClick={() => handleEditCategory(qIndex)}>
               Edit Category
             </button>
             </div>
             )}
             {editedQuestionIndexforEditGrade == qIndex && editedGrade != null ? (
               
               <div>
               <input
                 type="text"
                 value={editedGrade}
                 onChange={(e) => setEditedGrade(e.target.value)}
               />
               <button onClick={() => handleFinishEditGrade(editedGrade,question)}>
                 Finish
               </button>
             </div>
             ):(
                <div>
                Grade: {question.grade}
             <button onClick={() => handleEditGrade(qIndex)}>
             {editedQuestionIndexforEditGrade}

               Edit Grade
             </button>
             </div>
             )}
          </div>
        ))}
    </div>
  );
};

export default QuestionBank;