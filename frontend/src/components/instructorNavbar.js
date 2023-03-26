import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import styles from '../pages/Instructor.module.css';
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import { useNavigate } from "react-router-dom";
function InstructorNavbar() {
  const { state,dispatch } = useInstructorsContext()
  const navigate = useNavigate();
  const handleClick = () => {
    // Handle the click event
    dispatch({type: 'LOG_OUT'})
    console.log( state.userx)
    navigate("/");
    
  }
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand >{state.userx.name}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="#link1" className={styles['nav-link-hover']}>Courses</Nav.Link>
          <Nav.Link href="#link2" className={styles['nav-link-hover']}>Create Exam</Nav.Link>
          <Nav.Link onClick={() => handleClick()} className={styles['nav-link-hover']}>Log Out</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );

}

export default InstructorNavbar;
