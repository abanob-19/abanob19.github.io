import { useEffect,useState } from "react"
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import styles from './Home.module.css'// components
import LoginForm from "../components/LoginForm"
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  useEffect( () => {

 if (user){ if (user.role == "instructor")
  { 
    navigate('/InstructorCourses'); return  ; 
  }
  else if (user.role == "student")
   { navigate('/StudentPage'); return  ;}}
}, []);

  return (
   
    <div >
     <div >
     <LoginForm />
     </div>
      
      
    </div>
  )
}

export default Home