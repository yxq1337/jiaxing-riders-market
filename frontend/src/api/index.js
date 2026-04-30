import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 15000
})

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

request.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API错误:', error)
    return Promise.reject(error)
  }
)

export const userApi = {
  register: (data) => request.post('/users/register', data),
  login: (data) => request.post('/users/login', data),
  getProfile: () => request.get('/users/profile'),
  getById: (id) => request.get(`/users/${id}`)
}

export const postApi = {
  getList: (params = {}) => request.get('/posts', { params }),
  getDetail: (id) => request.get(`/posts/${id}`),
  create: (data) => request.post('/posts', data),
  like: (id) => request.post(`/posts/${id}/like`),
  reply: (id, data) => request.post(`/posts/${id}/reply`, data)
}

export const productApi = {
  getList: (params = {}) => request.get('/products', { params }),
  getDetail: (id) => request.get(`/products/${id}`),
  create: (data) => request.post('/products', data),
  getMyList: () => request.get('/products/my/list')
}

export const orderApi = {
  create: (data) => request.post('/orders', data),
  getMyList: () => request.get('/orders/my'),
  updateStatus: (id, status) => request.put(`/orders/${id}/status`, { status })
}

export const messageApi = {
  getConversations: () => request.get('/messages/conversations'),
  getConversation: (userId) => request.get(`/messages/conversation/${userId}`),
  send: (data) => request.post('/messages', data)
}

export const reviewApi = {
  create: (data) => request.post('/reviews', data),
  getUserReviews: (userId) => request.get(`/reviews/user/${userId}`)
}

export default request
