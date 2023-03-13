const InstructorDetails = ({ instructor }) => {

    return (
      <div className="instructor-details">
        <h4>{instructor.name}</h4>
        <p><strong>username : </strong>{instructor.username}</p>
        <p><strong>password: </strong>{instructor.password}</p>
        <p>{instructor.createdAt}</p>
      </div>
    )
  }
  
  export default InstructorDetails