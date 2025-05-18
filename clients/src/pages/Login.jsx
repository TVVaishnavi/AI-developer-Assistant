import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import custom from '../hook/custom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from '../../firebase.config';
import api from '../context/api';

function Login() {
  const [useremail, setUseremail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = custom();
  const { savetoken, saveuser, finduser } = custom();

  const loginProcess = async (user, password) => {
    if (user === '' || password === '') {
      alert("Please fill in email and password");
    } else {
      const data = { email: user, password: password };
      const success = await login(data);
      console.log("Login success status:", success);
      if (success) {
        localStorage.setItem("userEmail", user);
        console.log("Navigating to home...");
        navigate('/');
      } else {
        console.log("Login failed");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const { email, displayName } = result.user;

      const response = await api.post("/api/ai/google/login", {
        idToken,
      });

      const { token, status } = response.data;

      if (status && token) {
        await savetoken(token);
        await saveuser({ name: displayName, email });
        await finduser();
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", displayName);
        console.log("localStorage userEmail after set:", localStorage.getItem("userEmail"));
        console.log("localStorage userName after set:", localStorage.getItem("userName"));
        window.dispatchEvent(new Event("localStorageChanged"));
        setTimeout(() => {
          navigate('/');
        }, 100);
      } else {
        alert("Google login failed.");
      }
    } catch (err) {
      console.error("Google login error:", err.message);
      alert("Google login failed.");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-800">
      <div className="relative bg-gray-800 text-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

  
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-gray-400 hover:text-purple-500 transition text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-purple-400 text-center mb-8">Login</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">User Email:</label>
            <input
              type="text"
              required
              placeholder="Enter user email"
              value={useremail}
              onChange={(e) => setUseremail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Password:</label>
            <input
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex flex-col items-center space-y-4 mt-6">
            <button
              onClick={() => loginProcess(useremail, password)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-300"
            >
              Submit
            </button>
            <h3>Or</h3>
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-300">
              Login with Google
            </button>
            <p
              onClick={() => navigate('/signup')}
              className="text-sm text-purple-400 hover:underline cursor-pointer"
            >
              Create Account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
