import { useState } from 'react'

const LoginForm = () => {
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
      const response1 = await fetch('/student/getStudent', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const json1 = await response1.json()
      if (!response1.ok) 
      setError(json1.error)
      if (response1.ok) {
        setError(null)
        setUsername('')
        setPassword('')
        setName(json1.name)
        console.log("welcome")
      //   setLoad('')
      //   setReps('')
        console.log('found:', json1)
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
      console.log('found:', json)
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
      {name && <div className="name">{"welcome " + name}</div>}
    </form>
  )
}

export default LoginForm