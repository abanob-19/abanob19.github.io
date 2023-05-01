import React, { useState, useRef,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import styles from '../pages/Instructor.module.css';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import EditMathField from 'react-mathquill'
import  MathQuill  from 'react-mathquill';
import VirtualKeyboard from 'react-virtual-keyboard';
const StudentExam = () => {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [buttonText, setButtonText] = useState('Submit');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseName = searchParams.get('courseName'); 
  const examId = searchParams.get('examId');
  const duration = searchParams.get('duration'); 
    const title = searchParams.get('title');
    const endTime = searchParams.get('endTime');
  const [version, setVersion] = useState(0);    
  const { state, dispatch } = useInstructorsContext()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [submitted, setSubmitted] = useState(false);
  const[isSubmitting,setIsSubmitting]=useState(false);
  const[editedAnswer,setEditedAnswer]=useState('');
  const[equation,setEquation]=useState(''); 
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [started, setStarted] = useState(false);
  const [file, setFile] = useState(null);
  useEffect(() => {
    const interval = setInterval(() => {
      if (started){
      captureScreenshot();}
    }, 15000); // take screenshot every 15 seconds

    return () => clearInterval(interval);
  }, [started]);
  const captureScreenshot = async () => {
    const canvas = canvasRef.current;
    const webcam = webcamRef.current;
  
    console.log(webcam);
    console.log(webcamRef.current.videoWidth);
    // console.log(webcam.video.readyState);
  
    if (webcam) {
      const videoSettings = webcam.videoWidth && webcam.videoHeight
        ? { videoWidth: webcam.videoWidth, videoHeight: webcam.videoHeight }
        : {};
  
      console.log("Webcam is defined");
      console.log("Canvas dimensions:", canvas.width, canvas.height);
      console.log("Video dimensions:", videoSettings.videoWidth, videoSettings.videoHeight);
  
      canvas.width = videoSettings.videoWidth;
      canvas.height = videoSettings.videoHeight;
  
      setTimeout( async () => {
        canvas.getContext('2d').drawImage(
          webcam,
          0,
          0,
          videoSettings.videoWidth,
          videoSettings.videoHeight
        );
        const dataURL = canvas.toDataURL('image/jpeg', 0.5);
      
        try {
          
            
          
          const response = await fetch('/student/saveScreenshot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ screenshot: dataURL ,
            courseName:courseName,
            examId:examId,
            studentId:user._id
             })
          });
          const result = await response.json();
          console.log(result);
        } catch (error) {
          console.error('Failed to save screenshot', error);
        }
      }, 500); // add a 500ms delay before taking the screenshot
    } else {
      console.log("Webcam is not yet defined");
    }
  };
  const startExam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      webcamRef.current.srcObject = stream;
      webcamRef.current.play();
      console.log("Webcam is now defined");
      setEnabled(true);
    } catch (error) {
      console.error('Failed to access webcam', error);
    }
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
    console.log(file);
  };

  const handleUpload =  (q) => {
    if(file){
    const formData = new FormData();
    console.log(file);
    formData.append('attachment', file);
    formData.append('questionId', q);
    formData.append('examId', examId);
    formData.append('courseName', courseName);
    formData.append('studentId', user._id);
    
    fetch(`/student/uploadFile`, {
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
  const stopCamera = () => {
    const stream = webcamRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      webcamRef.current.srcObject = null;
    }
  };
  function handleChange(mathField) {
    setEquation(mathField.latex())
  }
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/student/getQuestionsForExam?courseName=${courseName}&examId=${examId}&Id=${user._id}`);
      const data = await response.json()
      const q=data.Questions;
      setQuestions(q);
      
    setSubmitted(data.submitted);
    
      var i=0;
      for (i=0;i<data.answers.length;i++){
        answers[data.Questions[i]._id]=data.answers[i];
        }
      setAnswers(answers);
      console.log(answers);
     
    }
    fetchData();
    
  }, [version,state.secVersion]);

  const handleAnswerChange = (questionId, choiceIndex) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: choiceIndex
    }));
  };

  const handleSubmit = async() => {
    // You can save the answers to the server here
    setButtonText('Submitting...');
    setIsSubmitting(true);
    const response= await fetch(`/student/submitExam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseName,
          examId,
          Id: user._id,
          answers: answers,
          sumbitted:true
        })
      })
      .then(response => {
        console.log(response);
        setSubmitted(true);
        setIsSubmitting(false);
        setButtonText('Submitted');
        stopCamera();
        setEnabled(false);
        setStarted(false);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
    console.log(answers);
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
  const handleClickStart = () => {
    setStarted(true);
  };
  if (!questions) {
    return (
      <div className={styles['container']}>
        <div className={styles['loader']}></div>
      </div>
    );
  }
  if (submitted)      { 
  return (
    <div>
    <h1>{courseName}</h1>
        <h2>{title}</h2>
  <Button as={Link} to={`/StudentPage/`} variant="success">submitted, return to home page</Button>
  
 
  </div>
  )
}

return (
  <div className="container">
    <canvas ref={canvasRef} style={{ display: 'none' }} />
    <video ref={webcamRef} className={`${started ? styles.invisible : "w-100"}`} />
    {!enabled && (
      <div className="alert alert-warning">
        You have to enable your webcam to take the exam
        <button className="btn btn-primary ml-3" onClick={startExam}>Enable WebCam</button>
      </div>
    )}
    {!started && enabled && (
      <div className="alert alert-success">
        You can start the exam now
        <button className="btn btn-primary ml-3" onClick={handleClickStart}>Start</button>
      </div>
    )}
    {started && (
      <div>
        <h1 className="mt-5">{courseName}</h1>
        <h2>{title}</h2>
        <h2> {started}</h2>
        <h3>Duration: {duration} hours</h3>
        <h3>Remaining time: {(new Date(endTime)-new Date())/3600000}</h3>

        {questions.map((question, index) => (
          <div key={question._id}>
            <h2 className="mt-5">({index + 1}) {question.text} ({question.grade} grades)</h2>
            {question.attachment && (
              <button className="btn btn-primary" onClick={() => handleDownload(question.attachment)}>Download Attachments</button>
            )}
            <input type="file" onChange={handleFileChange} />
            <button className="btn btn-primary ml-3" onClick={() => handleUpload(question._id)}>Upload your answers</button>
            {question.type === 'mcq' && (
              <ul className="list-unstyled mt-3">
                {question.choices.map((choice, choiceIndex) => (
                  <li key={choiceIndex}>
                    <label>
                      <input type="radio" name={`question${index}`} value={choice} checked={answers[question._id] === choiceIndex} onChange={() => handleAnswerChange(question._id, choiceIndex)} />
                      <span className="mr-2">{String.fromCharCode(97 + choiceIndex)})</span>
                      {choice}
                    </label>
                  </li>
                ))}
              </ul>
            )}
            {question.type === 'text' && (
              <div className="mt-3">
                <input
                  className="form-control"
                  type="text"
                  value={answers[question._id]}
                  onChange={(e) => {
                    setEditedAnswer(e.target.value);
                    setAnswers(prevAnswers => ({
                      ...prevAnswers,
                      [question._id]: e.target.value
                    }));
                  }}
                />
                <div className="mt-3">
                  <MathQuill
                    latex={equation}
                    onChange={handleChange}
                    config={{ autoCommands: 'pi theta sqrt sum' }}
                  />
                  <textarea
                    className="form-control mt-2"
                    value={equation}
                    onChange={(e) => setEquation(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {!submitted && !isSubmitting && (
          <button className="btn btn-primary mt-3" onClick={handleSubmit}>{buttonText}</button>
        )}
        {isSubmitting && <p className="mt-3">Submitting...</p>}
      </div>
    )}
  </div>
);

  
};

export default StudentExam;
