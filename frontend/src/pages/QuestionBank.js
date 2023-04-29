import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom';
import PDFViewer from "./PDFViewer";
import InstructorNavbar from '../components/instructorNavbar';
import axios from 'axios';
import styles from '../pages/Instructor.module.css';
import { Button, Card, Form, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faSave, faTimes, faP , faDownload, faUpload} from '@fortawesome/free-solid-svg-icons';
//import QuestionForm from "../components/QuestionForm";
import QuestionForm from "../components/QuestionForm";
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
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
    const [file, setFile] = useState(null);
const[loading,setLoading]=useState(false)
    
    
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };
  
    const handleUpload =  (q) => {
      if (file){
      const formData = new FormData();
      formData.append('attachment', file);
      formData.append('questionId', q);
      formData.append('questionBankId', questionBank._id);
      formData.append('courseName', name);
  
      setLoading(true)
      fetch(`/instructor/uploadFile`, {
        method: 'POST',
        'Content-Type': 'multipart/form-data',
        body: formData, 
    
   
      })
        .then(json => {
          console.log(json);
          setFile(null);
          setVersion(version => version + 1); // force re-render
        })
        .catch(error => {
          console.error(error);
          alert('Failed to edit question');
        });}
        else 
        alert('No file selected');
      }
  
        
      

    const handleEditChoice = (index,qIndex) => {
        setEditedChoiceIndex(index);
        setEditedChoice(questionBank.questions[qIndex].choices[index]);
        setEditedQuestionIndex(qIndex);
      };
    
      const handleFinishEditChoice = (newChoice,question) => {
        // const updatedQuestionBank = { ...questionBank };
        // updatedQuestionBank.questions[editedChoiceIndex].choices[editedChoice] = newChoice;
        question.choices[editedChoiceIndex] = newChoice;
        setLoading(true)
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
          const confirmed = window.confirm("Are you sure you want to delete this choice?");
    if (confirmed) {
        question.choices.splice(index,1);
        setLoading(true)
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
            });}
          }  //setVersion(version => version + 1); // force re-render
      };
    //create a function to handle edit question
    const handleEditQuestion = () => {
        console.log("edit question");
    }
    //create a function to handle delete question
    const handleDeleteQuestion = (question) => {
      const confirmed = window.confirm("Are you sure you want to delete this question ?");
    if (confirmed) {
      setLoading(true)
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
      }}
    
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
        setLoading(true)
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
      setLoading(true)
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
      setLoading(true)
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
      setLoading(true)
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
    const[editedQuestionIndexforEditText,setEditedQuestionIndexforEditText]=useState(null);
    const[editedText,setEditedText]=useState(null);

    const handleEditText = (qIndex) => {
        setEditedText(questionBank.questions[qIndex].text)
        setEditedQuestionIndexforEditText(qIndex)
        
    }
    const handleFinishEditText=(newText,question)=>{
      setLoading(true)
        fetch('/instructor/editMcqQuestion', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              questionBankName,
              name,
              text: newText,
              choices: question.choices,
              answer: question.answer,
              category: question.category,
                grade: question.grade,
              id: question._id,
            })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to edit Text');
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
              alert('Failed to edit Text');
            });
      // setVersion(version => version + 1); // force re-render
       setEditedText(null);
       setEditedQuestionIndexforEditText(null)
    }
 
 
    const url = `/instructor/openQuestionBank?questionBankName=${questionBankName}&name=${name}`;
    const fetchData = async () => {
      setLoading(true)
      const response = await fetch(url);
      const json = await response.json();
      setQuestionBank(json);
      console.log(json);
      setLoading(false)
    };
    useEffect(() => {
      if (!questionBankName) return; // add a check for undefined
  
      
      fetchData();
    }, [version]);
  
    
  
   
  const handleAddQuestion = () => {
    setDisplayForm(true);
  }

  const [displayForm, setDisplayForm] = useState(false);

  const handleFinish = (newQuestion) => {
    if(newQuestion){
      console.log(newQuestion.type)
      setLoading(true)
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
        type: newQuestion.type,
        attachment: newQuestion.attachment,
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response);
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
        alert(error);
      });
  }
  else{
    setDisplayForm(false);
  }
}
if (!questionBank||loading) {
  return (
    <div className={styles['container']}>
      <div className={styles['loader']}></div>
    </div>
  );
}
 
  const handleDownload = async (attachment) => {
    try {
      const response = await axios.get(`/instructor/downloadFile/?attachment=${attachment}`, {
        responseType: 'blob', // set the response type to blob to handle binary data
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
      // create a temporary link and click it to download the file
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', attachment);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };
  
  // call the handleDownload function when the user clicks a download button or link
  
  return (
    <div  >
      <InstructorNavbar />
      <h1 style={{paddingTop:'72px'}}>{name.charAt(0).toUpperCase()+name.slice(1)}</h1>
      <h2 >{questionBankName}</h2>
      
      {displayForm && <QuestionForm onFinish={() => setDisplayForm(false)} />}
      {questionBank && questionBank.questions && questionBank.questions.map((question, qIndex) => (
        <Card key={question._id} className={styles.courseCard}  style={{ boxShadow: '0px 0px 24px 24px rgba(0,0,0,0.1)', borderRadius: '10px' , width:'70%'}}>
          <Card.Body>
            {editedQuestionIndexforEditText === qIndex && editedText !== null ? (
              <div>
                <Form.Control type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                <Button variant="primary" onClick={() => handleFinishEditText(editedText, question)}> <FontAwesomeIcon icon={faSave} />Save</Button>
                <button className="btn btn-danger" onClick={() => {setEditedText(null);setEditedQuestionIndexforEditText(null)}}>
                <FontAwesomeIcon icon={faTimes} className="me-2" />
              </button>
              </div>
            ) : (
              <div className="d-flex align-items-center">
              <h3 className="mb-0 me-2">{question.text}</h3>
              <div className="d-flex">
                <FontAwesomeIcon icon={faEdit} className="text-warning ms-2" style={{ cursor: 'pointer' }} onClick={() => {
                  setEditedText(question.text);
                  setEditedQuestionIndexforEditText(qIndex);
                }} />
                <FontAwesomeIcon icon={faTrashAlt} className="text-danger ms-2" style={{ cursor: 'pointer' }} onClick={() => handleDeleteQuestion(question._id)} />
              </div>
            </div>
            )}
            {question.type === "mcq" && 
            <ListGroup className="my-3" style={{width:'60%'}}>
              <h2>Choices:</h2>
              {question.choices.map((choice, cIndex) => (
                <ListGroup.Item key={cIndex}>
                  {editedChoiceIndex === cIndex && editedChoice !== null ? (
                    <div>
                      <Form.Control type="text" value={editedChoice} onChange={(e) => setEditedChoice(e.target.value)} />
                      <Button variant="primary" onClick={() => handleFinishEditChoice(editedChoice, question, cIndex)}> <FontAwesomeIcon icon={faSave} />Save</Button>
                      <button className="btn btn-danger" onClick={() => {setEditedChoice(null);setEditedChoiceIndex(null); setEditedQuestionIndex(null);}}>
                <FontAwesomeIcon icon={faTimes} className="me-2" />
              </button>
                    </div>
                  ) : (
                    <div >
                      {choice}
                      <FontAwesomeIcon icon={faEdit}  style={{ cursor: 'pointer' , marginLeft: '10px' }}onClick={() => {
                        setEditedChoice(choice);
                        setEditedChoiceIndex(cIndex);
                      }}/>
                      <FontAwesomeIcon icon={faTrashAlt}  style={{ cursor: 'pointer' , marginLeft: '10px' }} onClick={() => handleDeleteChoice(cIndex,question)}/>
                    </div>
                  )}
                </ListGroup.Item>
              ))}
              {editedQuestionIndexforAddChoice === qIndex && AddedChoice !== null ? (
                <div>
                  <Form.Control type="text" value={AddedChoice} onChange={(e) => setAddedChoice(e.target.value)} />
                  <Button variant="primary" onClick={() => handleFinishAddedChoice(AddedChoice, question)}> <FontAwesomeIcon icon={faSave} /> Save</Button>
                  <button className="btn btn-danger" onClick={() => {setEditedQuestionIndexforAddChoice(null);setAddedChoice(null)}}>
                <FontAwesomeIcon icon={faTimes} className="me-2" />
              </button>
                </div>
              ) : (
                <div>
                  <Button variant="success" onClick={() => handleAddChoice(qIndex)}> <FontAwesomeIcon icon={faPlus} className="me-2" />Add Choice</Button>
                </div>
              )}
            </ListGroup>}
            {editedQuestionIndexforEditAnswer === qIndex && editedAnswer !== null ? (
              <div>
              <Form.Select value={editedAnswer} onChange={(e) => setEditedAnswer(e.target.value)} style={{width:'20%'}}>
                {question.choices.map((choice, index) => (
                  <option key={index} value={choice}>{choice}</option>
                ))}
              </Form.Select>
              <Button variant="primary" onClick={() => handleFinishEditAnswer(editedAnswer, question)}>
                <FontAwesomeIcon icon={faSave} className="me-2" />Save
              </Button>
              <button className="btn btn-danger" onClick={() => {
                setEditedAnswer(null);
                setEditedQuestionIndexforEditAnswer(null);
              }}>
                <FontAwesomeIcon icon={faTimes} className="me-2" />
              </button>
            </div>
            ) : (
              <div className="d-flex align-items-center">
              <h3 className="mb-0 me-2">Answer:</h3>
              <p className="mb-0">{question.answer}</p>
              <FontAwesomeIcon icon={faEdit}  style={{ cursor: 'pointer' , marginLeft: '10px' }} onClick={() => {
                setEditedAnswer(question.answer);
                setEditedQuestionIndexforEditAnswer(qIndex);
              }} className="ms-2"/>
            </div>
            )}
            {editedQuestionIndexforEditCategory === qIndex && editedCategory !== null ? (
              <div>
                 <Form.Select value={editedCategory} onChange={(e) => setEditedCategory(e.target.value)} style={{width:'8%'}}>
      <option value="Easy">Easy</option>
      <option value="Medium">Medium</option>
      <option value="Hard">Hard</option>
    </Form.Select>
                <Button variant="primary" onClick={() => handleFinishEditCategory(editedCategory, question)}><FontAwesomeIcon icon={faSave} />Save</Button>
                <button className="btn btn-danger" onClick={() => {
                setEditedCategory(null);
                setEditedQuestionIndexforEditCategory(null);
              }}>
                <FontAwesomeIcon icon={faTimes} className="me-2" />
              </button>
              </div>
            ) : (
              <div className="d-flex align-items-center">
              <h3 className="mb-0 me-2">Category:</h3>
              <p className="mb-0">{question.category}</p>
                <FontAwesomeIcon icon={faEdit}  style={{ cursor: 'pointer' , marginLeft: '10px' }}onClick={() => {
                  setEditedCategory(question.category);
                  setEditedQuestionIndexforEditCategory(qIndex);
                }}/>
              </div>
            )}
            {editedQuestionIndexforEditGrade === qIndex && editedGrade !== null ? (
              <div>
<Form.Control type="number" value={editedGrade} onChange={(e) => setEditedGrade(e.target.value)} style={{ width: '4%' }} />                
<Button variant="primary" onClick={() => handleFinishEditGrade(editedGrade, question)}><FontAwesomeIcon icon={faSave} className="me-2" />Save</Button>
<button className="btn btn-danger" onClick={() => {
                setEditedGrade(null);
                setEditedQuestionIndexforEditGrade(null);
              }}>
                <FontAwesomeIcon icon={faTimes} className="me-2" />
              </button>
                
              </div>
            ) : (
              <div className="d-flex align-items-center">
              <h3 className="mb-0 me-2">Grade:</h3>
              <p className="mb-0">{question.grade}</p>
              <FontAwesomeIcon icon={faEdit}  style={{ cursor: 'pointer' , marginLeft: '10px' }} onClick={() => {
                setEditedGrade(question.grade);
                setEditedQuestionIndexforEditGrade(qIndex);
              }} />
            </div>
            )}
           <Form.Group controlId="formFile">
  <Form.Label>Attachments:</Form.Label>
  <Form.Control type="file" onChange={(e) => handleFileChange(e)} style={{ width: '35%' }}/>
  <Button className="my-2" variant="primary" onClick={() => handleUpload(question._id)}>
    <FontAwesomeIcon icon={faUpload} className="me-2" />
    Upload
  </Button>
  {question.attachment &&
    <Button variant="danger" onClick={() => handleDownload(question.attachment)}>
      <FontAwesomeIcon icon={faDownload} className="me-2" />
      Download
    </Button>
  }
</Form.Group>
          </Card.Body>
        </Card>
      ))}
       <div>
      {/* your component code */}
      <button className="btn btn-success d-flex align-items-center fixed-bottom" style={{width:'40px' ,position: 'fixed',  bottom: 0,right: 0, margin: '20px' , marginLeft:'1450px'} } onClick={() => setDisplayForm(true)} >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
    </div>
  );
};

export default QuestionBank;