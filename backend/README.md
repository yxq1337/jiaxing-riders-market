# 嘉兴骑手集市 - 后端 API

## 技术栈
- Express.js
- lowdb (本地 JSON 数据库)
- JWT 认证

## 本地开发

```bash
# 安装依赖
npm install

# 初始化数据库
npm run init-db

# 启动开发服务器
npm run dev

# 生产启动
npm start
```

服务器运行在 http://localhost:3000

## 部署到 Vercel

1. 安装 Vercel CLI: `npm i -g vercel`
2. 登录: `vercel login`
3. 部署: `vercel --prod`

或者连接到 GitHub 仓库自动部署。

## API 文档

### 用户
- `POST /api/users/register` - 注册
- `POST /api/users/login` - 登录
- `GET /api/users/profile` - 获取个人信息
- `GET /api/users/:id` - 获取用户信息

### 商品
- `GET /api/products` - 商品列表
- `GET /api/products/:id` - 商品详情
- `POST /api/products` - 发布商品 (需要登录)
- `GET /api/products/my/list` - 我的商品列表 (需要登录)

### 订单
- `POST /api/orders` - 创建订单 (需要登录)
- `GET /api/orders/my` - 我的订单 (需要登录)
- `PUT /api/orders/:id/status` - 更新订单状态 (需要登录)

### 消息
- `GET /api/messages/conversations` - 会话列表 (需要登录)
- `GET /api/messages/conversation/:userId` - 会话详情 (需要登录)
- `POST /api/messages` - 发送消息 (需要登录)

### 评价
- `POST /api/reviews` - 发布评价 (需要登录)
- `GET /api/reviews/user/:userId` - 用户评价列表

### 帖子
- `GET /api/posts` - 帖子列表
- `GET /api/posts/:id` - 帖子详情
- `POST /api/posts` - 发布帖子 (需要登录)
- `POST /api/posts/:id/like` - 点赞帖子 (需要登录)
- `POST /api/posts/:id/reply` - 回复帖子 (需要登录)
