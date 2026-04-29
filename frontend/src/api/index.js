import Bmob from 'hydrogen-js-sdk'

// 初始化 Bmob
Bmob.initialize(
  'f33a06a03b05f0795367d32767f21c63',    // Application ID
  'e309b64d6176f40dea125aa38bf8a2e4'     // REST API Key (API安全码)
)

// 工具函数：统一 Bmob 查询结果格式
const formatResult = (res) => {
  if (res && res.results) return res.results
  if (res && res.data) return res.data
  return res
}

// 用户API
export const userApi = {
  register: async (data) => {
    const { phone, password, nickname } = data
    const params = {
      username: phone,
      password: password,
      phone: phone,
      nickname: nickname || phone,
      credit_score: 100
    }
    return Bmob.User.register(params)
  },

  login: async (data) => {
    const { phone, password } = data
    return Bmob.User.login(phone, password)
  },

  getProfile: async () => {
    const current = Bmob.User.current()
    if (!current) throw new Error('未登录')
    return Bmob.User.current()
  }
}

// 论坛帖子API
export const postApi = {
  getList: async (params = {}) => {
    const { section, limit = 20, page = 1 } = params
    const query = Bmob.Query('Posts')
    query.order('-createdAt')
    query.limit(limit)
    query.skip((page - 1) * limit)

    if (section && section !== '首页') {
      query.equalTo('section', '==', section)
    }

    const res = await query.find()
    return { data: formatResult(res) }
  },

  getDetail: async (id) => {
    const query = Bmob.Query('Posts')
    const post = await query.get(id)

    // 获取回复
    const replyQuery = Bmob.Query('PostReplies')
    replyQuery.equalTo('postId', '==', id)
    replyQuery.order('-createdAt')
    const replies = await replyQuery.find()

    return {
      data: {
        post: formatResult(post),
        replies: formatResult(replies)
      }
    }
  },

  create: async (data) => {
    const query = Bmob.Query('Posts')
    const current = Bmob.User.current()

    query.set('title', data.title)
    query.set('content', data.content)
    query.set('section', data.section || '闲聊灌水')
    query.set('location', data.location || '')
    query.set('images', data.images || '')
    query.set('userId', current?.objectId || '')
    query.set('authorName', current?.nickname || current?.username || '匿名')
    query.set('likes', 0)
    query.set('replies_count', 0)

    const res = await query.save()
    return { data: res }
  },

  like: async (id) => {
    const query = Bmob.Query('Posts')
    query.set('objectId', id)
    query.increment('likes', 1)
    const res = await query.save()
    return { data: res, success: true }
  },

  reply: async (id, data) => {
    const query = Bmob.Query('PostReplies')
    const current = Bmob.User.current()

    query.set('postId', id)
    query.set('content', data.content)
    query.set('userId', current?.objectId || '')
    query.set('authorName', current?.nickname || current?.username || '匿名')
    query.set('likes', 0)

    const res = await query.save()

    // 更新帖子回复数
    const postQuery = Bmob.Query('Posts')
    postQuery.set('objectId', id)
    postQuery.increment('replies_count', 1)
    await postQuery.save()

    return { data: res }
  }
}

// 商品API
export const productApi = {
  getList: async (params = {}) => {
    const { limit = 20, page = 1 } = params
    const query = Bmob.Query('Products')
    query.order('-createdAt')
    query.limit(limit)
    query.skip((page - 1) * limit)
    const res = await query.find()
    return { data: formatResult(res) }
  },

  getDetail: async (id) => {
    const query = Bmob.Query('Products')
    const res = await query.get(id)
    return { data: res }
  },

  create: async (data) => {
    const query = Bmob.Query('Products')
    const current = Bmob.User.current()

    Object.keys(data).forEach(key => {
      query.set(key, data[key])
    })
    query.set('userId', current?.objectId || '')
    query.set('views', 0)

    const res = await query.save()
    return { data: res }
  },

  getMyList: async () => {
    const current = Bmob.User.current()
    if (!current) return { data: [] }

    const query = Bmob.Query('Products')
    query.equalTo('userId', '==', current.objectId)
    query.order('-createdAt')
    const res = await query.find()
    return { data: formatResult(res) }
  }
}

// 订单API (简化版)
export const orderApi = {
  create: async (data) => {
    const query = Bmob.Query('Orders')
    const current = Bmob.User.current()
    query.set('userId', current?.objectId || '')
    Object.keys(data).forEach(key => query.set(key, data[key]))
    const res = await query.save()
    return { data: res }
  },

  getMyList: async () => {
    const current = Bmob.User.current()
    if (!current) return { data: [] }
    const query = Bmob.Query('Orders')
    query.equalTo('userId', '==', current.objectId)
    query.order('-createdAt')
    const res = await query.find()
    return { data: formatResult(res) }
  },

  updateStatus: async (id, status) => {
    const query = Bmob.Query('Orders')
    query.set('objectId', id)
    query.set('status', status)
    const res = await query.save()
    return { data: res }
  }
}

// 消息API
export const messageApi = {
  getConversations: async () => {
    const current = Bmob.User.current()
    if (!current) return { data: [] }

    const query = Bmob.Query('Messages')
    query.equalTo('toUserId', '==', current.objectId)
    query.group('fromUserId')
    query.order('-createdAt')
    const res = await query.find()
    return { data: formatResult(res) }
  },

  getConversation: async (userId) => {
    const current = Bmob.User.current()
    if (!current) return { data: [] }

    const query = Bmob.Query('Messages')
    query.or(
      query.and(
        query.equalTo('fromUserId', '==', current.objectId),
        query.equalTo('toUserId', '==', userId)
      ),
      query.and(
        query.equalTo('fromUserId', '==', userId),
        query.equalTo('toUserId', '==', current.objectId)
      )
    )
    query.order('createdAt')
    const res = await query.find()
    return { data: formatResult(res) }
  },

  send: async (data) => {
    const query = Bmob.Query('Messages')
    const current = Bmob.User.current()
    query.set('fromUserId', current?.objectId || '')
    query.set('fromUserName', current?.nickname || current?.username)
    query.set('toUserId', data.toUserId)
    query.set('content', data.content)
    const res = await query.save()
    return { data: res }
  }
}

// 评价API
export const reviewApi = {
  create: async (data) => {
    const query = Bmob.Query('Reviews')
    const current = Bmob.User.current()
    query.set('userId', current?.objectId || '')
    query.set('userName', current?.nickname || current?.username)
    Object.keys(data).forEach(key => query.set(key, data[key]))
    const res = await query.save()
    return { data: res }
  },

  getUserReviews: async (userId) => {
    const query = Bmob.Query('Reviews')
    query.equalTo('userId', '==', userId)
    query.order('-createdAt')
    const res = await query.find()
    return { data: formatResult(res) }
  }
}

export default Bmob
