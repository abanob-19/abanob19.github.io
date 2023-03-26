import { useEffect } from "react"
import { useInstructorsContext } from '../hooks/useInstrcutorContext'

// components
import LoginForm from "../components/LoginForm"
const Home = () => {
  

  return (
    <div className="home">
      <LoginForm />
    </div>
  )
}

export default Home