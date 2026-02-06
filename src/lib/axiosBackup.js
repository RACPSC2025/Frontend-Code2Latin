// axiosInstance.js
import axios from 'axios';
import { API_URL, LOCAL_AUTH_TOKEN, SYSTEM_TOKEN } from '../config/constants';
import storage from '../utils/storage';

export const fileHeader = { headers: { 'Content-Type': 'multipart/form-data' } };

const instance = axiosConfiguration();

function axiosConfiguration() {
  return axios.create({
    baseURL: API_URL,
    timeout: 600000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before the request is sent, like adding an authorization header
    let token = null,
      systemToken = null;


    if (process.env.NODE_ENV !== 'production') {
      token = LOCAL_AUTH_TOKEN;
      systemToken = SYSTEM_TOKEN;
    } else {
      token = storage.getToken();
      systemToken = storage.getSystemToken();
    }
    

    // temporal changes to ocensa_ambiental
    //token = LOCAL_AUTH_TOKEN;
    //systemToken = SYSTEM_TOKEN;

    if (token) {
      config.headers['Auth-Token'] = token;
      config.headers['System-Token'] = systemToken;
      //config.headers['Access-Control-Allow-Credentials'] = 'true';
    }

    return config;
  },
  function (error) {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx will trigger this function
    // Handle the response data
    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx will trigger this function
    // Handle errors

    // Ajuste temporal para ocensa_ambiental
    
    if (error.response.status === 401) {
      const responseData = error.response.data;
      if (responseData && responseData.status === 401 && responseData.redirect_url) {
        // Redirect to the URL specified in the response
        window.location.href = responseData.redirect_url;
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;
