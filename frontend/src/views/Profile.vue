<template>
  <div class="profile">
    <!-- 顶部渐变区域 -->
    <div class="profile-header">
      <div class="user-card">
        <div class="avatar">
          <span class="avatar-text">{{ displayName.charAt(0) }}</span>
        </div>
        <div class="user-info">
          <h2 class="user-name">{{ displayName }}</h2>
          <p class="user-phone">{{ user?.phone }}</p>
        </div>
        <div class="credit-badge">
          <span class="credit-icon">⭐</span>
          <span class="credit-score">{{ user?.credit_score || 100 }}</span>
        </div>
      </div>

      <!-- 数据统计 -->
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-num">{{ stats.products }}</span>
          <span class="stat-label">发布</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">{{ stats.orders }}</span>
          <span class="stat-label">订单</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">{{ stats.favorites }}</span>
          <span class="stat-label">收藏</span>
        </div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-section">
      <div class="menu-card">
        <div class="menu-item" @click="$router.push('/my-products')">
          <div class="menu-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            📦
          </div>
          <div class="menu-content">
            <span class="menu-title">我的发布</span>
            <van-icon name="arrow" color="#BBB" size="18" />
          </div>
        </div>

        <div class="menu-item" @click="showToast('功能开发中')">
          <div class="menu-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            📋
          </div>
          <div class="menu-content">
            <span class="menu-title">我的订单</span>
            <van-icon name="arrow" color="#BBB" size="18" />
          </div>
        </div>

        <div class="menu-item" @click="showToast('功能开发中')">
          <div class="menu-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            ❤️
          </div>
          <div class="menu-content">
            <span class="menu-title">我的收藏</span>
            <van-icon name="arrow" color="#BBB" size="18" />
          </div>
        </div>

        <div class="menu-item" @click="showToast('功能开发中')">
          <div class="menu-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
            ⭐
          </div>
          <div class="menu-content">
            <span class="menu-title">我的评价</span>
            <van-icon name="arrow" color="#BBB" size="18" />
          </div>
        </div>
      </div>

      <div class="menu-card" style="margin-top: 12px;">
        <div class="menu-item" @click="showToast('功能开发中')">
          <div class="menu-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
            ⚙️
          </div>
          <div class="menu-content">
            <span class="menu-title">设置</span>
            <van-icon name="arrow" color="#BBB" size="18" />
          </div>
        </div>

        <div class="menu-item" @click="showToast('功能开发中')">
          <div class="menu-icon" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
            💬
          </div>
          <div class="menu-content">
            <span class="menu-title">帮助与反馈</span>
            <van-icon name="arrow" color="#BBB" size="18" />
          </div>
        </div>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <button class="logout-btn" @click="logout">
        <span>🚪</span>
        <span>退出登录</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userApi, productApi } from '../api'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const user = ref(null)
const stats = ref({
  products: 0,
  orders: 0,
  favorites: 0
})

const displayName = computed(() => {
  return user.value?.nickname || user.value?.phone?.slice(-4) || '骑手'
})

const loadProfile = async () => {
  try {
    const res = await userApi.getProfile()
    user.value = res.data
  } catch (e) {
    console.log('加载用户信息失败')
  }
}

const loadStats = async () => {
  try {
    const productsRes = await productApi.getMyList()
    stats.value.products = productsRes.data?.length || 0
  } catch (e) {
    console.log('加载统计失败')
  }
}

const logout = async () => {
  try {
    await showConfirmDialog({
      title: '👋 确认退出',
      message: '确定要退出登录吗？',
      confirmButtonColor: 'var(--primary)'
    })

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  } catch (e) {
    // 用户取消
  }
}

onMounted(() => {
  loadProfile()
  loadStats()
})
</script>

<style scoped>
.profile {
  min-height: 100vh;
  background: var(--bg-gray);
}

/* Profile Header */
.profile-header {
  background: var(--primary-gradient);
  padding: 20px 16px 30px;
  border-bottom: 3px solid var(--border-dark);
  animation: slideDown 0.5s ease-out;
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

.user-card {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid var(--border-dark);
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  animation: avatarPop 0.6s ease-out 0.1s both;
}

@keyframes avatarPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.avatar-text {
  font-size: 26px;
  font-weight: 900;
  color: var(--primary);
  text-transform: uppercase;
}

.user-info {
  flex: 1;
  animation: fadeInRight 0.5s ease-out 0.2s both;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.user-name {
  font-size: 20px;
  font-weight: 800;
  color: white;
  margin: 0 0 4px 0;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.15);
}

.user-phone {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 600;
}

.credit-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: white;
  border-radius: 20px;
  border: 2px solid var(--border-dark);
  box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.15);
  animation: bounceIn 0.5s ease-out 0.3s both;
}

@keyframes bounceIn {
  0% { transform: scale(0); }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.credit-icon {
  font-size: 14px;
  animation: starSpin 3s ease-in-out infinite;
}

@keyframes starSpin {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
}

.credit-score {
  font-size: 14px;
  font-weight: 900;
  color: var(--text-dark);
}

/* Stats Row */
.stats-row {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  padding: 16px 0;
  animation: fadeInUp 0.5s ease-out 0.2s both;
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

.stat-item {
  flex: 1;
  text-align: center;
  transition: transform 0.2s;
}

.stat-item:active {
  transform: scale(1.1);
}

.stat-num {
  display: block;
  font-size: 24px;
  font-weight: 900;
  color: white;
  margin-bottom: 4px;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.4);
}

/* Menu Section */
.menu-section {
  padding: 16px 16px 0;
  margin-top: -20px;
  position: relative;
  z-index: 10;
}

.menu-card {
  background: white;
  border-radius: 20px;
  border: 3px solid var(--border-dark);
  overflow: hidden;
  box-shadow: 4px 4px 0px var(--border-dark);
  animation: fadeInUp 0.5s ease-out 0.35s both;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-item:not(:last-child) {
  border-bottom: 2px solid #f0f0f0;
}

.menu-item:active {
  background: var(--primary-light);
  transform: translateX(4px);
}

.menu-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  border: 3px solid var(--border-dark);
  transition: transform 0.2s;
}

.menu-item:active .menu-icon {
  transform: scale(1.1) rotate(5deg);
}

.menu-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-dark);
}

/* Logout Section */
.logout-section {
  padding: 20px 16px 40px;
}

.logout-btn {
  width: 100%;
  height: 54px;
  border: 3px solid var(--border-dark);
  border-radius: 16px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 800;
  color: var(--accent-pink);
  cursor: pointer;
  box-shadow: 3px 3px 0px var(--border-dark);
  transition: all 0.2s;
  animation: fadeInUp 0.5s ease-out 0.45s both;
}

.logout-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px 0px var(--border-dark);
  background: var(--accent-pink);
  color: white;
}
</style>
