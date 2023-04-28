import { useEffect } from "react"
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import styles from './Home.module.css'// components
import LoginForm from "../components/LoginForm"


const Home = () => {
  

  return (
   
    <div >
     <div >
     <LoginForm />
     </div>
      
      
    </div>
  )
}

export default Home