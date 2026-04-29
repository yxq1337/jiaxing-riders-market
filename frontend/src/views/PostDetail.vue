<template>
  <div class="post-detail">
    <van-nav-bar
      title="帖子详情"
      left-arrow
      @click-left="$router.back()"
    />

    <div v-if="loading" class="loading">加载中...</div>

    <div v-if="post" class="content">
      <!-- 帖子内容 -->
      <div class="post-card">
        <div class="post-header">
          <div class="author-avatar">
            <span>{{ (post.authorName || '匿名').charAt(0) }}</span>
          </div>
          <div class="author-info">
            <div class="author-name">
              <span>{{ post.authorName || '匿名用户' }}</span>
            </div>
            <div class="post-time">
              <span class="location">📍 {{ post.location || '嘉兴' }}</span>
              <span>·</span>
              <span>{{ formatTime(post.createdAt) }}</span>
            </div>
          </div>
        </div>

        <h1 class="post-title">{{ post.title }}</h1>
        <p class="post-text">{{ post.content }}</p>

        <div v-if="postImages.length" class="post-images">
          <img
            v-for="(img, idx) in postImages"
            :key="idx"
            :src="img"
            class="post-img"
          />
        </div>

        <div class="post-stats">
          <span>👁️ {{ post.likes + 100 }} 浏览</span>
          <span>💬 {{ post.replies_count || 0 }} 回复</span>
          <span>👍 {{ post.likes }} 点赞</span>
        </div>

        <div class="post-actions">
          <button class="action-btn" :class="{ liked }" @click="handleLike">
            <span>{{ liked ? '❤️' : '🤍' }}</span>
            <span>{{ liked ? post.likes + 1 : post.likes }}</span>
          </button>
          <button class="action-btn">
            <span>⭐</span>
            <span>收藏</span>
          </button>
          <button class="action-btn share-btn">
            <span>📤</span>
            <span>分享</span>
          </button>
        </div>
      </div>

      <!-- 回复列表 -->
      <div class="replies-section">
        <div class="replies-header">
          <span class="replies-title">全部回复</span>
          <span class="replies-count">({{ replies.length }})</span>
        </div>

        <div v-if="replies.length === 0" class="no-replies">
          <span class="no-replies-icon">💬</span>
          <span class="no-replies-text">还没有回复，快来抢沙发~</span>
        </div>

        <div v-for="reply in replies" :key="reply.objectId" class="reply-item">
          <div class="reply-avatar">
            <span>{{ (reply.authorName || 'R').charAt(0) }}</span>
          </div>
          <div class="reply-content">
            <div class="reply-author">
              <span>{{ reply.authorName || '匿名用户' }}</span>
              <span class="reply-time">{{ formatTime(reply.createdAt) }}</span>
            </div>
            <p class="reply-text">{{ reply.content }}</p>
            <div class="reply-actions">
              <button class="reply-action-btn">
                <span>👍</span>
                <span>{{ reply.likes || 0 }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 回复输入框 -->
    <div class="reply-input-wrap">
      <input
        v-model="replyContent"
        class="reply-input"
        placeholder="说点什么..."
        @keyup.enter="submitReply"
      />
      <button class="send-btn" @click="submitReply" :disabled="!replyContent.trim()">
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { postApi } from '../api'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const replies = ref([])
const loading = ref(false)
const liked = ref(false)
const replyContent = ref('')

const level = computed(() => 1)

const postImages = computed(() => {
  if (!post.value?.images) return []
  return post.value.images.split(',').filter(i => i)
})

const formatTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
}

const loadPost = async () => {
  loading.value = true
  try {
    const res = await postApi.getDetail(route.params.id)
    post.value = res.data.post
    replies.value = res.data.replies || []
  } catch (e) {
    console.error('加载帖子失败', e)
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

const handleLike = async () => {
  if (liked.value) return
  try {
    await postApi.like(route.params.id)
    liked.value = true
    showToast('点赞成功')
  } catch (e) {
    showToast('点赞失败')
  }
}

const submitReply = async () => {
  if (!replyContent.value.trim()) return
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }
  try {
    const res = await postApi.reply(route.params.id, { content: replyContent.value })
    const newReply = res.data
    newReply.objectId = newReply.objectId || Date.now().toString()
    replies.value.unshift(newReply)
    replyContent.value = ''
    post.value.replies_count = (post.value.replies_count || 0) + 1
    showToast('回复成功')
  } catch (e) {
    console.error('回复失败', e)
    showToast('回复失败')
  }
}

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.post-detail {
  min-height: 100vh;
  background: var(--bg-gray);
  padding-bottom: 80px;
}

:deep(.van-nav-bar) {
  border-bottom: 3px solid var(--border-dark) !important;
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--text-light);
  font-weight: 700;
}

