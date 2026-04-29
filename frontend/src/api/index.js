const APP_ID = 'f33a06a03b05f0795367d32767f21c63'
const REST_KEY = 'e309b64d6176f40dea125aa38bf8a2e4'
const BASE_URL = 'https://api2.bmob.cn/1'

const request = async (url, options = {}) => {
  const headers = {
    'X-Bmob-Application-Id': APP_ID,
    'X-Bmob-REST-API-Key': REST_KEY,
    'Content-Type': 'application/json',
    ...options.headers
  }

  const token = localStorage.getItem('token')
  if (token) {
    headers['X-Bmob-Session-Token'] = token
  }

  try {
    console.log('请求:', BASE_URL + url)
    const res = await fetch(BASE_URL + url, {
      mode: 'cors',
      ...options,
      headers
    })
    const data = await res.json()
    console.log('响应:', data)
    if (!res.ok) {
      throw new Error(data.error || data.msg || '请求失败')
    }
    return data
  } catch (e) {
    console.error('请求错误:', e)
    throw e
  }
}

const formatResult = (res) => {
  if (res && res.results) return res.results
  return res
}

// 用户API
export const userApi = {
  register: async (data) => {
    const { phone, password, nickname } = data
    return request('/users', {
      method: 'POST',
      body: JSON.stringify({
        username: phone,
        password: password,
        phone: phone,
        nickname: nickname || phone,
        credit_score: 100
      })
    })
  },

  login: async (data) => {
    const { phone, password } = data
    return request(`/login?username=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}`)
  },

  getProfile: async () => {
    const userStr = localStorage.getItem('user')
    if (!userStr) throw new Error('未登录')
    return JSON.parse(userStr)
  }
}

// 论坛帖子API
export const postApi = {
  getList: async (params = {}) => {
    const { section, limit = 20, page = 1 } = params
    let url = `/classes/Posts?limit=${limit}&skip=${(page - 1) * limit}&order=-createdAt`
    if (section && section !== '首页') {
      url += `&where=${encodeURIComponent(JSON.stringify({ section }))}`
    }
    const res = await request(url)
    return { data: formatResult(res) }
  },

  getDetail: async (id) => {
    const post = await request(`/classes/Posts/${id}`)
    const replies = await request(`/classes/PostReplies?where=${encodeURIComponent(JSON.stringify({ postId: id }))}&order=-createdAt`)
    return {
      data: {
        post: formatResult(post),
        replies: formatResult(replies)
      }
    }
  },

  create: async (data) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    return request('/classes/Posts', {
      method: 'POST',
      body: JSON.stringify({
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
    })
  },

  like: async (id) => {
    const res = await request(`/classes/Posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        likes: { __op: 'Increment', amount: 1 }
      })
    })
    return { data: res, success: true }
  },

  reply: async (id, data) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    const res = await request('/classes/PostReplies', {
      method: 'POST',
      body: JSON.stringify({
        postId: id,
        content: data.content,
        userId: current?.objectId || '',
        authorName: current?.nickname || current?.username || '匿名',
        likes: 0
      })
    })

    await request(`/classes/Posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        replies_count: { __op: 'Increment', amount: 1 }
      })
    })

    return { data: res }
  }
}

// 商品API
export const productApi = {
  getList: async (params = {}) => {
    const { limit = 20, page = 1 } = params
    const res = await request(`/classes/Products?limit=${limit}&skip=${(page - 1) * limit}&order=-createdAt`)
    return { data: formatResult(res) }
  },

  getDetail: async (id) => {
    const res = await request(`/classes/Products/${id}`)
    return { data: res }
  },

  create: async (data) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    const res = await request('/classes/Products', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        userId: current?.objectId || '',
        views: 0
      })
    })
    return { data: res }
  },

  getMyList: async () => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    if (!current.objectId) return { data: [] }
    const res = await request(`/classes/Products?where=${encodeURIComponent(JSON.stringify({ userId: current.objectId }))}&order=-createdAt`)
    return { data: formatResult(res) }
  }
}

// 订单API (简化版)
export const orderApi = {
  create: async (data) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    const res = await request('/classes/Orders', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        userId: current?.objectId || ''
      })
    })
    return { data: res }
  },

  getMyList: async () => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    if (!current.objectId) return { data: [] }
    const res = await request(`/classes/Orders?where=${encodeURIComponent(JSON.stringify({ userId: current.objectId }))}&order=-createdAt`)
    return { data: formatResult(res) }
  },

  updateStatus: async (id, status) => {
    const res = await request(`/classes/Orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
    return { data: res }
  }
}

// 消息API
export const messageApi = {
  getConversations: async () => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    if (!current.objectId) return { data: [] }
    const res = await request(`/classes/Messages?where=${encodeURIComponent(JSON.stringify({ toUserId: current.objectId }))}&order=-createdAt`)
    return { data: formatResult(res) }
  },

  getConversation: async (userId) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    if (!current.objectId) return { data: [] }
    const where = {
      '$or': [
        { fromUserId: current.objectId, toUserId: userId },
        { fromUserId: userId, toUserId: current.objectId }
      ]
    }
    const res = await request(`/classes/Messages?where=${encodeURIComponent(JSON.stringify(where))}&order=createdAt`)
    return { data: formatResult(res) }
  },

  send: async (data) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    const res = await request('/classes/Messages', {
      method: 'POST',
      body: JSON.stringify({
        fromUserId: current?.objectId || '',
        fromUserName: current?.nickname || current?.username || '',
        toUserId: data.toUserId,
        content: data.content
      })
    })
    return { data: res }
  }
}

// 评价API
export const reviewApi = {
  create: async (data) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}')
    const res = await request('/classes/Reviews', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        userId: current?.objectId || '',
        userName: current?.nickname || current?.username || ''
      })
    })
    return { data: res }
  },

  getUserReviews: async (userId) => {
    const res = await request(`/classes/Reviews?where=${encodeURIComponent(JSON.stringify({ userId }))}&order=-createdAt`)
    return { data: formatResult(res) }
  }
}

export default null
