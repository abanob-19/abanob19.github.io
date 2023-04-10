import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages & components
import Home from './pages/Home'
//import InstructorCourses from './pages/InstructorCourses'
import InstructorCourses from './pages/InstructorCourses'
import QuestionBank from './pages/QuestionBank'
import Course from './pages/Course'
import InstructorPage from './pages/instructorPage'
import CourseExams from './pages/CourseExams'
import SampleExam from './pages/SampleExam'
import StudentPage from './pages/studentPage'
import StudentCourseExams from './pages/StudentCourseExams'
import StudentExam from './pages/StudentExam'
import GradeExams from './pages/GradeExams'
import GradingPage from './pages/GradingPage'

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
              path="/StudentPage" 
              element={<StudentPage />} 
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
            <Route 
              path="/SampleExam/" 
              element={<SampleExam />} 
            />
            <Route 
              path="/GradeExams" 
              element={<GradeExams />} 
            />
             <Route 
              path="/GradingPage" 
              element={<GradingPage />} 
            />
            <Route 
              path="/StudentExam/" 
              element={<StudentExam />} 
            />
            <Route 
              path="/CourseExams/:courseName" 
              element={<CourseExams />} 
            />
            <Route 
              path="/StudentCourseExams/:courseName" 
              element={<StudentCourseExams />} 
            />
          
            
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;