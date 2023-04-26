import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styles from '../pages/Instructor.module.css';
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import { useNavigate } from "react-router-dom";
import CreateExamForm from './CreateExamForm';
import logo from '../pages/images/logo.png';
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
      <Navbar bg="dark" variant='dark' expand="lg" className="fixed-top">
        <div className="container-fluid">
          <img src={logo} alt="Logo" width="100" height="50" /> 
          
          <Navbar.Brand >   {user ? user.name : ''}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link onClick={() => handleClick1()} className={styles['nav-link-hover']}><FontAwesomeIcon icon={faHome} /></Nav.Link>
              <NavDropdown title={<FontAwesomeIcon icon={faUser} />} alignRight>
                <NavDropdown.Item onClick={() => setShowCreateExamForm(true)}>Create Exam</NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleClick3()}>Grade</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleClick()} >Log Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
      {showCreateExamForm && <CreateExamForm onClose={() => setShowCreateExamForm(false)} />}
    </div>
  );
  

}

export default InstructorNavbar;
