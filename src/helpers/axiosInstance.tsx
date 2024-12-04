import appConfig from '@/config';
import axios from 'axios';

// Get the API URL from the config file
const API_URL = appConfig.api.url || 'http://localhost:8080';

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
});
// Add a request interceptor
export default axiosInstance;