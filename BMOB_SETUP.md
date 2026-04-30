# Bmob 云数据库配置完成

## ✅ 已完成配置

### 后端配置
- 后端所有 API 已切换到 Bmob REST API
- 文件位置: `backend/src/config/bmob.js`
- 路由已全部更新: users, products, posts, orders, messages, reviews

### 前端配置
- 前端 API 已直接调用 Bmob
- 文件位置: `frontend/src/api/index.js`
- 自动携带 Bmob Session Token

### 数据表初始化
- ✅ Products - 商品表
- ✅ Posts - 帖子表
- ✅ PostReplies - 帖子回复表
- ✅ Orders - 订单表
- ✅ Messages - 消息表
- ✅ Reviews - 评价表

## 📋 Bmob 控制台操作

登录 [Bmob 后台](https://www.bmob.cn/) 查看数据表:
1. 进入应用 -> 数据 -> 数据表
2. 可以看到所有已创建的表
3. 可以添加/编辑/删除数据

## 🚀 测试方法

### 1. 注册账号
```bash
curl -X POST "https://api2.bmob.cn/1/users" \
  -H "X-Bmob-Application-Id: f33a06a03b05f0795367d32767f21c63" \
  -H "X-Bmob-REST-API-Key: e309b64d6176f40dea125aa38bf8a2e4" \
  -H "Content-Type: application/json" \
  -d '{"username":"13800000000","password":"123456","phone":"13800000000","nickname":"测试骑手","credit_score":100}'
```

### 2. 登录
```bash
curl "https://api2.bmob.cn/1/login?username=13800000000&password=123456" \
  -H "X-Bmob-Application-Id: f33a06a03b05f0795367d32767f21c63" \
  -H "X-Bmob-REST-API-Key: e309b64d6176f40dea125aa38bf8a2e4"
```

### 3. 获取商品列表
```bash
curl "https://api2.bmob.cn/1/classes/Products?limit=10" \
  -H "X-Bmob-Application-Id: f33a06a03b05f0795367d32767f21c63" \
  -H "X-Bmob-REST-API-Key: e309b64d6176f40dea125aa38bf8a2e4"
```

## 💡 注意事项

1. **网络问题**: 如果 Bmob API 无法访问，请检查网络连接或使用 VPN
2. **CORS**: 前端直接调用 Bmob 可能有 CORS 问题，Cloudflare Pages 部署后自动解决
3. **数据安全**: 生产环境请在 Bmob 后台设置正确的 ACL 权限
4. **文件上传**: 商品图片等文件需要使用 Bmob 的文件上传 API

## 🔗 部署

### 前端部署 (Cloudflare Pages)
- 代码已配置好直接调用 Bmob API
- 无需后端代理，前端直连 Bmob

### 后端部署 (可选)
- 如果需要自定义业务逻辑，可以部署后端到 Vercel
- 后端使用 Bmob SDK 操作数据库

## 📞 联系方式

如有问题，请查看 Bmob 官方文档: https://doc.bmob.cn/
