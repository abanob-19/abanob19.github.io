import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages & components
import Home from './pages/Home'
//import InstructorCourses from './pages/InstructorCourses'
import InstructorCourses from './pages/InstructorCourses'
import QuestionBank from './pages/QuestionBank'
import Course from './pages/Course'
import InstructorPage from './pages/instructorPage'


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        
        <div className="pages">
          <Routes>
            <Route 
              path="/" 
              element={<Home />} 
            />
            <Route 
              path="/instructorPage" 
              element={<InstructorPage />} 
            />
            <Route 
              path="/instructorCourses" 
              element={<InstructorCourses />} 
            />
            <Route 
              path="/Course/:courseName" 
              element={<Course />} 
            />
            <Route 
              path="/QuestionBank/" 
              element={<QuestionBank />} 
            />
            
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;