import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器 - 添加token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 用户API
export const userApi = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile')
}

// 商品API
export const productApi = {
  getList: (params) => api.get('/products', { params }),
  getDetail: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  getMyList: () => api.get('/products/my/list')
}

// 订单API
export const orderApi = {
  create: (data) => api.post('/orders', data),
  getMyList: () => api.get('/orders/my'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
}

// 消息API
export const messageApi = {
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  send: (data) => api.post('/messages', data)
}

// 评价API
export const reviewApi = {
  create: (data) => api.post('/reviews', data),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`)
}

export default api
