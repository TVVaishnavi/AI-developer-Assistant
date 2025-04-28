import React, {useState} from 'react'
import { Routes, Route } from 'react-router-dom';
import Result from '../pages/Response';
import Home from '../component/Home';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import Header from '../component/Header';

function Approutes() {
  const [userEmail, setUserEmail] = useState("");
  return (
    
    <Routes>
      <Route path="/" element={<Home setUserEmail={setUserEmail} />} /> 
      <Route path="/result" element={<Result />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>

  )
}

export default Approutes
