import { useState } from 'react'
import { useInstructorsContext } from '../hooks/useInstrcutorContext'


const LoginForm = () => {
  const { state,dispatch } = useInstructorsContext()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
//   const [load, setLoad] = useState('')
//   const [reps, setReps] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
if (username.length==0 || password.length==0 )
setError("please fill all the fields")
else{
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
      setError(json.error)
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
      // console.log('found:', state.userx)
    }
}
  }

  return (
    <form className="login" onSubmit={handleSubmit}> 
      <h3>Login</h3>

      <label>username</label>
      <input 
        type="text" 
        onChange={(e) => setUsername(e.target.value)} 
        value={username}
      />
     <label>password</label>
      <input 
        type="text" 
        onChange={(e) => setPassword(e.target.value)} 
        value={password}
      />
      {/* <label>Load (in kg):</label>
      <input 
        type="number" 
        onChange={(e) => setLoad(e.target.value)} 
        value={load}
      />

      <label>Number of Reps:</label>
      <input 
        type="number" 
        onChange={(e) => setReps(e.target.value)} 
        value={reps} 
      /> */}

      <button>Login</button>
      {error && <div className="error">{error}</div>}
      {state.userx && <div className="name">{"welcome " +state.userType+" "+ name}</div>}
    </form>
  )
}

export default LoginForm