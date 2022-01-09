import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 1000,
});

instance.interceptors.request.use(
  request => {
    console.log('request', request);

    return request;
  },
  error => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  response => {
    console.log('response', response);

    return response;
  },
  error => {
    return Promise.reject(error);
  },
);

export default instance;
