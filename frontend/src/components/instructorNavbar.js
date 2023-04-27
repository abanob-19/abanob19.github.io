import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faUser , faEdit, faPencilAlt,faPlus,faFileAlt} from '@fortawesome/free-solid-svg-icons';
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';
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
  const [loading, setLoading] = useState(false);
const handleClick = () => {
    // Handle the click event
    setLoading(true);
    dispatch({type: 'LOG_OUT'})
    console.log( state.userx)
    localStorage.removeItem('user');
    setLoading(false);
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
if (loading){
  return  <div className={styles['container']}>
  <div className={styles['loader']}></div>
</div>
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
              <NavDropdown.Item onClick={() => handleClick3()}>
               <FontAwesomeIcon icon={faFileAlt} className={styles['nav-link-hover']} /> Create Exam
               </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleClick3()}>
               <FontAwesomeIcon icon={faCheckSquare} className={styles['nav-link-hover']} /> Grade
               </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleClick()}>
  <FontAwesomeIcon icon={faSignOutAlt} className={styles['nav-link-hover']} /> Logout
</NavDropdown.Item>
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
