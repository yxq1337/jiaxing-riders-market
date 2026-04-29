<template>
  <div class="product-detail" v-if="product">
    <van-nav-bar left-arrow @click-left="goBack">
      <template #right>
        <div class="nav-actions">
          <span class="action-icon">🔗</span>
          <span class="action-icon">⭐</span>
        </div>
      </template>
    </van-nav-bar>

    <!-- 商品大图 -->
    <div class="image-gallery">
      <div class="main-image">
        <img :src="product.images?.split(',')[0] || defaultImage" :alt="product.title" />
        <div class="view-badge">
          <span>👁️ {{ product.view_count || 0 }} 浏览</span>
        </div>
      </div>
    </div>

    <!-- 价格卡片 -->
    <div class="price-card">
      <div class="price-row">
        <div class="price-wrap">
          <span class="currency">¥</span>
          <span class="price">{{ product.price }}</span>
        </div>
        <div class="tags-wrap">
          <span class="condition-tag">{{ product.condition }}</span>
          <span class="category-tag">{{ product.category }}</span>
        </div>
      </div>
      <h1 class="product-title">{{ product.title }}</h1>
      <p class="product-location" v-if="product.location">
        <span>📍</span> {{ product.location }}
      </p>
    </div>

    <!-- 卖家信息卡片 -->
    <div class="seller-card" @click="goToChat">
      <div class="seller-avatar">
        <span class="avatar-text">{{ product.seller_name?.charAt(0) || '?' }}</span>
      </div>
      <div class="seller-info">
        <div class="seller-name">{{ product.seller_name }}</div>
        <div class="seller-credit">
          <span class="credit-star">⭐</span>
          <span>信用分 {{ product.seller_credit || 100 }}</span>
        </div>
      </div>
      <div class="contact-btn">
        <span>💬 联系</span>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="desc-card">
      <h3 class="section-title">📝 商品描述</h3>
      <div class="desc-content">
        <p>{{ product.description || '卖家没有填写描述哦～' }}</p>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <button class="btn-secondary" @click="goToChat">
        <span class="btn-icon">💬</span>
        <span>私聊卖家</span>
      </button>
      <button class="btn-primary" @click="buyProduct">
        <span class="btn-price">¥{{ product.price }}</span>
        <span>立即购买</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productApi, orderApi } from '../api'
import { showToast, showConfirmDialog } from 'vant'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0ZGRkZDRiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjgwIj7wn4mPC90ZXh0Pjwvc3ZnPg=='

const loadProduct = async () => {
  try {
    const res = await productApi.getDetail(route.params.id)
    product.value = res.data
  } catch (e) {
    showToast('加载失败')
  }
}

const goBack = () => {
  router.back()
}

const goToChat = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }
  showToast('聊天功能即将开放')
}

const buyProduct = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    await showConfirmDialog({
      title: '🎉 确认购买',
      message: '请与卖家约定线下交易时间地点哦～',
      confirmButtonText: '确认购买',
      confirmButtonColor: 'var(--primary)'
    })

    await orderApi.create({ productId: product.value.id })
    showToast('订单创建成功！联系卖家吧 🎉')
    router.push('/profile')
  } catch (e) {
    if (e !== 'cancel') {
      showToast(e.response?.data?.error || '操作失败')
    }
  }
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-detail {
  background: var(--bg-gray);
  min-height: 100vh;
  padding-bottom: 110px;
}

.nav-actions {
  display: flex;
  gap: 12px;
}

.action-icon {
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.action-icon:active {
  transform: scale(0.9);
}

/* Image Gallery */
.image-gallery {
  background: white;
  border-bottom: 3px solid var(--border-dark);
}

.main-image {
  position: relative;
  width: 100%;
  height: 360px;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.view-badge {
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: 8px 14px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

/* Price Card */
.price-card {
  background: white;
  padding: 20px 16px;
  margin-bottom: 10px;
  border-bottom: 3px solid var(--border-dark);
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.price-wrap {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.currency {
  font-size: 20px;
  font-weight: 800;
  color: var(--primary);
}

.price {
  font-size: 40px;
  font-weight: 900;
  color: var(--primary);
  letter-spacing: -1px;
  line-height: 1;
}

.tags-wrap {
  display: flex;
  gap: 8px;
}

.condition-tag {
  padding: 6px 14px;
  background: var(--primary-gradient);
  border-radius: 20px;
  border: 2px solid var(--border-dark);
  font-size: 12px;
  font-weight: 700;
  color: white;
  box-shadow: 2px 2px 0px var(--border-dark);
}

.category-tag {
  padding: 6px 14px;
  background: white;
  border-radius: 20px;
  border: 2px solid var(--border-dark);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-dark);
}

.product-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-dark);
  margin: 0 0 10px 0;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.product-location {
  font-size: 13px;
  color: var(--text-gray);
  margin: 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Seller Card */
.seller-card {
  background: white;
  padding: 16px;
  margin-bottom: 10px;
  border-bottom: 3px solid var(--border-dark);
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.seller-card:active {
  background: var(--bg-gray);
}

.seller-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-pink) 0%, #FFB6C1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--border-dark);
  flex-shrink: 0;
}

.avatar-text {
  font-size: 22px;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
}

.seller-info {
  flex: 1;
}

.seller-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.seller-credit {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-gray);
  font-weight: 500;
}

.credit-star {
  font-size: 14px;
}

.contact-btn {
  padding: 10px 16px;
  background: var(--secondary);
  border-radius: 14px;
  border: 2px solid var(--border-dark);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-dark);
  transition: all 0.2s;
}

.contact-btn:active {
  transform: scale(0.95);
}

/* Description Card */
.desc-card {
  background: white;
  padding: 20px 16px;
  border-bottom: 3px solid var(--border-dark);
}

.section-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-dark);
  margin: 0 0 14px 0;
}

.desc-content p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-gray);
  margin: 0;
  font-weight: 500;
}

/* Bottom Bar */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 14px 16px;
  padding-bottom: calc(14px + env(safe-area-inset-bottom));
  display: flex;
  gap: 12px;
  border-top: 3px solid var(--border-dark);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.btn-secondary {
  flex: 1;
  height: 54px;
  border-radius: 16px;
  border: 3px solid var(--border-dark);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-dark);
  cursor: pointer;
  box-shadow: 3px 3px 0px var(--border-dark);
  transition: all 0.2s;
}

.btn-secondary:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px var(--border-dark);
}

.btn-icon {
  font-size: 18px;
}

.btn-primary {
  flex: 1.5;
  height: 54px;
  border-radius: 16px;
  border: 3px solid var(--border-dark);
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  box-shadow: 3px 3px 0px var(--border-dark);
  transition: all 0.2s;
}

.btn-primary:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px var(--border-dark);
}

.btn-price {
  font-size: 16px;
  font-weight: 900;
}
</style>
