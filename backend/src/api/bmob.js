const axios = require('axios');

const bmob = axios.create({
  baseURL: 'https://api2.bmob.cn/1',
  timeout: 15000,
  headers: {
    'X-Bmob-Application-Id': 'f33a06a03b05f0795367d32767f21c63',
    'X-Bmob-REST-API-Key': 'e309b64d6176f40dea125aa38bf8a2e4',
    'Content-Type': 'application/json'
  }
});

bmob.interceptors.response.use(
  response => response.data,
  error => {
    console.error('Bmob API错误:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

module.exports = bmob;
