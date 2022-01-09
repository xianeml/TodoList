import axios from '@/utils/axios.js';

const request = config => {
  const { url, method, params, data, meta } = config;

  switch (method) {
    case 'GET':
      return axios.get(url, {
        params,
        meta,
      });
    case 'POST':
      return axios.post(url, data);
    case 'PATCH':
      return axios.patch(url, data);
    case 'DELETE':
      return axios.delete(url);
    default:
      break;
  }
};

export default request;
