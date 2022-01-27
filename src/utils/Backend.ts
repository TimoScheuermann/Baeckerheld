import Axios from 'axios';

export const backendUrl = 'https://api.mso.patrick-mennig.de/';
// export const backendUrl = 'http://localhost:3000/';

const backend = Axios.create({
  timeout: 3000,
  baseURL: backendUrl,
});

backend.interceptors.request.use((config) => {
  if (process.env.NODE_ENV === 'development') {
    console.info('✉️ ', config.method?.toUpperCase() + ' ' + config.url);
  }
  config.headers = {
    Authorization: `Bearer ${localStorage.getItem('bh-token')}`,
  };
  return config;
});

backend.interceptors.response.use(
  (config) => config,
  (error) => {
    return Promise.reject(error.response.data);
  }
);

export default backend;