.content {
  padding: 12px;
}

.post-card {
  background: white;
  border-radius: 18px;
  padding: 16px;
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

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
  color: white;
  flex-shrink: 0;
  border: 3px solid var(--border-dark);
}

.author-info {
  flex: 1;
}

.author-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.author-level {
  padding: 4px 12px;
  background: linear-gradient(135deg, #FFE066, #FFB347);
  border-radius: 12px;
  font-size: 11px;
  font-weight: 900;
  color: #664400;
  border: 2px solid var(--border-dark);
}

.post-time {
  font-size: 12px;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.location {
  color: var(--primary);
  font-weight: 800;
}

.post-title {
  font-size: 20px;
  font-weight: 900;
  color: var(--text-dark);
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.post-text {
  font-size: 15px;
  color: var(--text-dark);
  margin: 0 0 16px 0;
  line-height: 1.8;
  font-weight: 600;
}

.post-images {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.post-img {
  width: 100%;
  border-radius: 12px;
  border: 3px solid var(--border-dark);
}

.post-stats {
  display: flex;
  gap: 20px;
  padding: 12px 0;
  border-top: 2px solid var(--bg-gray);
  border-bottom: 2px solid var(--bg-gray);
  font-size: 13px;
  color: var(--text-light);
  font-weight: 700;
}

.post-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: var(--bg-gray);
  border: 3px solid var(--border-dark);
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  color: var(--text-dark);
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:active {
  transform: translate(2px, 2px);
}

.action-btn.liked {
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  color: white;
}

.share-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

/* 回复区域 */
.replies-section {
  margin-top: 16px;
  background: white;
  border-radius: 18px;
  border: 3px solid var(--border-dark);
  box-shadow: 4px 4px 0px var(--border-dark);
  overflow: hidden;
  animation: fadeInUp 0.4s ease-out 0.1s both;
}

.replies-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 16px;
  border-bottom: 2px solid var(--bg-gray);
}

.replies-title {
  font-size: 16px;
  font-weight: 900;
  color: var(--text-dark);
}

.replies-count {
  font-size: 14px;
  color: var(--text-light);
  font-weight: 700;
}

.no-replies {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
}

.no-replies-icon {
  font-size: 48px;
  opacity: 0.3;
}

.no-replies-text {
  font-size: 14px;
  color: var(--text-light);
  font-weight: 700;
}

.reply-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 2px solid var(--bg-gray);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.reply-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 900;
  color: white;
  flex-shrink: 0;
  border: 2px solid var(--border-dark);
}

.reply-content {
  flex: 1;
  min-width: 0;
}

.reply-author {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.reply-author span:first-child {
  font-size: 14px;
  font-weight: 800;
  color: var(--text-dark);
}

.reply-time {
  font-size: 11px;
  color: var(--text-light);
  font-weight: 600;
}

.reply-text {
  font-size: 14px;
  color: var(--text-dark);
  margin: 0 0 8px 0;
  line-height: 1.6;
  font-weight: 600;
}

.reply-actions {
  display: flex;
  gap: 16px;
}

.reply-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-light);
  font-weight: 700;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.reply-action-btn:active {
  background: var(--primary-light);
  color: var(--primary);
}

/* 回复输入框 */
.reply-input-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-top: 3px solid var(--border-dark);
  z-index: 100;
}

.reply-input {
  flex: 1;
  padding: 12px 16px;
  border: 3px solid var(--border-dark);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  outline: none;
  background: var(--bg-gray);
  transition: all 0.2s;
}

.reply-input:focus {
  border-color: var(--primary);
  background: white;
}

.send-btn {
  padding: 12px 24px;
  background: var(--primary-gradient);
  color: white;
  border: 3px solid var(--border-dark);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:active {
  transform: translate(2px, 2px);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
