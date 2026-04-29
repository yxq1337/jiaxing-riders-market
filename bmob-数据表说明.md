# Bmob 数据表配置说明

请在 Bmob 控制台 → 数据 页面创建以下数据表：

---

## 1. Posts（帖子表）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| title | String | 帖子标题 |
| content | String | 帖子内容 |
| section | String | 板块：路况播报/二手交易/求职招聘/互帮互助/闲聊灌水 |
| location | String | 位置/地区 |
| images | String | 图片（逗号分隔） |
| userId | String | 发布者用户ID |
| authorName | String | 发布者昵称 |
| likes | Number | 点赞数 |
| replies_count | Number | 回复数 |

---

## 2. PostReplies（帖子回复表）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| postId | String | 帖子ID |
| content | String | 回复内容 |
| userId | String | 回复者用户ID |
| authorName | String | 回复者昵称 |
| likes | Number | 点赞数 |

---

## 3. Products（商品表）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| title | String | 商品标题 |
| description | String | 商品描述 |
| price | Number | 价格 |
| images | String | 图片 |
| category | String | 分类 |
| userId | String | 发布者ID |
| username | String | 发布者昵称 |
| phone | String | 联系方式 |
| views | Number | 浏览量 |
| status | String | 状态：active/sold/deleted |

---

## 4. Orders（订单表）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| productId | String | 商品ID |
| buyerId | String | 买家ID |
| sellerId | String | 卖家ID |
| status | String | 状态：pending/paid/completed/cancelled |
| price | Number | 成交价格 |

---

## 5. Messages（消息表）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| fromUserId | String | 发送者ID |
| fromUserName | String | 发送者昵称 |
| toUserId | String | 接收者ID |
| content | String | 消息内容 |
| isRead | Boolean | 是否已读 |

---

## 6. Reviews（评价表）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| userId | String | 评价者ID |
| userName | String | 评价者昵称 |
| targetUserId | String | 被评价者ID |
| rating | Number | 评分 1-5 |
| content | String | 评价内容 |

---

## 快速初始化步骤

1. 登录 Bmob 控制台
2. 进入你的应用 → 数据
3. 点击「添加表」，逐个创建上面的表
4. 每个表创建后，点击「添加列」添加字段
5. 可以手动添加几条测试数据

注意：`_User` 表是 Bmob 内置用户表，不需要手动创建。
