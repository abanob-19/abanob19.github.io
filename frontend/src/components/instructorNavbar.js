import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import styles from '../pages/Instructor.module.css';
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import { useNavigate } from "react-router-dom";
import CreateExamForm from './CreateExamForm';
function InstructorNavbar() {
  const { state,dispatch } = useInstructorsContext()
  const navigate = useNavigate();
  const [showCreateExamForm, setShowCreateExamForm] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
const handleClick = () => {
    // Handle the click event
    dispatch({type: 'LOG_OUT'})
    console.log( state.userx)
    localStorage.removeItem('user');
    navigate("/");
    
  }
  const handleClick1 = async () => {
    navigate("/instructorCourses"); 
  }
  const handleClick3 = async () => {
    navigate("/GradeExams"); 
  }
  const handleClick2 = async () => {
    navigate("/instrcutorExams"); 
  }

  return (
    <div>
    <Navbar bg="light" expand="lg">
    <Navbar.Brand > GUC Online Assessment</Navbar.Brand>
      <Navbar.Brand > Welcome Instructor  {user ? user.name : ''}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
        <Nav.Link onClick={() => handleClick1()}  className={styles['nav-link-hover']}>Courses</Nav.Link>
          <Nav.Link  className={styles['nav-link-hover']} onClick={() => setShowCreateExamForm(true)}>Create Exam</Nav.Link>
          <Nav.Link onClick={() => handleClick3()}  className={styles['nav-link-hover']}>Grade</Nav.Link>
          <Nav.Link onClick={() => handleClick()} className={styles['nav-link-hover']}>Log Out</Nav.Link>
          
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    {showCreateExamForm && <CreateExamForm onClose={() => setShowCreateExamForm(false)} />}
</div>
    
  );

}

export default InstructorNavbar;
