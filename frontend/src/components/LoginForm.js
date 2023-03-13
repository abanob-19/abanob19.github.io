import { useState } from 'react'

const LoginForm = () => {
  const [username, setUsername] = useState('')
//   const [load, setLoad] = useState('')
//   const [reps, setReps] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
if (username.length==0)
setError("please fill all the fields")
else{
    const instructor = {username}
    
    const response = await fetch('/instructor/getInstructor', {
      method: 'POST',
      body: JSON.stringify(instructor),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      setError(null)
      setUsername('')
    //   setLoad('')
    //   setReps('')
      console.log('done:', json)
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
    </form>
  )
}

export default LoginForm