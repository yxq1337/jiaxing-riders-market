<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <van-tabbar v-model="active" route v-if="showTabbar" class="tabbar">
      <van-tabbar-item to="/">
        <template #icon="{ active }">
          <span class="icon">{{ active ? '💬' : '🗣️' }}</span>
        </template>
        <span class="label">论坛</span>
      </van-tabbar-item>

      <van-tabbar-item to="/market">
        <template #icon="{ active }">
          <span class="icon">{{ active ? '🛒' : '🏪' }}</span>
        </template>
        <span class="label">集市</span>
      </van-tabbar-item>

      <van-tabbar-item to="/publish" class="publish">
        <template #icon>
          <div class="publish-btn">
            <span>+</span>
          </div>
        </template>
        <span class="label publish-label">发布</span>
      </van-tabbar-item>

      <van-tabbar-item to="/messages">
        <template #icon="{ active }">
          <div class="msg-wrap">
            <span class="icon">{{ active ? '💬' : '💭' }}</span>
            <span class="badge">9</span>
          </div>
        </template>
        <span class="label">消息</span>
      </van-tabbar-item>

      <van-tabbar-item to="/profile">
        <template #icon="{ active }">
          <span class="icon">{{ active ? '👤' : '🗿' }}</span>
        </template>
        <span class="label">我的</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref(route.path)

const showTabbar = computed(() => {
  const hidePages = ['/login', '/chat']
  return !hidePages.some(page => route.path.startsWith(page))
})
</script>

<style>
:root {
  --primary: #FF7D00;
  --primary-dark: #E67000;
  --primary-light: #FFF0E0;
  --primary-gradient: linear-gradient(135deg, #FF7D00 0%, #FFB74D 100%);
  --accent-pink: #FF4D6D;
  --accent-green: #00C48C;
  --accent-blue: #0084FF;
  --text-dark: #1A1A2E;
  --text-light: #8A8A9A;
  --bg-gray: #F5F5F7;
  --border-dark: #2D2D3F;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  background: var(--bg-gray);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-gray);
  -webkit-font-smoothing: antialiased;
}

.app {
  min-height: 100vh;
  padding-bottom: 60px;
}

/* Page Transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* 底部导航 - 简洁版 */
.tabbar {
  height: 60px !important;
  padding-bottom: 8px;
  padding-top: 8px;
  background: white !important;
  box-shadow: 0 -4px 0px var(--border-dark) !important;
  border-top: 3px solid var(--border-dark) !important;
}

.tabbar .van-tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.icon {
  font-size: 22px;
  transition: all 0.3s;
}

.van-tabbar-item--active .icon {
  transform: scale(1.15);
  animation: iconBounce 0.5s ease-out;
}

@keyframes iconBounce {
  0% { transform: scale(1); }
  30% { transform: scale(1.3); }
  50% { transform: scale(0.9); }
  70% { transform: scale(1.15); }
  100% { transform: scale(1.15); }
}

.label {
  font-size: 10px;
  color: var(--text-light);
  font-weight: 700;
  transition: all 0.3s;
}

.van-tabbar-item--active .label {
  color: var(--primary);
  font-weight: 900;
}

/* 发布按钮 */
.publish .publish-btn {
  width: 48px;
  height: 32px;
  margin-top: -12px;
  background: linear-gradient(135deg, #FFE81A 0%, #FFB700 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
  color: var(--text-dark);
  border: 3px solid var(--border-dark);
  box-shadow: 2px 2px 0px var(--border-dark);
  animation: publishPulse 2s ease-in-out infinite;
  transition: all 0.2s;
}

.van-tabbar-item--active .publish-btn {
  animation: publishBounce 0.5s ease-out;
}

@keyframes publishPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes publishBounce {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.2) rotate(-10deg); }
  50% { transform: scale(0.9) rotate(10deg); }
  75% { transform: scale(1.1) rotate(-5deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.publish-label {
  color: var(--primary);
  font-weight: 900;
}

/* 消息角标 */
.msg-wrap {
  position: relative;
}

.badge {
  position: absolute;
  top: -4px;
  right: -8px;
  min-width: 14px;
  height: 14px;
  padding: 0 4px;
  background: var(--accent-pink);
  border-radius: 8px;
  font-size: 9px;
  font-weight: 900;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  animation: badgePulse 1.5s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* Vant 基础样式 */
.van-nav-bar {
  background: white !important;
  border-bottom: 3px solid var(--border-dark) !important;
}

.van-nav-bar__title {
  font-weight: 800 !important;
  font-size: 17px !important;
  color: var(--text-dark) !important;
}

.van-button--primary {
  background: var(--primary-gradient) !important;
  border: 3px solid var(--border-dark) !important;
  border-radius: 16px !important;
  font-weight: 700;
  box-shadow: 3px 3px 0px var(--border-dark);
}
</style>
