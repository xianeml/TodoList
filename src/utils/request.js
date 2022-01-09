import axios from '@/utils/axios.js';

const request = config => {
  const { url, method, params, meta } = config;

  if (method === 'GET') {
    return axios.get(url, {
      params,
      meta,
    });
  }
};

export default request;
