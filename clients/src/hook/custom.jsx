import React, {useState, useEffect, useContext} from 'react'
import api from "../context/api"
import {useNavigate} from 'react-router-dom'


const custom = ()=> {
    const [search, setSearch] = useState([])
    const [result, setResult] = useState(null)
    const [userDetail, setuserDetail] = useState({})
    const [userLogin, setuserLogin] = useState(false)
    const [userList, setuserList] = useState([])
    const navigate = useNavigate()
    const prompt = async (data) => {
        try {
            console.log('Data sent to API:', data);
            const response = await api.post('/api/ai/generate/nonuser', data, { skipAuth: true });
            console.log('Response from API:', response.data);

            if (response.data) {
                return response.data;
            } else {
                return null; 
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            throw new Error('Server downtime or fetch failed'); 
        }
    };
    const signup = async (user) => {
        try {
          console.log(user);
          const response = await api.post('/api/ai/register', user);
          console.log(response.data.message);
          
          if (response.data.permission !== true) {
            alert(response.data.message);
            return { success: false, message: response.data.message };  
          } else {
            alert(response.data.message);
            return { success: true, message: response.data.message }; 
          }
        } catch (err) {
          if (err.response) {
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
          } else {
            console.log(`ERROR: ${err.message}`);
          }
          return { success: false, message: 'An error occurred. Please try again.' };  
        }
      };
      
      
    
    
    const finduser = async () => {
        try {
          const user = localStorage.getItem('userdetail')
          if (user) {
            setuserDetail(user)
            setuserLogin(true)
          }
          else {
            setuserLogin(false)
          }
        } catch (err) {
          console.log(err)
        }
    }
    const saveuser = async (user) => {
        try {
          localStorage.setItem('userdetail', JSON.stringify(user))
          console.log(user)
          console.log("save user")
          setuserDetail(user)
        } catch (err) {
          console.log(err)
        }
    }
    const savetoken = async (token) => {
        try {
          localStorage.setItem('usertoken', JSON.stringify(token))
          console.log("save token ")
        } catch (err) {
          console.log(err)
        }
    }
    const login = async (userData) => {
        try {
          const response = await api.post('/api/ai/user/login', userData)
          await savetoken(response.data.token)
          await saveuser(userData)
          console.log(userDetail)
          await finduser()
          console.log(userLogin)
    
          return true;  
        } catch (err) {
          setuserLogin(false)
          if (err.response) {
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
          } else {
            console.log(`ERROR:${err.message}`)
          }
          return false;  
        }
    }
    
    return {
        prompt, signup, login, finduser, userDetail, userLogin, userList, setuserList, result, setResult, search, setSearch
    }
}

export default custom
