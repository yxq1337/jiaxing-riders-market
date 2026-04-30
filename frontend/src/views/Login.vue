<template>
  <div class="login">
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
          登录
        </div>
        <div
          :class="['tab-item', { active: !isLogin }]"
          @click="isLogin = false"
        >
          注册
        </div>
      </div>

      <!-- 表单 -->
      <div class="form">
        <van-form @submit="onSubmit">
          <input
            v-model="form.phone"
            type="tel"
            placeholder="手机号"
            class="input"
          />

          <input
            v-model="form.password"
            type="password"
            placeholder="密码"
            class="input"
          />

          <input
            v-if="!isLogin"
            v-model="form.nickname"
            placeholder="昵称（选填）"
            class="input"
          />

          <button type="submit" class="submit-btn">
            {{ isLogin ? '登录' : '注册' }}
          </button>
        </van-form>

        <p class="tip">
          继续即表示同意 <span>用户协议</span> 和 <span>隐私政策</span>
        </p>
      </div>

      <!-- 随便看看 -->
      <div class="guest" @click="$router.push('/')">
        随便逛逛
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
    if (isLogin.value) {
      // 登录：Bmob 会返回 sessionToken
      await userApi.login({
        phone: form.phone,
        password: form.password
      })
    } else {
      // 注册
      await userApi.register({
        phone: form.phone,
        password: form.password,
        nickname: form.nickname
      })
      // 注册成功后自动登录
      await userApi.login({
        phone: form.phone,
        password: form.password
      })
    }

    showToast(isLogin.value ? '登录成功 🎉' : '注册成功 🎉')

    setTimeout(() => {
      router.push('/')
    }, 500)
  } catch (e) {
    console.error('登录/注册错误:', e)
    const msg = e?.response?.data?.error || e?.error || e?.message || '操作失败，请重试'
    showToast(msg)
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 24px;
}

.login-content {
  max-width: 400px;
  margin: 0 auto;
}

/* Logo */
.logo-section {
  text-align: center;
  padding: 60px 0 40px;
}

.logo-icon {
  font-size: 56px;
  margin-bottom: 12px;
  line-height: 1;
}

.logo-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 4px 0;
}

.logo-subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

/* Tab Switch */
.tab-switch {
  display: flex;
  border-bottom: 2px solid #eee;
  margin-bottom: 32px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.tab-item.active {
  color: var(--primary);
  border-color: var(--primary);
  font-weight: 600;
}

/* Form */
.form {
  margin-bottom: 24px;
}

.input {
  width: 100%;
  height: 50px;
  padding: 0 16px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  background: white;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
}

.input::placeholder {
  color: #bbb;
}

.submit-btn {
  width: 100%;
  height: 50px;
  margin-top: 8px;
  border: none;
  border-radius: 8px;
  background: var(--primary);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:active {
  opacity: 0.8;
}

.tip {
  text-align: center;
  font-size: 12px;
  color: #aaa;
  margin-top: 20px;
  line-height: 1.5;
}

.tip span {
  color: var(--primary);
}

/* Guest */
.guest {
  text-align: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  padding: 12px;
  transition: color 0.2s;
}

.guest:active {
  color: var(--primary);
}
</style>
