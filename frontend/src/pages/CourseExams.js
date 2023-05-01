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
  const [exams, setExams] = useState(null);
  const { courseName } = useParams();
  const[version,setVersion]=useState(0)
  const[editingId,setEditingId]=useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const { state,dispatch } = useInstructorsContext()
  const[examType,setExamType]=useState('')
  const onEditExam=(examID)=>{
setEditingId(examID)
  }
  function handleSample  (examId)  {
    console.log("executed sample");
    // onSampleClick();
  navigate(`/SampleExam/?courseName=${courseName}&examId=${examId}`)
   console.log(`/SampleExam/?courseName=${courseName}&examId=${examId}`)

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

  useEffect( () => {
    setIsLoading(true);
    axios.get(`/instructor/seeExams/${courseName}`)
      .then(response => {
        setExams(response.data);
        console.log("executed get")
       // console.log(state.secVersion)

      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [version, state.secVersion]);
if(!exams|| isLoading){
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
      {exams.map(exam => (
        
        ((editingId==exam._id)|| (!editingId && ((exam.type===examType)||(examType==""))))&& <ExamCard key={exam._id} exam={exam} onDelete={() => onDeleteExam(exam)} onEdit={()=>onEditExam(exam._id) } onFinishEditExam={()=>onFinishEditExam(exam._id) } onSampleClick={()=>handleSample(exam._id)} />
        
      ))}
      </Container>
    </div>
  );
}


export default CourseExams;
