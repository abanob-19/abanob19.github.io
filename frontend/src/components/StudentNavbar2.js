import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import styles from '../pages/Instructor.module.css';
import { useInstructorsContext } from '../hooks/useInstrcutorContext'
import { useNavigate } from "react-router-dom";
import logo from '../pages/images/logo.png'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons'


import { faHome } from '@fortawesome/free-solid-svg-icons'
function StudentNavbar2() {
  const { state,dispatch } = useInstructorsContext()
  const navigate = useNavigate();
  const [showCreateExamForm, setShowCreateExamForm] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const handleClick = () => {
    dispatch({type: 'LOG_OUT'})
    console.log(state.userx)
    localStorage.setItem('user',null);
    navigate("/");
  }
  const handleClick1 = async () => {
    navigate("/StudentPage"); 
  }

  return (
    <Navbar bg="dark" variant='dark' expand="lg" className="fixed-top">
  <div className="container-fluid d-flex justify-content-between align-items-center">
    <div className="d-flex align-items-center">
      <img src={logo} alt="Logo" width="100" height="50" />
      <Nav>
       
        
      </Nav>
    </div>
    <div>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
        
        </Nav>
        <Navbar.Text>
                  {user && (
                    <span className="text-light">{user.name}</span>
                  )}
                </Navbar.Text>
      </Navbar.Collapse>
    </div>
  </div>
</Navbar>

  );
}

export default StudentNavbar2;
