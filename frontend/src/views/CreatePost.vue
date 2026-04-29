<template>
  <div class="create-post">
    <van-nav-bar
      title="发布帖子"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="form">
      <!-- 板块选择 -->
      <div class="section-select">
        <span class="label">选择板块</span>
        <div class="section-list">
          <div
            v-for="(s, i) in sections"
            :key="i"
            :class="['section-item', { active: selectedSection === i }]"
            @click="selectedSection = i"
          >
            <span class="section-icon">{{ s.icon }}</span>
            <span class="section-name">{{ s.name }}</span>
          </div>
        </div>
      </div>

      <!-- 标题 -->
      <div class="input-group">
        <label class="label">帖子标题</label>
        <input
          v-model="form.title"
          class="title-input"
          placeholder="写一个吸引人的标题..."
          maxlength="50"
        />
        <span class="char-count">{{ form.title.length }}/50</span>
      </div>

      <!-- 内容 -->
      <div class="input-group">
        <label class="label">正文内容</label>
        <textarea
          v-model="form.content"
          class="content-textarea"
          placeholder="分享你的见闻、经验或求助..."
          rows="8"
          maxlength="500"
        />
        <span class="char-count">{{ form.content.length }}/500</span>
      </div>

      <!-- 位置 -->
      <div class="input-group">
        <label class="label">📍 位置</label>
        <input
          v-model="form.location"
          class="location-input"
          placeholder="选填，例如：南湖区、嘉善县..."
        />
      </div>

      <!-- 图片上传 -->
      <div class="input-group">
        <label class="label">📷 图片 (最多3张)</label>
        <div class="image-upload">
          <div
            v-for="(img, idx) in images"
            :key="idx"
            class="preview-item"
          >
            <img :src="img" class="preview-img" />
            <button class="remove-btn" @click="removeImage(idx)">✕</button>
          </div>
          <div v-if="images.length < 3" class="add-btn" @click="addImage">
            <span class="add-icon">+</span>
            <span class="add-text">添加图片</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 发布按钮 -->
    <div class="submit-wrap">
      <button
        class="submit-btn"
        :class="{ disabled: !canSubmit }"
        :disabled="!canSubmit || submitting"
        @click="handleSubmit"
      >
        {{ submitting ? '发布中...' : '✍️ 发布帖子' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { postApi } from '../api'

const router = useRouter()

const selectedSection = ref(1)
const submitting = ref(false)

const form = ref({
  title: '',
  content: '',
  location: ''
})

const images = ref([])

const sections = [
  { name: '首页', icon: '🏠' },
  { name: '路况播报', icon: '🛣️' },
  { name: '二手交易', icon: '🛒' },
  { name: '求职招聘', icon: '💼' },
  { name: '互帮互助', icon: '🤝' },
  { name: '闲聊灌水', icon: '💬' },
]

const canSubmit = computed(() => {
  return form.value.title.trim().length >= 5 && form.value.content.trim().length >= 10
})

const addImage = () => {
  if (images.value.length >= 3) {
    showToast('最多只能上传3张图片')
    return
  }
  images.value.push(`https://picsum.photos/400/300?random=${Date.now()}`)
}

const removeImage = (idx) => {
  images.value.splice(idx, 1)
}

const handleSubmit = async () => {
  if (!canSubmit.value || submitting.value) return

  submitting.value = true
  try {
    const data = {
      title: form.value.title,
      content: form.value.content,
      section: sections[selectedSection.value].name,
      location: form.value.location,
      images: images.value.join(',')
    }

    await postApi.create(data)
    showToast('发布成功')
    router.replace('/')
  } catch (e) {
    showToast('发布失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.create-post {
  min-height: 100vh;
  background: var(--bg-gray);
  padding-bottom: 100px;
}

:deep(.van-nav-bar) {
  border-bottom: 3px solid var(--border-dark) !important;
}

.form {
  padding: 16px;
}

/* 板块选择 */
.section-select {
  background: white;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 16px;
  border: 3px solid var(--border-dark);
  box-shadow: 4px 4px 0px var(--border-dark);
  animation: fadeInUp 0.4s ease-out;
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

.label {
  display: block;
  font-size: 15px;
  font-weight: 900;
  color: var(--text-dark);
  margin-bottom: 12px;
}

.section-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.section-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: var(--bg-gray);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid transparent;
}

.section-item:active {
  transform: scale(0.95);
}

.section-item.active {
  background: var(--primary-light);
  border-color: var(--primary);
  box-shadow: 2px 2px 0px var(--primary);
}

.section-icon {
  font-size: 24px;
}

.section-name {
  font-size: 12px;
  font-weight: 800;
  color: var(--text-dark);
}

/* 输入组 */
.input-group {
  background: white;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 16px;
  border: 3px solid var(--border-dark);
  box-shadow: 4px 4px 0px var(--border-dark);
  animation: fadeInUp 0.4s ease-out both;
}

.input-group:nth-child(2) { animation-delay: 0.05s; }
.input-group:nth-child(3) { animation-delay: 0.1s; }
.input-group:nth-child(4) { animation-delay: 0.15s; }
.input-group:nth-child(5) { animation-delay: 0.2s; }

.title-input,
.location-input {
  width: 100%;
  padding: 14px 16px;
  border: 3px solid var(--border-dark);
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  outline: none;
  background: var(--bg-gray);
  transition: all 0.2s;
}

.title-input:focus,
.location-input:focus {
  border-color: var(--primary);
  background: white;
}

.content-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 3px solid var(--border-dark);
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  outline: none;
  background: var(--bg-gray);
  resize: none;
  font-family: inherit;
  transition: all 0.2s;
}

.content-textarea:focus {
  border-color: var(--primary);
  background: white;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 12px;
  color: var(--text-light);
  font-weight: 700;
  margin-top: 8px;
}

/* 图片上传 */
.image-upload {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.preview-item {
  position: relative;
  width: 100px;
  height: 100px;
}

.preview-img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
  border: 3px solid var(--border-dark);
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent-pink);
  color: white;
  border: 3px solid var(--border-dark);
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-btn:active {
  transform: scale(0.9);
}

.add-btn {
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: var(--bg-gray);
  border: 3px dashed var(--text-light);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:active {
  transform: scale(0.95);
  border-color: var(--primary);
  background: var(--primary-light);
}

.add-icon {
  font-size: 28px;
  color: var(--text-light);
  font-weight: 900;
}

.add-text {
  font-size: 11px;
  color: var(--text-light);
  font-weight: 700;
}

/* 发布按钮 */
.submit-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: white;
  border-top: 3px solid var(--border-dark);
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: var(--primary-gradient);
  color: white;
  border: 3px solid var(--border-dark);
  border-radius: 16px;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 4px 4px 0px var(--border-dark);
  transition: all 0.2s;
}

.submit-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--border-dark);
}

.submit-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
