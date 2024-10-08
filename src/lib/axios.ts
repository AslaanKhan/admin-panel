// lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: `http://localhost:1337/api`, // Change to your API URL
  baseURL: `http://mongonode-production.up.railway.app/api`, // Change to your API URL
});

let activeRequests = 0;

axiosInstance.interceptors.request.use((config) => {
  activeRequests++;
  // You can dispatch an action or set state to show the loader here
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    activeRequests--;
    // Hide loader when there are no active requests
    return response;
  },
  (error) => {
    activeRequests--;
    // Hide loader when there are no active requests
    return Promise.reject(error);
  }
);

export const isLoading = () => activeRequests > 0;
export default axiosInstance;
