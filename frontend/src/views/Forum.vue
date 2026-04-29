<template>
  <div class="forum">
    <!-- 顶部搜索 -->
    <div class="forum-header">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <span class="search-placeholder">找路况、找装备、问路线...</span>
      </div>
      <div class="weather-info">
        <span class="weather-icon">☀️</span>
        <span class="weather-text">嘉兴 25° 晴</span>
      </div>
    </div>

    <!-- 板块导航 -->
    <div class="section-nav">
      <div
        v-for="(s, i) in sections"
        :key="i"
        :class="['section-item', { active: activeSection === i }]"
        @click="activeSection = i"
      >
        <span class="section-icon">{{ s.icon }}</span>
        <span class="section-name">{{ s.name }}</span>
        <span v-if="s.count" class="section-count">{{ s.count }}</span>
      </div>
    </div>

    <!-- 今日热议 -->
    <div class="hot-topics">
      <div class="hot-title">
        <span class="hot-icon">🔥</span>
        <span>今日热议</span>
      </div>
      <div class="hot-list">
        <div v-for="(t, i) in hotTopics" :key="i" class="hot-item" @click="viewTopic(t)">
          <div class="hot-rank" :class="{ top: i < 3 }">{{ i + 1 }}</div>
          <div class="hot-content">
            <span class="hot-text">{{ t.title }}</span>
            <span class="hot-meta">{{ t.replies }}回复 · {{ t.views }}浏览</span>
          </div>
          <van-icon name="arrow" color="#ddd" size="12" />
        </div>
      </div>
    </div>

    <!-- 帖子列表 -->
    <div class="post-list">
      <div v-for="post in posts" :key="post.id" class="post-card" @click="viewPost(post)">
        <div class="post-header">
          <div class="author-avatar">
            <span>{{ post.author.charAt(0) }}</span>
          </div>
          <div class="author-info">
            <div class="author-name">
              <span>{{ post.author }}</span>
              <span v-if="post.level" class="author-level">{{ post.level }}</span>
            </div>
            <div class="post-time">
              <span class="location">📍 {{ post.location }}</span>
              <span>·</span>
              <span>{{ post.time }}</span>
            </div>
          </div>
        </div>

        <div class="post-content">
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-text">{{ post.content }}</p>
          <div v-if="post.images?.length" class="post-images">
            <img
              v-for="(img, idx) in post.images.slice(0, 3)"
              :key="idx"
              :src="img"
              class="post-img"
              :class="{ single: post.images.length === 1 }"
            />
            <div v-if="post.images.length > 3" class="more-images">
              +{{ post.images.length - 3 }}
            </div>
          </div>
        </div>

        <div class="post-actions">
          <div class="action-item">
            <span>💬</span>
            <span>{{ post.replies }}</span>
          </div>
          <div class="action-item">
            <span>👍</span>
            <span>{{ post.likes }}</span>
          </div>
          <div class="action-item">
            <span>⭐</span>
            <span>{{ post.stars }}</span>
          </div>
          <div class="action-item share">
            <span>📤</span>
            <span>分享</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 发帖按钮 -->
    <div class="fab-button" @click="createPost">
      <span class="fab-icon">✍️</span>
      <span class="fab-text">发帖</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const activeSection = ref(0)

const sections = [
  { name: '首页', icon: '🏠', count: '' },
  { name: '路况播报', icon: '🛣️', count: '23' },
  { name: '二手交易', icon: '🛒', count: '56' },
  { name: '求职招聘', icon: '💼', count: '12' },
  { name: '互帮互助', icon: '🤝', count: '8' },
  { name: '闲聊灌水', icon: '💬', count: '' },
]

const hotTopics = [
  { title: '今天中环南路大堵车，有人知道怎么回事吗？', replies: 45, views: 1230 },
  { title: '推荐几个晚上跑单好停车的地方', replies: 28, views: 890 },
  { title: '明天有雨，大家注意带雨衣！', replies: 67, views: 2100 },
  { title: '万达那家电动车维修店太黑了！', replies: 34, views: 560 },
]

