import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExamCard from '../components/ExamCard';
import { useParams } from "react-router-dom";
 import InstructorNavbar from '../components/instructorNavbar';
 import { useInstructorsContext } from '../hooks/useInstrcutorContext'
 import styles from './Instructor.module.css';



function CourseExams() {
  const [exams, setExams] = useState(null);
  const { courseName } = useParams();
  const[version,setVersion]=useState(0)
  const[editingId,setEditingId]=useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const { state,dispatch } = useInstructorsContext()
  const onEditExam=(examID)=>{
setEditingId(examID)
  }
  const onFinishEditExam=(examID)=>{
    setEditingId(null)
    setVersion(version+1)
    console.log("executed finish edit")
  }
  const onDeleteExam = async (exam) => {
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
      {exams.map(exam => (
        
        ((!editingId)||(editingId==exam._id))&& <ExamCard key={exam._id} exam={exam} onDelete={() => onDeleteExam(exam)} onEdit={()=>onEditExam(exam._id) } onFinishEditExam={()=>onFinishEditExam(exam._id) }/>
        
      ))}
    </div>
  );
}


export default CourseExams;
