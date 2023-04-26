import { useEffect } from "react"
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import InstructorNavbar from "../components/instructorNavbar";
 import styles from './Instructor.module.css';
// import LoginForm from "../components/loooogin";


// components
// import LoginForm from "../components/LoginForm"
const InstructorPage = () => {
  

  return (
    <div className={styles['instructor-home'] } style={{ paddingTop: '72px' }}>
      { <InstructorNavbar/> }
    </div>
  )
}

export default InstructorPage