const posts = ref([
  {
    id: 1,
    author: '老骑友王哥',
    level: 'Lv.12',
    location: '经开区',
    time: '刚刚',
    title: '🚨 中环南路与越秀路交叉口严重堵车！建议绕行',
    content: '刚才路过，三车追尾，整个路口堵死了，大家建议从文昌路或者由拳路绕行，别在这里浪费时间！',
    images: [],
    replies: 89,
    likes: 234,
    stars: 67
  },
  {
    id: 2,
    author: '南湖车神',
    level: 'Lv.8',
    location: '南湖区',
    time: '10分钟前',
    title: '实测：嘉善到嘉兴市区这条新路线，比原来快15分钟！',
    content: '今天试了一下从嘉善走那条新修的路，比往常节省了至少15分钟，全程没有红绿灯，跑起来特别爽！',
    images: ['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=2'],
    replies: 23,
    likes: 156,
    stars: 34
  },
  {
    id: 3,
    author: '风雨无阻',
    level: 'Lv.10',
    location: '秀洲区',
    time: '25分钟前',
    title: '⛈️ 今晚有暴雨！大家记得带雨衣，这几个路段别去',
    content: '天气预报说今晚有大到暴雨，提醒几个积水重灾区：中山路下穿、火车站隧道、昌盛路大桥下，大家尽量避开。',
    images: ['https://picsum.photos/400/250?random=4'],
    replies: 56,
    likes: 312,
    stars: 89
  },
  {
    id: 4,
    author: '跑单小王子',
    level: 'Lv.6',
    location: '南湖区',
    time: '40分钟前',
    title: '禾兴路今天全段施工，从早到晚都堵，别来了',
    content: '今天跑禾兴路的兄弟们注意了，全段修路，半幅通行，我堵了20分钟才出来，建议直接绕路。',
    images: [],
    replies: 34,
    likes: 128,
    stars: 22
  },
  {
    id: 5,
    author: '桐乡阿杰',
    level: 'Lv.7',
    location: '桐乡',
    time: '1小时前',
    title: '桐乡乌镇大道新增测速摄像头，限速50！',
    content: '昨天被拍了，扣6分罚200...乌镇大道和环河路交叉口新增的，大家注意减速，太坑了！',
    images: ['https://picsum.photos/400/300?random=8'],
    replies: 67,
    likes: 245,
    stars: 51
  },
])

const viewTopic = (t) => {
  showToast('查看话题：' + t.title)
}

const viewPost = (p) => {
  showToast('查看帖子：' + p.title.slice(0, 10) + '...')
}

const createPost = () => {
  showToast('打开发帖页面')
}
</script>

<style scoped>
.forum {
  min-height: 100vh;
  background: var(--bg-gray);
  padding-bottom: 90px;
}

/* 头部搜索 */
.forum-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--primary-gradient);
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  border-bottom: 3px solid var(--border-dark);
  animation: slideDown 0.4s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border-radius: 20px;
  padding: 10px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 3px solid var(--border-dark);
  cursor: pointer;
  transition: all 0.2s;
}

.search-bar:active {
  transform: scale(0.98);
  box-shadow: inset 2px 2px 0px rgba(0, 0, 0, 0.1);
}

.search-icon {
  font-size: 14px;
  opacity: 0.5;
  transition: transform 0.3s;
}

.search-bar:hover .search-icon {
  transform: scale(1.1);
}

.search-placeholder {
  flex: 1;
  font-size: 13px;
  color: var(--text-light);
  font-weight: 600;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  transition: all 0.2s;
}

.weather-info:active {
  transform: scale(0.95);
}

.weather-icon {
  font-size: 16px;
  animation: sunPulse 3s ease-in-out infinite;
}

@keyframes sunPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.weather-text {
  font-size: 12px;
  color: white;
  font-weight: 700;
}

/* 板块导航 */
.section-nav {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: white;
  overflow-x: auto;
  border-bottom: 2px solid #eee;
}

.section-nav::-webkit-scrollbar {
  display: none;
}

.section-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: var(--bg-gray);
  border-radius: 20px;
  font-size: 13px;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid transparent;
  font-weight: 700;
}

.section-item:active {
  transform: scale(0.95);
}

.section-item.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 800;
  border-color: var(--primary);
  box-shadow: 2px 2px 0px var(--primary);
}

.section-icon {
  font-size: 15px;
  transition: transform 0.3s;
}

.section-item:hover .section-icon {
  transform: scale(1.2);
}

.section-count {
  padding: 2px 8px;
  background: var(--accent-pink);
  color: white;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 800;
  border: 2px solid var(--border-dark);
  animation: pulseBadge 2s ease-in-out infinite;
}

