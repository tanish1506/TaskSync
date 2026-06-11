import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type' : 'application/json',
    },
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response)=> response,
    (error) => {
        if(error.response && error.response.status === 401){
            localStorage.removeItem('token');

            if(!window.location.pathname.includes('/login')){
                window.location.href = '/login';
            }
        }

        const message = error.response?.data?.message || 'Something went wrong. Please try again.';
        return Promise.reject(message);
    }
);

export default API;