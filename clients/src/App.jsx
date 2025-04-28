import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from './component/Header';
import Approutes from './routes/Approutes';

function App() {
  const [userEmail, setUserEmail] = useState("");
  return (
    <div className='max-w-screen bg-transparent'>
      <Header userEmail={userEmail} />
      <div style={{height:"90%",backgroundcolor: "#242424"}}>
        <Approutes/>
      </div>
    </div>
    
  );
}


export default App;