@keyframes pulseBadge {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 今日热议 */
.hot-topics {
  margin: 12px;
  background: white;
  border-radius: 16px;
  padding: 16px;
  border: 3px solid var(--border-dark);
  box-shadow: 4px 4px 0px var(--border-dark);
  animation: fadeInUp 0.5s ease-out 0.1s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hot-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 900;
  color: var(--text-dark);
  margin-bottom: 12px;
}

.hot-icon {
  font-size: 20px;
  animation: fireShake 0.5s ease-in-out infinite;
}

@keyframes fireShake {
  0%, 100% { transform: rotate(-5deg) scale(1); }
  50% { transform: rotate(5deg) scale(1.1); }
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 10px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s;
}

.hot-item:active {
  background: var(--primary-light);
  transform: translateX(4px);
}

.hot-rank {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: var(--bg-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 900;
  color: var(--text-light);
  flex-shrink: 0;
  border: 3px solid var(--border-dark);
  transition: all 0.3s;
}

.hot-rank.top {
  background: var(--primary-gradient);
  color: white;
  animation: rankPop 0.5s ease-out;
}

@keyframes rankPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.hot-content {
  flex: 1;
  min-width: 0;
}

.hot-text {
  display: block;
  font-size: 14px;
  color: var(--text-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
  font-weight: 700;
}

.hot-meta {
  font-size: 11px;
  color: var(--text-light);
  font-weight: 600;
}

/* 帖子列表 */
.post-list {
  padding: 0 12px;
}

.post-card {
  background: white;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid var(--border-dark);
  box-shadow: 4px 4px 0px var(--border-dark);
  animation: fadeInUp 0.5s ease-out both;
}

.post-card:nth-child(1) { animation-delay: 0.15s; }
.post-card:nth-child(2) { animation-delay: 0.2s; }
.post-card:nth-child(3) { animation-delay: 0.25s; }
.post-card:nth-child(4) { animation-delay: 0.3s; }
.post-card:nth-child(5) { animation-delay: 0.35s; }

.post-card:active {
  transform: translate(3px, 3px);
  box-shadow: 1px 1px 0px var(--border-dark);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 900;
  color: white;
  flex-shrink: 0;
  border: 3px solid var(--border-dark);
  transition: transform 0.3s;
}

.post-card:active .author-avatar {
  transform: scale(1.1);
}

.author-info {
  flex: 1;
}

.author-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 3px;
}

.author-level {
  padding: 3px 10px;
  background: linear-gradient(135deg, #FFE066, #FFB347);
  border-radius: 10px;
  font-size: 10px;
  font-weight: 900;
  color: #664400;
  border: 2px solid var(--border-dark);
}

.post-time {
  font-size: 11px;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

.location {
  color: var(--primary);
  font-weight: 800;
}

.post-title {
  font-size: 16px;
  font-weight: 900;
  color: var(--text-dark);
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.post-text {
  font-size: 14px;
  color: var(--text-light);
  margin: 0 0 12px 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 600;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}

.post-img {
  width: 100%;
  padding-top: 75%;
  border-radius: 12px;
  background: var(--bg-gray);
  position: relative;
  overflow: hidden;
  border: 2px solid var(--border-dark);
}

.post-img.single {
  grid-column: span 2;
  padding-top: 60%;
}

.post-img img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.post-card:active .post-img img {
  transform: scale(1.05);
}

.more-images {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  border-radius: 10px;
  backdrop-filter: blur(4px);
}

.post-actions {
  display: flex;
  align-items: center;
  padding-top: 12px;
  border-top: 2px solid var(--bg-gray);
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-light);
  margin-right: 20px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 12px;
  transition: all 0.2s;
}

.action-item:active {
  background: var(--primary-light);
  color: var(--primary);
  transform: scale(0.95);
}

.action-item.share {
  margin-left: auto;
  margin-right: 0;
}

/* 发帖按钮 */
.fab-button {
  position: fixed;
  bottom: 85px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: var(--primary-gradient);
  border-radius: 30px;
  box-shadow: 0 8px 24px rgba(255, 125, 0, 0.4), 4px 4px 0px var(--border-dark);
  cursor: pointer;
  z-index: 50;
  transition: all 0.2s;
  border: 3px solid var(--border-dark);
  animation: fabFloat 3s ease-in-out infinite;
}

@keyframes fabFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.fab-button:active {
  transform: scale(0.93) translate(2px, 2px);
  box-shadow: 0 4px 12px rgba(255, 125, 0, 0.3), 2px 2px 0px var(--border-dark);
}

.fab-icon {
  font-size: 20px;
  animation: penWiggle 2s ease-in-out infinite;
}

@keyframes penWiggle {
  0%, 90%, 100% { transform: rotate(0deg); }
  92% { transform: rotate(-10deg); }
  94% { transform: rotate(10deg); }
  96% { transform: rotate(-10deg); }
  98% { transform: rotate(10deg); }
}

.fab-text {
  font-size: 15px;
  font-weight: 900;
  color: white;
  letter-spacing: 1px;
}
</style>
