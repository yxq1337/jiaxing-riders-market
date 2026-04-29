<template>
  <div class="login">
    <!-- 背景装饰 -->
    <div class="bg-circle circle-1"></div>
    <div class="bg-circle circle-2"></div>
    <div class="bg-circle circle-3"></div>

    <div class="login-content">
      <!-- Logo 区域 -->
      <div class="logo-section">
        <div class="logo-icon">🛵</div>
        <h1 class="logo-title">骑手集市</h1>
        <p class="logo-subtitle">骑手专属二手交易平台</p>
      </div>

      <!-- 切换标签 -->
      <div class="tab-switch">
        <div
          :class="['tab-item', { active: isLogin }]"
          @click="isLogin = true"
        >
          <span>登录</span>
        </div>
        <div
          :class="['tab-item', { active: !isLogin }]"
          @click="isLogin = false"
        >
          <span>注册</span>
        </div>
      </div>

      <!-- 表单卡片 -->
      <div class="form-card">
        <van-form @submit="onSubmit">
          <div class="input-group">
            <div class="input-icon">📱</div>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="手机号"
              class="form-input"
            />
          </div>

          <div class="input-group">
            <div class="input-icon">🔐</div>
            <input
              v-model="form.password"
              type="password"
              placeholder="密码"
              class="form-input"
            />
          </div>

          <div class="input-group" v-if="!isLogin">
            <div class="input-icon">👤</div>
            <input
              v-model="form.nickname"
              placeholder="昵称（选填）"
              class="form-input"
            />
          </div>

          <button type="submit" class="submit-btn">
            <span class="btn-text">{{ isLogin ? '立即登录' : '立即注册' }}</span>
          </button>
        </van-form>

        <p class="agreement-text">
          继续即表示同意 <span>用户协议</span> 和 <span>隐私政策</span>
        </p>
      </div>

      <!-- 随便看看按钮 -->
      <div class="guest-entry" @click="$router.push('/')">
        <span class="guest-icon">👀</span>
        <span>随便逛逛</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '../api'
import { showToast } from 'vant'

const router = useRouter()
const isLogin = ref(true)
const form = reactive({
  phone: '',
  password: '',
  nickname: ''
})

const onSubmit = async () => {
  if (!form.phone || !form.password) {
    showToast('请填写手机号和密码')
    return
  }

  try {
    const api = isLogin.value ? userApi.login : userApi.register
    const res = await api({
      phone: form.phone,
      password: form.password,
      nickname: form.nickname
    })

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))

    showToast(isLogin.value ? '登录成功 🎉' : '注册成功 🎉')

    setTimeout(() => {
      router.push('/')
    }, 500)
  } catch (e) {
    showToast(e.response?.data?.error || '操作失败，请重试')
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: linear-gradient(180deg, #FF7D00 0%, #FFB74D 50%, #FFF8E1 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  right: -50px;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: 100px;
  left: -40px;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 300px;
  right: 20px;
  animation: float 5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

.login-content {
  position: relative;
  z-index: 10;
}

/* Logo Section */
.logo-section {
  text-align: center;
  padding: 40px 0 30px;
}

.logo-icon {
  font-size: 72px;
  margin-bottom: 16px;
  display: inline-block;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0) rotate(-8deg); }
  50% { transform: translateY(-15px) rotate(8deg); }
}

.logo-title {
  font-size: 32px;
  font-weight: 900;
  color: white;
  margin: 0 0 6px 0;
  letter-spacing: 2px;
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.15);
}

.logo-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 500;
}

/* Tab Switch */
.tab-switch {
  display: flex;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 6px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s;
}

.tab-item.active {
  background: white;
  color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 24px;
  border: 3px solid var(--border-dark);
  padding: 30px 24px;
  box-shadow: 6px 6px 0px var(--border-dark);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--bg-gray);
  border-radius: 14px;
  border: 2px solid var(--border-dark);
  margin-bottom: 14px;
  transition: all 0.3s;
}

.input-group:focus-within {
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 4px rgba(255, 125, 0, 0.1);
}

.input-icon {
  font-size: 20px;
  opacity: 0.8;
}

.form-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-dark);
}

.form-input::placeholder {
  color: var(--text-light);
}

.submit-btn {
  width: 100%;
  height: 56px;
  border: 3px solid var(--border-dark);
  border-radius: 16px;
  background: var(--primary-gradient);
  margin-top: 10px;
  cursor: pointer;
  box-shadow: 4px 4px 0px var(--border-dark);
  transition: all 0.2s;
}

.submit-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 1px 1px 0px var(--border-dark);
}

.btn-text {
  font-size: 16px;
  font-weight: 800;
  color: white;
  letter-spacing: 2px;
}

.agreement-text {
  text-align: center;
  font-size: 12px;
  color: var(--text-light);
  margin: 20px 0 0 0;
  line-height: 1.5;
}

.agreement-text span {
  color: var(--primary);
  font-weight: 600;
}

/* Guest Entry */
.guest-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  padding: 14px 24px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  border: 2px solid var(--border-dark);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-gray);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 3px 3px 0px var(--border-dark);
}

.guest-entry:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px var(--border-dark);
}

.guest-icon {
  font-size: 18px;
}
</style>
