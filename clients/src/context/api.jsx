import axios from 'axios';

const BASE_URL  = 'http://localhost:4500' ;
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('userToken')
        if (!config.skipAuth && token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default api