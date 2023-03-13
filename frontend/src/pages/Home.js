import { useEffect, useState } from "react"

// components
import InstructorDetails from "../components/InstructorDetails"
import LoginForm from "../components/LoginForm"
const Home = () => {
  const [instructors, setInstructor] = useState(null)

  useEffect(() => {
    const fetchInstructors = async () => {
      const response = await fetch('/instructor/')
      const json = await response.json()

      if (response.ok) {
        setInstructor(json)
      }
    }

    fetchInstructors()
  }, [])

  return (
    <div className="home">
      <div className="instructors">
        {instructors && instructors.map(instructor => (
          <InstructorDetails instructor={instructor} key={instructor._id} />
        ))}
      </div>
      <LoginForm />
    </div>
  )
}

export default Home