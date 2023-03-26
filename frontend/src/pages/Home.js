import { useEffect } from "react"
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import styles from './Home.module.css'// components
import InstructorDetails from "../components/InstructorDetails"
import LoginForm from "../components/LoginForm"
//make style css for this page
const Home = () => {
  

  return (
   
    <div className={styles['home-page']}>
     <div className={styles['form-container']}>
     <LoginForm />
     </div>
      
      
    </div>
  )
}

export default Home