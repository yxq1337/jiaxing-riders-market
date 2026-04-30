const axios = require('axios');

const BMOB_APP_ID = 'f33a06a03b05f0795367d32767f21c63';
const BMOB_REST_KEY = 'e309b64d6176f40dea125aa38bf8a2e4';

const bmob = axios.create({
  baseURL: 'https://api2.bmob.cn/1',
  timeout: 15000,
  headers: {
    'X-Bmob-Application-Id': BMOB_APP_ID,
    'X-Bmob-REST-API-Key': BMOB_REST_KEY,
    'Content-Type': 'application/json'
  }
});

bmob.interceptors.response.use(
  response => response.data,
  error => {
    console.error('Bmob API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

module.exports = bmob;
