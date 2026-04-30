<template>
  <div class="home">
    <!-- 顶部导航 -->
    <header class="navbar">
      <div class="nav-left">
        <div class="logo">JX</div>
        <span class="logo-text">嘉兴骑手社区</span>
      </div>
      <nav class="nav-center">
        <span
          v-for="(item, index) in navItems"
          :key="index"
          :class="['nav-item', { active: activeNav === index }]"
          @click="activeNav = index"
        >
          {{ item }}
        </span>
      </nav>
      <div class="nav-right">
        <span class="nav-icon">🔍</span>
        <span class="nav-btn" @click="$router.push('/login')">登录 / 注册</span>
        <span class="publish-btn">发布互助</span>
      </div>
    </header>

    <!-- 滚动通知条 -->
    <div class="notice-bar">
      <div class="notice-item">
        <span class="notice-icon">🔔</span>
        <span class="notice-label">嘉兴实时排雷:</span>
        <marquee class="notice-text">
          <span v-for="(notice, i) in notices" :key="i" class="notice-dot">
            🔴 {{ notice }}
          </span>
        </marquee>
      </div>
    </div>

    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">专为外卖与同城骑士打造</div>
        <h1 class="hero-title">
          风里雨里，<br />
          <span class="highlight">在这懂你。</span>
        </h1>
        <p class="hero-desc">
          不再担心找不到厕所，不再为小电驴突然没电发愁。<br />
          嘉兴上万名骑手的互助大本营，我们为你避坑指路。
        </p>
        <div class="hero-buttons">
          <button class="btn-primary">
            <span class="btn-icon">📍</span>
            寻找最近驿站
          </button>
          <button class="btn-secondary">
            <span class="btn-icon">💬</span>
            加入社群微信
          </button>
        </div>
      </div>

      <!-- 右侧情报卡片 -->
      <div class="intel-card">
        <div class="intel-header">
          <span class="intel-title">附近高频情报</span>
          <span class="intel-badge">实时更新</span>
        </div>
        <div class="intel-list">
          <div v-for="(item, index) in intelList" :key="index" class="intel-item">
            <span class="intel-icon">{{ item.type === 'warning' ? '⚠️' : '🔋' }}</span>
            <div class="intel-content">
              <div class="intel-title">{{ item.title }}</div>
              <div class="intel-desc">{{ item.desc }}</div>
            </div>
          </div>
        </div>
        <button class="intel-more">查看更多情报</button>
      </div>
    </section>

    <!-- SOS 悬浮按钮 -->
    <div class="sos-btn" @click="showSOS = true">
      <span>SOS 一键求援</span>
    </div>

    <!-- 用户头像悬浮 -->
    <div class="avatar-float">
      <div class="avatar-img">👩</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeNav = ref(0)
const navItems = ['首页', '驿站推荐', '必备工具', '优岗招募', '互助大厅']

const notices = [
  '秀洲区王江泾社区新开骑手驿站，提供免费热水姜汤',
  '广益路修路封路，送科技城请绕公交车道旁小路',
  '姚荡家换电站补充了20组满电电池，快去换'
]

const intelList = [
  {
    type: 'warning',
    title: '八佰伴负一楼外卖柜坏了',
    desc: '保安不让进，送上去要爬楼梯，当心超时！'
  },
  {
    type: 'battery',
    title: '南湖天地换电站刚补满',
    desc: '铁塔电池，现在去不用排队。'
  }
]
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 2px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo {
  width: 36px;
  height: 36px;
  background: #f5c842;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 16px;
  color: #1a1a2e;
}

.logo-text {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a2e;
}

.nav-center {
  display: flex;
  gap: 8px;
}

.nav-item {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-item.active {
  background: #f5c842;
  color: #1a1a2e;
  font-weight: 800;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-icon {
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
}

.nav-btn {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  padding: 8px 12px;
}

.publish-btn {
  padding: 10px 20px;
  background: #1a1a2e;
  color: white;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.publish-btn:hover {
  transform: scale(1.05);
  background: #2d2d4a;
}

/* 通知条 */
.notice-bar {
  background: #fff;
  padding: 10px 32px;
  border-bottom: 1px solid #eee;
}

.notice-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notice-icon {
  font-size: 18px;
}

.notice-label {
  font-size: 13px;
  font-weight: 700;
  color: #e74c3c;
  white-space: nowrap;
}

.notice-text {
  flex: 1;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.notice-dot {
  margin-right: 40px;
}

/* Hero 区域 */
.hero {
  display: flex;
  padding: 60px 80px;
  gap: 60px;
  min-height: 500px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  right: -100px;
  top: -50px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(245, 200, 66, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.hero-content {
  flex: 1;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 24px;
}

.hero-title {
  font-size: 64px;
  font-weight: 900;
  color: #fff;
  line-height: 1.1;
  margin: 0 0 20px 0;
}

.highlight {
  color: #f5c842;
}

.hero-desc {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 32px;
  font-weight: 500;
}

.hero-buttons {
  display: flex;
  gap: 16px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: #f5c842;
  border: 3px solid #e0b83a;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 800;
  color: #1a1a2e;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-2px, -2px);
}

.btn-icon {
  font-size: 20px;
}

/* 情报卡片 */
.intel-card {
  width: 340px;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(10px);
  z-index: 1;
}

.intel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.intel-title {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
}

.intel-badge {
  padding: 4px 10px;
  background: rgba(245, 200, 66, 0.2);
  color: #f5c842;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}

.intel-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.intel-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
}

.intel-item:first-child {
  border-color: rgba(245, 200, 66, 0.4);
  background: rgba(245, 200, 66, 0.1);
}

.intel-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.intel-content {
  flex: 1;
}

.intel-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.intel-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.intel-more {
  width: 100%;
  padding: 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.intel-more:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* SOS 悬浮按钮 */
.sos-btn {
  position: fixed;
  right: 32px;
  top: 280px;
  padding: 12px 20px;
  background: #e74c3c;
  color: white;
  border-radius: 20px 20px 0 20px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(231, 76, 60, 0.4);
  z-index: 100;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* 头像悬浮 */
.avatar-float {
  position: fixed;
  right: 32px;
  bottom: 100px;
  z-index: 100;
}

.avatar-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #f5c842;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.2s;
}

.avatar-img:hover {
  transform: scale(1.1);
}
</style>
