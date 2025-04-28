import React, { useState } from 'react';
import custom from '../hook/custom';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [useremail, setUseremail] = useState('');
  const navigate = useNavigate();
  const [emailIndicator, setEmailIndicator] = useState(true);
  const [indicator, setIndicator] = useState(false);
  const [secpass, setSecpass] = useState('');
  const [conpass, setConpass] = useState('');
  const { signup } = custom();

  const submit = async () => {
    if (emailIndicator) {
      if (secpass === conpass) {
        const data = {
          name: username,
          email: useremail,
          password: secpass
        };
        console.log(data);
        
        const signupResponse = await signup(data);
        console.log('Signup response:', signupResponse); 
  
        if (signupResponse.success) {
          navigate('/login'); 
        } else {
          alert(signupResponse.message);  
        }
      } else {
        setIndicator(true);
      }
    } else {
      setIndicator(true);
    }
  };
  


  const checkEmail = (email) => {
    if (email.includes('@gmail.com') || email === '') {
      setEmailIndicator(true);
    } else {
      setEmailIndicator(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-800">
      <div className="relative bg-gray-800 text-white rounded-2xl shadow-2xl p-10 w-full max-w-2xl">

        
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-gray-400 hover:text-purple-500 transition text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-4xl font-bold text-purple-400 text-center mb-10">Signup</h2>

        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-2">
            <label className="block text-gray-300 mb-2">Username:</label>
            <input
              type="text"
              required
              placeholder="Enter user name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-300 mb-2">Email:</label>
            <input
              type="text"
              required
              placeholder="Enter Email id"
              value={useremail}
              onChange={(e) => {
                setUseremail(e.target.value);
                checkEmail(e.target.value);
              }}
              className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {!emailIndicator && (
              <p className="text-red-500 text-sm mt-1">Email is incorrect</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Create Password:</label>
            <input
              type="password"
              required
              placeholder="Enter new password"
              value={secpass}
              onChange={(e) => setSecpass(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Confirm Password:</label>
            <input
              type="password"
              required
              placeholder="Confirm password"
              value={conpass}
              onChange={(e) => setConpass(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {indicator && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
          </div>

          <div className="col-span-2 flex flex-col items-center space-y-4 mt-8">
            <button
              onClick={submit}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-300"
            >
              Submit
            </button>
            <p
              onClick={() => navigate('/login')}
              className="text-sm text-purple-400 hover:underline cursor-pointer"
            >
              Already have an account?
            </p>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Signup;
