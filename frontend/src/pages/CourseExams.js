import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExamCard from '../components/ExamCard';
import { useParams } from "react-router-dom";
 import InstructorNavbar from '../components/instructorNavbar';
 import { useInstructorsContext } from '../hooks/useInstrcutorContext'
 import styles from './Instructor.module.css';
 import { useNavigate } from "react-router-dom";
 import { useInRouterContext, Navigate } from 'react-router-dom'
import { Container } from 'react-bootstrap';
function CourseExams() {
 // const { navigate } = useInRouterContext();
 const navigate = useNavigate();
 const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [exams, setExams] = useState(null);
  const { courseName } = useParams();
  const[version,setVersion]=useState(0)
  const[editingId,setEditingId]=useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const { state,dispatch } = useInstructorsContext()
  const[examType,setExamType]=useState('')
  const [questionBanks, setQuestionBanks] = useState(null);
  const [warningIndex, setWarningIndex] = useState(null);
  const onEditExam=(examID)=>{
setEditingId(examID)
  }
  function handleSample  (examId,title)  {
    console.log("executed sample");
  navigate(`/SampleExam/?courseName=${courseName}&examId=${examId}&title=${title}`)
   console.log(`/SampleExam/?courseName=${courseName}&examId=${examId}`)

  }
  const handleWrningClick = (index) => {
    setWarningIndex(index);
  }
  const onFinishEditExam=(examID)=>{
    setEditingId(null)
    setVersion(version+1)
    console.log("executed finish edit")
  }
  const onDeleteExam = async (exam) => {
    const confirmed=window.confirm("Are you sure you want to delete this exam?")
    if(confirmed){
    setIsLoading(true);
   await axios.delete(`/instructor/deleteExam`,{ data: { courseName:courseName , id: exam._id } })
      .then(response => {
        setExams(prevExams => prevExams.filter(exam => exam._id !== exam._id));
        alert("Exam deleted successfully");
        console.log("executed delete")
        setVersion(version+1) 
      })
      .catch(error => {
        console.error(error);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }
const[x,setX]=useState(0)
  useEffect( () => {
    if (!user)
    { 
      navigate('/'); return  ; 
    }
    else if (user.role != "instructor")
     { navigate('/StudentPage'); return  ;}
     document.title = "Online Assessment Simulator";
    setIsLoading(true);
    axios.get(`/instructor/seeExams/${courseName}`)
      .then(async response => {
        setExams(response.data);
        setX(x=>x+1)
        console.log("executed get")
       // console.log(state.secVersion)

      })
      .catch(error => {
        console.error(error);
        alert("Error fetching data");
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [version, state.secVersion]);
  useEffect(() => {
    // Fetch question banks from server and update state
   
    if (!user)
    { 
      navigate('/'); return  ; 
    }
    else if (user.role != "instructor")
     { navigate('/StudentPage'); return  ;}
     document.title = "Online Assessment Simulator";
    const fetchData = async () => { 
      setIsLoading(true)
        await fetch(`/instructor/seeCourse/${courseName}`)
      .then(async response => await response.json())
      .then(data => {
        //loop over the data and get the question banks titles in an array
        var questionBanks2=[]
        for(let i=0;i<data.length;i++){
          let questionBank=data[i]
          questionBanks2.push(questionBank.title)
        }
        setQuestionBanks(questionBanks2)})
      .catch(error => console.error(error));}
      console.log(x)
      if(x>0){
      fetchData();
      console.log(questionBanks);
      setIsLoading(false)}
     
  }, [x]);
if(!exams|| isLoading||!questionBanks){
  return  <div className={styles['container']}>
  <div className={styles['loader']}></div>
</div>
}

  return (
    <div>
      <InstructorNavbar/>
      <label style={{paddingTop:'70px'}}>Exam Type:
             <select
            className={styles['form-control']}
           value={examType}
            onChange={(event) => setExamType(event.target.value)}
>
<option value="">select option</option>
<option value="Quiz">Quiz</option>
  <option value="Final">Final</option>
  <option value="MidTerm">MidTerm</option>
  <option value="Assignment">Assignment</option>
 
</select>
</label>
      <Container fluid className="d-flex flex-wrap justify-content-center" >
       
      {exams.map((exam,index) => (
        
        ((editingId==exam._id)|| (!editingId && ((exam.type===examType)||(examType==""))))&& <ExamCard key={exam._id} exam={exam} onDelete={() => onDeleteExam(exam)} onEdit={()=>onEditExam(exam._id) } onFinishEditExam={()=>onFinishEditExam(exam._id) } onSampleClick={()=>handleSample(exam._id,exam.title)}  yourIndex={index} questionBanks2={questionBanks} />
        
        
      ))}
      
      </Container>
    </div>
  );
}


export default CourseExams;
