import { useEffect,useState } from "react"
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import styles from './Home.module.css'// components
import LoginForm from "../components/LoginForm"
import { useNavigate } from "react-router-dom";
import logo from '../pages/images/logo.png'; 
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
   document.title = "Online Assessment Simulator";
}, []);

  return (
   
    <div style={{ 
      backgroundColor: '#F5F5F5', 
      padding: '10px 20px', 
      margin: '40px auto', 
      border: '1px solid #E0E0E0', 
      boxShadow: '10px 10px 10px 10px rgba(10,10,10,10.1)', 
      borderRadius: '10px', 
      width: '30%', 
      height: '500px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <img 
        src={logo}
        alt="Logo" 
        style={{ 
          width: '150px',
          height: '200px',
          marginBottom: '20px'
        }} 
      />
      <LoginForm 
        style={{ 
          fontFamily: 'Arial', 
          fontSize: '14px', 
          color: '#333333', 
          padding: '10px' 
        }} 
      />
    </div>
    
  


  )
}

export default Home