import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Button,Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck , faDownload } from '@fortawesome/free-solid-svg-icons';
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import styles from '../pages/Instructor.module.css';
import InstructorNavbar from '../components/instructorNavbar';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const SampleExam = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseName = searchParams.get('courseName'); 
  const examId = searchParams.get('examId');
  const title=searchParams.get('title')
  const [version, setVersion] = useState(0);    
  const { state, dispatch } = useInstructorsContext()
  const [imageUrl, setImageUrl] = useState({});
  const [choicesUrl, setChoicesUrl] = useState({});

  useEffect(() => {
    if (!user)
    { 
      navigate('/'); return  ; 
    }
    else if (user.role != "instructor")
     { navigate('/StudentPage'); return  ;}
     document.title = "Online Assessment Simulator";
    console.log("Component mounted");
    async function fetchData() {
      const response = await fetch(`/instructor/getQuestionsForExam?courseName=${courseName}&examId=${examId}`);
      const data = await response.json();
      for(var i=0;i<data.length;i++){
        
        if(data[i].attachment&& isImageAttachment(data[i].attachment)){
         handleurls(data[i]._id,data[i].attachment)
        }
      
      }
      for (var i=0;i<data.length;i++){
        if(data[i].type=="mcq"){
        for (var j=0;j<data[i].choices.length;j++){
         
          if(data[i].choiceAttachments&&data[i].choiceAttachments[j]&& isImageAttachment(data[i].choiceAttachments[j])){
            await handleChoiceUrls(data[i]._id,j,data[i].choiceAttachments[j],data[i].choices.length)
            
           }
        }}
        
      }
      setQuestions(data);
    }
    fetchData();
  }, [version,state.secVersion]);
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
  const isImageAttachment = (attachment) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = attachment.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
  };
  const handleChoiceUrls=async function fetchImageUrl(id,index,qattachment,length) {
    const response = await axios.get(
      `/instructor/getImage/?attachment=${qattachment}`
    );
   
  
   
    setChoicesUrl(prevState => {
      const newState = {...prevState};
      if (!newState[id]) {
        newState[id] = new Array(length);
      }
      newState[id][index] = response.data;
      return newState;
    });
    
    
  }

  const handleurls=async function fetchImageUrl(id,qattachment) {
    const response = await axios.get(
      `/instructor/getImage/?attachment=${qattachment}`
    );
   
    setImageUrl(prevState => ({
      ...prevState,
      [id]: response.data,
    }));
    
  }
  if(!questions){
    return  <div className={styles['container']}>
    <div className={styles['loader']}></div>
  </div>
    }

    return (
      <div>
        <InstructorNavbar/>
        <div style={{
  display: 'flex',
  justifyContent: 'center', // center the headings horizontally
  alignItems: 'center', // center the headings vertically
  flexDirection: 'column',
  paddingTop:'72px' // stack the headings vertically
}}>
  <h1 style={{
    fontSize: '3rem', // increase the font size of the h1 element
    fontWeight: 'bold', // make the text bold
    marginBottom: '0.5rem', // add some margin at the bottom
    color: 'white', // set the text color to a dark gray
  }}>{courseName.charAt(0).toUpperCase()+courseName.slice(1)}</h1>
  <h2 style={{
    fontSize: '2.5rem', // increase the font size of the h2 element
    fontWeight: 'bold', // make the text bold
    marginBottom: '0.5rem', // add some margin at the bottom
    color: '#007b55', // set the text color to blue
  }}>{title} Exam</h2>
</div>
<div style={{ display: 'flex', justifyContent: 'center' }}>
  <div style={{ width: '85%' }}>
    {questions.map((question,index) => (
      <Card key={question._id} className="my-4 shadow rounded">
        <Card.Body>
          <Card.Title>{index+1}) {question.text}</Card.Title>
          {question.attachment && (
            <Button variant="primary" onClick={() => handleDownload(question.attachment)}>
              <FontAwesomeIcon icon={faDownload}  />
              Download
            </Button>
          )}
           {question.attachment && isImageAttachment(question.attachment) && (
            <div style={{ width: '200px', height: '200px' }}>
              <Card.Img src={imageUrl[question._id]} alt="Attachment" fluid />
            </div>
          )}
          <Card.Text>Category: {question.category}</Card.Text>
          {question.type === 'mcq' && (
            <ul>
              {question.choices.map((choice, index) => (
                <li key={index}>
                  {choice}
                  {choice === question.answer && <FontAwesomeIcon icon={faCheck} style={{ color: 'green', fontSize: '1.7rem', marginLeft: '0.5rem' }} />}
                  {question.choiceAttachments && question.choiceAttachments[index] && (
                    <div style={{ width: '200px', height: '200px' }}>
                      <Card.Img
                        src={choicesUrl[question._id][index]}
                        alt="Attachment"
                        fluid
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card.Body>
      </Card>
    ))}
  </div>
</div>
      </div>
    );
}

export default SampleExam;
