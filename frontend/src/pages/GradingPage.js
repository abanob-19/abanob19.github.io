import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { Card, ListGroup , Button, Container, Row, Col  } from 'react-bootstrap';
import styles from '../pages/Instructor.module.css';
import InstructorNavbar from "../components/instructorNavbar";
import { useNavigate } from "react-router-dom";
const GradingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const location = useLocation();
  const [questions, setQuestions] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const courseName = searchParams.get('courseName'); 
  const examId = searchParams.get('examId');
  const title = searchParams.get('title');
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [students, setStudents] = useState(null);
  const[index, setIndex] = useState(0);
const [answers, setAnswers] = useState(null);
const [version, setVersion] = useState(0);
const [loading, setLoading] = useState(true);
const [selectedOption, setSelectedOption] = useState([]);
const [allGraded, setAllGraded] = useState(false);
const [subVersion, setSubVersion] = useState(0);
const [allStudentsGraded, setAllStudentsGraded] = useState(false);
const [imageUrl, setImageUrl] = useState({});
const[drawings, setDrawings] = useState([]);
  useEffect(() => {
    // Fetch questions from backend API
    if (!user)
    { 
      navigate('/'); return  ; 
    }
    else if (user.role != "instructor")
     { navigate('/StudentPage'); return  ;}
    const fetchQuestions = async () => {
        // if(currentStudentId && students[0] && currentStudentId._id.equals(students[0]))
      try {
        if (currentStudentId) {
            setLoading(true);
          const response = await axios.get(`/instructor/getExamTextQuestions/?studentId=${currentStudentId}&courseName=${courseName}&examId=${examId}`);
          for(var i=0;i<response.data.questions.length;i++){
        
            if(response.data.questions[i].studentAttachment&& isImageAttachment(response.data.questions[i].studentAttachment)){
             handleurls(response.data.questions[i]._id,response.data.questions[i].studentAttachment)
            }
          
          }
          setLoading(false);
          setQuestions(response.data.questions);
          setAnswers(response.data.answers);
          setDrawings(response.data.drawings);
       //   allGraded(response.data.questions);
          setSelectedOption(new Array(response.data.questions.length).fill(null))
          // Assuming response.data contains the fetched data
          console.log(response.data);
          
        }
        else {
            setAllStudentsGraded(true);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    }
 // loop over the questions to see if all of them are graded
    const allGraded = async (questions) => {
        var graded=true
        for (let i = 0; i < questions.length; i++) {
            if(!questions[i].graded)
            {
                graded=false
                break;
            }}
        setAllGraded(graded);}
    fetchQuestions();
    
  }, [currentStudentId , subVersion]);
  
  useEffect(() => {
    if (!user)
    { 
      navigate('/'); return  ; 
    }
    else if (user.role != "instructor")
     { navigate('/StudentPage'); return  ;}
    // Fetch questions from backend API
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`/instructor/getStudentsForExam/?courseName=${courseName}&examId=${examId}`);
        setStudents(response.data); 
        console.log(response.data);
        if (response.data.length>0){
        setCurrentStudentId(response.data[0]);
       setLoading(true); 
       setAllStudentsGraded(false); 
    }
    else{
        setCurrentStudentId(null);
        setLoading(false);
    }
    setSubVersion(subVersion+1);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    }
  
    fetchStudents();
  }, [version]);
  const isImageAttachment = (attachment) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = attachment.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
  };
  const handleurls=async function fetchImageUrl(id,qattachment) {
    const response = await axios.get(
      `/instructor/getImage/?attachment=${qattachment}`
    );
   
    setImageUrl(prevState => ({
      ...prevState,
      [id]: response.data,
    }));
    
  }
  const handleNextStudent = () => {
    // Update current student ID
    console.log(index);
    setLoading(true);
    if(index<students.length-1){
    setCurrentStudentId(students[index+1]);
    setIndex(index+1);}
    setLoading(false);
    setAllGraded(false);
    // Fetch questions for next student
    // (similar to the useEffect hook in step 1)
  };
  const handleDownload = async (attachment) => {
    try {
      const response = await axios.get(`/student/downloadFile/?attachment=${attachment}`, {
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
const handleOptionSelect = (index,option) => {
   // update selectedOption array to reflect the selected grade of given index 
      console.log(index,option);
        const newSelectedOption = [...selectedOption];
        newSelectedOption[index] = option ;
        console.log(newSelectedOption);
        setSelectedOption(newSelectedOption);
        
    
}
const handleSubmitAnswers = async(questionId , index) => {
    // Collect answers from UI (e.g., selected radio buttons)
   if(!selectedOption[index]){
         alert("please select an option")
            return;
        }

console.log(questionId, index , selectedOption[index]);
setLoading(true);
// post to backend using body {questionId selectedOption[index] , studentId , examId , courseName} 
await axios.post('/instructor/submitAnswers', {questionId:questionId, grade: selectedOption[index] , studentId: currentStudentId , examId:examId , courseName:courseName})
.then((response) => {
    console.log(response);
    if (response.status === 200) {
        alert("graded successfully");
        setVersion(version+1);
    }
    else{
        alert("error");
    }
})
.catch((error) => {
    console.log(error);
    alert("error");
});
setLoading(false);

    // Send answers to backend API for grading
    // Update UI with graded results
  };

  // Render questions UI
  // ...
  if (loading) {
    return (
        <div className={styles['container']}>
          <div className={styles['loader']}></div>
        </div>
      );
  }
  if (allStudentsGraded) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <InstructorNavbar />
        <div className="text-center">
          <h1>{title}</h1>
          <h1>All Students Graded</h1>
        </div>
      </Container>
    );
  }
  return (
    <div>
      <InstructorNavbar />
      <Container className="mt-5" style={{paddingTop:'72px'}}>
      <h1 style={{textAlign: 'center'}}>{title}</h1>
      <h1 style={{textAlign: 'center'}}>Exam Questions</h1>

        {questions.map((question, index) => (
          <div key={index} className="my-5">
            {question.studentAttachment && (
              <Button variant="primary" onClick={() => handleDownload(question.studentAttachment)}>
                Download Attachments
              </Button>
            )}
            <Question question={question} answer={answers[index]}  onChoose={(option) => handleOptionSelect(index, option)} />
            {question.studentAttachment && isImageAttachment(question.studentAttachment) && (
              <div className="mt-3">
                <label>Attachment:</label>
                <img src={imageUrl[question._id]} alt="Attachment" style={{ width: '50%', maxWidth: '300px' }}  />
              </div>
            )}
            <label>Student Drawings:</label>
            {question.drawing && (
              
              <div className="mt-3">
                
                <img style={{backgroundColor:'white'}} src={drawings[index]} alt="Student Drawing"  />
              </div>
            )}
            {!question.graded && selectedOption[index] && (
              <Button variant="success" onClick={() => handleSubmitAnswers(question._id, index)} className="mt-3">
                Submit
              </Button>
            )}
            {question.graded && <p>graded</p>}
          </div>
        ))}
      </Container>
    </div>
  );

};
const Question = ({ question, answer,onChoose }) => {
    const [selectedOption, setSelectedOption] = useState(null); // State variable for selected option
  
    const options = Array.from({ length: parseInt(question.grade) + 1 }, (_, index) => index);
  
    const handleOptionSelect = (option) => {
        console.log(option);
       setSelectedOption(option); // Update the state with the selected option
       onChoose(option)
      
    };
  
    return (
      <Card>
        <Card.Body>
          <Card.Title>Question: {question.text}</Card.Title>
          <Card.Text>Answer: {answer}</Card.Text>
          <Card.Text>Choose Grade:</Card.Text>
          {!question.graded && (
            <ListGroup>
              {options.map((option, index) => (
                <AnswerOption key={index} option={option} onSelect={handleOptionSelect} selectedOption={selectedOption} />
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    );
  };
  
  
  const AnswerOption = ({ option, onSelect , selectedOption }) => {
    const handleSelect = (event) => {
        console.log(event.target.value);
      onSelect(event.target.value); // Pass the selected option to the callback function
      
    };
  
    return (
      <ListGroup.Item>
        <div className="custom-control custom-radio">
          <input
            type="radio"
            id={option}
            name={option}
            value={option}
            className="custom-control-input"
            onChange={handleSelect}
            checked={option==parseInt(selectedOption)} 
          />
          <label className="custom-control-label" htmlFor={option}>
            {option}
          </label>
        </div>
      </ListGroup.Item>
    );
  };
  
export default GradingPage;
