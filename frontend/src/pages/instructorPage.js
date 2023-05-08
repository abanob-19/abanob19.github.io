import { useEffect ,useState} from "react"
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import InstructorNavbar from "../components/instructorNavbar";
 import styles from './Instructor.module.css';
// import LoginForm from "../components/loooogin";
import { useNavigate } from "react-router-dom";


// components
// import LoginForm from "../components/LoginForm"
const InstructorPage = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();
useEffect( () => {
  if (!user)
  {
    navigate('/'); return  ;
  }
  else if (user.role != "instructor")
    { navigate('/StudentPage'); return  ;}
}, []);


  return (
    <div className={styles['instructor-home'] } style={{ paddingTop: '72px' }}>
      { <InstructorNavbar/> }
    </div>
  )
}

export default InstructorPage