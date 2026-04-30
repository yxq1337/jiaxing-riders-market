import axios from 'axios'

const request = axios.create({
  baseURL: 'https://api2.bmob.cn/1',
  timeout: 15000,
  headers: {
    'X-Bmob-Application-Id': 'f33a06a03b05f0795367d32767f21c63',
    'X-Bmob-REST-API-Key': 'e309b64d6176f40dea125aa38bf8a2e4',
    'Content-Type': 'application/json'
  }
})

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['X-Bmob-Session-Token'] = token
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
  register: (data) => request.post('/users', {
    username: data.phone,
    password: data.password,
    phone: data.phone,
    nickname: data.nickname || data.phone,
    credit_score: 100
  }),

  login: async (data) => {
    const result = await request.get('/login', {
      params: {
        username: data.phone,
        password: data.password
      }
    })
    localStorage.setItem('token', result.sessionToken)
    localStorage.setItem('user', JSON.stringify(result))
    return result
  },

  getProfile: async () => {
    const userStr = localStorage.getItem('user')
    if (!userStr) return Promise.reject(new Error('未登录'))
    const user = JSON.parse(userStr)
    return request.get(`/users/${user.objectId}`)
  },

  getById: (id) => request.get(`/users/${id}`)
}

export const postApi = {
  getList: async (params = {}) => {
    const { section, limit = 20, page = 1 } = params
    let where = {}
    if (section && section !== '首页') {
      where = { section }
    }
    const result = await request.get('/classes/Posts', {
      params: {
        limit,
        skip: (page - 1) * limit,
        order: '-createdAt',
        where: Object.keys(where).length > 0 ? JSON.stringify(where) : undefined
      }
    })
    return result.results || []
  },

  getDetail: async (id) => {
    const post = await request.get(`/classes/Posts/${id}`)
    const replies = await request.get('/classes/PostReplies', {
      params: {
        where: JSON.stringify({ postId: id }),
        order: '-createdAt'
      }
    })
    return {
      post,
      replies: replies.results || []
    }
  },

  create: async (data) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    return request.post('/classes/Posts', {
      title: data.title,
      content: data.content,
      section: data.section || '闲聊灌水',
      location: data.location || '',
      images: data.images || '',
      userId: current?.objectId || '',
      authorName: current?.nickname || current?.username || '匿名',
      likes: 0,
      replies_count: 0
    })
  },

  like: async (id) => {
    return request.put(`/classes/Posts/${id}`, {
      likes: { '__op': 'Increment', 'amount': 1 }
    })
  },

  reply: async (id, data) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    await request.post('/classes/PostReplies', {
      postId: id,
      content: data.content,
      userId: current?.objectId || '',
      authorName: current?.nickname || current?.username || '匿名',
      likes: 0
    })

    await request.put(`/classes/Posts/${id}`, {
      replies_count: { '__op': 'Increment', 'amount': 1 }
    })
  }
}

export const productApi = {
  getList: (params = {}) => {
    const { limit = 20, page = 1 } = params
    return request.get('/classes/Products', {
      params: {
        limit,
        skip: (page - 1) * limit,
        order: '-createdAt',
        where: JSON.stringify({ status: 'active' })
      }
    }).then(res => res.results || [])
  },

  getDetail: (id) => request.get(`/classes/Products/${id}`),

  create: (data) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    return request.post('/classes/Products', {
      ...data,
      userId: current?.objectId || '',
      view_count: 0,
      status: 'active'
    })
  },

  getMyList: () => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    if (!current.objectId) return Promise.resolve([])
    return request.get('/classes/Products', {
      params: {
        where: JSON.stringify({ userId: current.objectId }),
        order: '-createdAt'
      }
    }).then(res => res.results || [])
  }
}

export const orderApi = {
  create: (data) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    return request.post('/classes/Orders', {
      ...data,
      userId: current?.objectId || ''
    })
  },

  getMyList: () => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    if (!current.objectId) return Promise.resolve([])
    return request.get('/classes/Orders', {
      params: {
        where: JSON.stringify({ userId: current.objectId }),
        order: '-createdAt'
      }
    }).then(res => res.results || [])
  },

  updateStatus: (id, status) => request.put(`/classes/Orders/${id}`, { status })
}

export const messageApi = {
  getConversations: () => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    if (!current.objectId) return Promise.resolve([])
    return request.get('/classes/Messages', {
      params: {
        where: JSON.stringify({ toUserId: current.objectId }),
        order: '-createdAt'
      }
    }).then(res => res.results || [])
  },

  getConversation: (userId) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    if (!current.objectId) return Promise.resolve([])
    const where = {
      '$or': [
        { fromUserId: current.objectId, toUserId: userId },
        { fromUserId: userId, toUserId: current.objectId }
      ]
    }
    return request.get('/classes/Messages', {
      params: {
        where: JSON.stringify(where),
        order: 'createdAt'
      }
    }).then(res => res.results || [])
  },

  send: (data) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    return request.post('/classes/Messages', {
      fromUserId: current?.objectId || '',
      fromUserName: current?.nickname || current?.username || '',
      toUserId: data.toUserId,
      content: data.content
    })
  }
}

export const reviewApi = {
  create: (data) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    return request.post('/classes/Reviews', {
      ...data,
      userId: current?.objectId || '',
      userName: current?.nickname || current?.username || ''
    })
  },

  getUserReviews: (userId) => {
    return request.get('/classes/Reviews', {
      params: {
        where: JSON.stringify({ userId }),
        order: '-createdAt'
      }
    }).then(res => res.results || [])
  }
}

export default request
