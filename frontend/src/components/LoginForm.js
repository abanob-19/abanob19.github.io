import { useState } from 'react'
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from 'react-bootstrap';
import styles from '../pages/Instructor.module.css'
const LoginForm = () => {
  const { state,dispatch } = useInstructorsContext()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate();//   const [load, setLoad] = useState('')
//   const [reps, setReps] = useState('')
  const [error, setError] = useState(null)
   const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
if (username.length==0 || password.length==0 )
setError("please fill all the fields")
else{
  setLoading(true)
    const user = {username,password}
    
    const response = await fetch('/instructor/getInstructor', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()

    if (!response.ok) {
      const response = await fetch('/student/getStudent', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const json = await response.json()
      if (!response.ok) 
     { setError(json.error)
    setLoading(false)}
      if (response.ok) {
        setError(null)
        setUsername('')
        setPassword('')
        
        console.log("welcome")
      //   setLoad('')
      //   setReps('')
        
        dispatch({type: 'GET_USER', payload: json})
        if(state.userx)
        setName(state.userx.name)
        localStorage.setItem('user', JSON.stringify(json));
        setLoading(false)
        navigate("/StudentPage");   
      }
    }
    if (response.ok) {
      setError(null)
      setUsername('')
      setPassword('')
      setName(json.name)
      console.log("welcome")
      
    //   setLoad('')
    //   setReps('')
    dispatch({type: 'GET_USER', payload: json})
    if(state.userx)
        setName(state.userx.name)
        localStorage.setItem('user', JSON.stringify(json));
        setLoading(false)
        navigate("/InstructorCourses");    
      // console.log('found:', state.userx)
    }
}
  }
if(loading){
  return  <div className={styles['container']}>
  <div className={styles['loader']}></div>
</div>
}
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Form className="login mx-auto" onSubmit={handleSubmit}>
        <h3>Login</h3>
        <Form.Group controlId="formBasicEmail">
          <Form.Label >Username</Form.Label>
          <Form.Control type="text"  onChange={(e) => setUsername(e.target.value)} value={username} className="w-100"  />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label className="mr-2">Password</Form.Label>
          <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} value={password} className="w-100" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
        {error && (
  <div style={{  color: "#ff0000", padding: "10px", borderRadius: "5px", marginTop: "10px" }}>
    <p style={{ margin: "0" }}>{error}</p>
  </div>
)}

      </Form>
    </div>
  );
}

export default LoginForm