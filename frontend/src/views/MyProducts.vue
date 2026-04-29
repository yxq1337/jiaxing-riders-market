<template>
  <div class="my-products">
    <van-nav-bar title="我的发布" left-arrow @click-left="goBack" />

    <div class="list-header">
      <span class="header-title">共发布 {{ products.length }} 件商品</span>
      <van-tag type="primary" size="small" plain @click="$router.push('/publish')">
        + 发布新商品
      </van-tag>
    </div>

    <div class="product-list" v-if="products.length > 0">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="goToDetail(product.id)"
      >
        <div class="product-media">
          <img :src="product.images?.split(',')[0] || defaultImage" :alt="product.title" />
          <div :class="['status-badge', product.status === 'active' ? 'active' : 'sold']">
            {{ product.status === 'active' ? '在售' : '已售出' }}
          </div>
        </div>
        <div class="product-content">
          <h3 class="product-title">{{ product.title }}</h3>
          <div class="product-meta">
            <span class="condition-tag">{{ product.condition }}</span>
            <span class="view-count">浏览 {{ product.view_count || 0 }}</span>
          </div>
          <div class="product-price">¥{{ product.price }}</div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <div class="empty-icon">📦</div>
      <p class="empty-text">你还没有发布过商品</p>
      <button class="empty-btn" @click="$router.push('/publish')">
        发布第一件商品
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productApi } from '../api'
import { showToast } from 'vant'

const router = useRouter()
const products = ref([])
const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjIiBmb250LXNpemU9IjUwIj7wn5mPC90ZXh0Pjwvc3ZnPg=='

const loadMyProducts = async () => {
  try {
    const res = await productApi.getMyList()
    products.value = res.data
  } catch (e) {
    showToast('加载失败')
  }
}

const goBack = () => {
  router.back()
}

const goToDetail = (id) => {
  router.push(`/product/${id}`)
}

onMounted(() => {
  loadMyProducts()
})
</script>

<style scoped>
.my-products {
  min-height: 100vh;
  background: var(--gray-50);
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  margin-bottom: 8px;
}

.header-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-700);
}

.product-list {
  padding: 12px;
}

.product-card {
  display: flex;
  gap: 14px;
  background: white;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.product-card:active {
  transform: scale(0.98);
}

.product-media {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--gray-100);
}

.product-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 6px;
  left: 6px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
}

.status-badge.active {
  background: var(--success);
  color: white;
}

.status-badge.sold {
  background: var(--gray-500);
  color: white;
}

.product-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.condition-tag {
  padding: 3px 8px;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.view-count {
  font-size: 11px;
  color: var(--gray-500);
}

.product-price {
  font-size: 22px;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.5px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 15px;
  color: var(--gray-500);
  margin: 0 0 24px 0;
}

.empty-btn {
  padding: 12px 32px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}
</style>
