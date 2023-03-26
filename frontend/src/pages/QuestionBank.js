import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react"

const QuestionBank = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const questionBankName = searchParams.get('questionBankName'); 
    const name = searchParams.get('name');
    const [questionBank, setQuestionBank] = useState(null);
  
    useEffect(() => {
      if (!questionBankName) return; // add a check for undefined
  
      const url = `/instructor/openQuestionBank?questionBankName=${questionBankName}&name=${name}`;
      const fetchData = async () => {
        const response = await fetch(url);
        const json = await response.json();
        setQuestionBank(json);
        console.log(json);
      };
      fetchData();
    }, [questionBankName, name]);
  
    if (!questionBank) {
      return <div>Loading...</div>
    }
  
    return (
      <div>
        <h1>{questionBankName}</h1>
        <p>{name}</p>
        {/* Rest of the QuestionBank page */}
      </div>
    );
  }
  

export default QuestionBank;
