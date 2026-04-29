# 嘉兴骑手集市 - 外卖骑手二手装备交易平台

一个专为嘉兴市区外卖骑手设计的二手装备交易网站。

## 技术栈

- **前端**: Vue.js 3 + Vant UI + Vite
- **后端**: Node.js + Express + SQLite
- **认证**: JWT

## 项目结构

```
jiaxing-rider-market/
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   ├── api/
│   │   └── main.js
│   └── package.json
├── backend/           # 后端项目
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── app.js
│   ├── database/
│   └── package.json
└── README.md
```

## 快速开始

### 后端启动

```bash
cd backend
npm install
npm run dev
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

## 功能模块

- 用户系统（注册、登录、个人中心）
- 商品系统（发布、浏览、搜索）
- 聊天系统（买卖双方沟通）
- 交易系统（订单管理）
- 评价系统（信用评分）

## 开发计划

- 第1天：项目搭建 + 用户系统
- 第2天：商品系统
- 第3天：搜索筛选
- 第4天：聊天功能
- 第5天：交易评价
- 第6-7天：测试部署
