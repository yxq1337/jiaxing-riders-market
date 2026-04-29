<template>
  <div class="chat">
    <van-nav-bar :title="otherUserName" left-arrow @click-left="goBack" />

    <div class="messages-container" ref="messagesContainer">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['message', msg.from_user_id === currentUserId ? 'self' : 'other']"
      >
        <div class="avatar" v-if="msg.from_user_id !== currentUserId">
          <span class="avatar-text">{{ msg.from_user_name?.charAt(0) || '?' }}</span>
        </div>

        <div class="message-bubble">
          <div class="message-content">{{ msg.content }}</div>
          <div class="message-time">{{ formatTime(msg.created_at) }}</div>
        </div>

        <div class="avatar" v-if="msg.from_user_id === currentUserId">
          <span class="avatar-text">{{ '我'.charAt(0) }}</span>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <van-field
        v-model="messageText"
        placeholder="输入消息..."
        :border="false"
        @keyup.enter="sendMessage"
      />
      <button class="send-btn" @click="sendMessage" :disabled="!messageText.trim()">
        <span>发送</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { messageApi } from '../api'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const messages = ref([])
const messageText = ref('')
const otherUserName = ref('用户')
const messagesContainer = ref(null)

const currentUserId = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.id
})

const loadMessages = async () => {
  try {
    const res = await messageApi.getConversation(route.params.userId)
    messages.value = res.data

    if (messages.value.length > 0) {
      const lastMsg = messages.value[messages.value.length - 1]
      otherUserName.value = lastMsg.from_user_id === currentUserId.value
        ? lastMsg.to_user_name
        : lastMsg.from_user_name
    }

    nextTick(() => {
      scrollToBottom()
    })
  } catch (e) {
    console.log('加载消息失败')
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const sendMessage = async () => {
  if (!messageText.value.trim()) return

  try {
    await messageApi.send({
      toUserId: route.params.userId,
      content: messageText.value.trim()
    })

    messageText.value = ''
    loadMessages()
  } catch (e) {
    showToast('发送失败')
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadMessages()
})
</script>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-gray);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: var(--bg-gray);
}

.message {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 16px;
  animation: messageSlide 0.3s ease-out;
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.self {
  flex-direction: row-reverse;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid var(--border-dark);
}

.message.self .avatar {
  background: var(--primary-gradient);
}

.avatar-text {
  font-size: 14px;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
}

.message-bubble {
  max-width: 70%;
}

.message-content {
  padding: 12px 16px;
  border-radius: 18px;
  background: white;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-dark);
  word-break: break-word;
  border: 3px solid var(--border-dark);
  font-weight: 600;
}

.message:not(.self) .message-content {
  border-bottom-left-radius: 6px;
}

.message.self .message-content {
  background: var(--primary-gradient);
  color: white;
  border-bottom-right-radius: 6px;
}

.message-time {
  font-size: 10px;
  color: var(--text-light);
  margin-top: 6px;
  font-weight: 600;
}

.message.self .message-time {
  text-align: right;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: white;
  gap: 12px;
  border-top: 3px solid var(--border-dark);
}

.chat-input :deep(.van-field) {
  flex: 1;
  background: var(--bg-gray);
  border-radius: 20px;
  padding: 10px 16px;
  border: 2px solid var(--border-dark);
  font-weight: 600;
}

.send-btn {
  height: 42px;
  padding: 0 20px;
  border: 3px solid var(--border-dark);
  border-radius: 21px;
  background: var(--primary-gradient);
  font-size: 14px;
  font-weight: 800;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 2px 2px 0px var(--border-dark);
}

.send-btn:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px var(--border-dark);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
