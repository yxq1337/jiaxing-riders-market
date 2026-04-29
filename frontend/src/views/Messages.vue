<template>
  <div class="messages">
    <van-nav-bar title="消息" />

    <div class="conversation-list">
      <div
        v-for="conv in conversations"
        :key="conv.other_user_id"
        class="conversation-item"
        @click="goToChat(conv.other_user_id)"
      >
        <div class="avatar">
          <span class="avatar-text">{{ conv.other_user_name?.charAt(0) || '?' }}</span>
        </div>
        <div class="conversation-content">
          <div class="conversation-header">
            <span class="user-name">{{ conv.other_user_name }}</span>
            <span class="message-time">{{ formatTime(conv.last_message_time) }}</span>
          </div>
          <div class="message-preview">
            <span v-if="conv.product_title" class="product-tag">{{ conv.product_title }}</span>
            <span class="message-text">{{ conv.last_message || '暂无消息' }}</span>
          </div>
        </div>
        <van-icon name="arrow" color="#C0C4CC" />
      </div>

      <div v-if="conversations.length === 0" class="empty-state">
        <div class="empty-icon">💬</div>
        <p class="empty-text">暂无消息</p>
        <p class="empty-hint">去商品详情联系卖家吧</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { messageApi } from '../api'
import { showToast } from 'vant'

const router = useRouter()
const conversations = ref([])

const loadConversations = async () => {
  try {
    const res = await messageApi.getConversations()
    conversations.value = res.data
  } catch (e) {
    console.log('加载消息失败')
  }
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return date.toLocaleDateString()
}

const goToChat = (userId) => {
  router.push(`/chat/${userId}`)
}

onMounted(() => {
  loadConversations()
})
</script>

<style scoped>
.messages {
  min-height: 100vh;
  background: var(--bg-gray);
  padding-bottom: 80px;
}

.conversation-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  border: 3px solid var(--border-dark);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 3px 3px 0px var(--border-dark);
}

.conversation-item:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px var(--border-dark);
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 3px solid var(--border-dark);
}

.avatar-text {
  font-size: 18px;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
}

.conversation-content {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.user-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-dark);
}

.message-time {
  font-size: 11px;
  color: var(--text-light);
  font-weight: 600;
}

.message-preview {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-tag {
  padding: 3px 10px;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
  border: 2px solid var(--border-dark);
}

.message-text {
  font-size: 13px;
  color: var(--text-light);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 24px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-text {
  font-size: 17px;
  font-weight: 800;
  color: var(--text-dark);
  margin: 0 0 6px 0;
}

.empty-hint {
  font-size: 14px;
  color: var(--text-light);
  margin: 0;
  font-weight: 600;
}
</style>
