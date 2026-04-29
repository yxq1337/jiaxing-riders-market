<template>
  <div class="home">
    <!-- 搜索栏 -->
    <div class="search-header">
      <div class="search-bar" @click="focusSearch">
        <span class="search-icon">🔍</span>
        <span class="search-placeholder">搜头盔、电动车、装备...</span>
        <span class="camera-icon">📷</span>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="category-bar">
      <span
        v-for="(cat, index) in categories"
        :key="index"
        :class="['cat-item', { active: selectedCat === index }]"
        @click="selectedCat = index"
      >
        {{ cat }}
      </span>
    </div>

    <!-- 功能图标 -->
    <div class="icon-bar">
      <div v-for="(item, index) in icons" :key="index" class="icon-item" @click="goPublish">
        <span class="icon-img">{{ item.icon }}</span>
        <span class="icon-text">{{ item.name }}</span>
      </div>
    </div>

    <!-- 商品瀑布流 -->
    <div class="products">
      <div class="products-col">
        <div
          v-for="p in leftProducts"
          :key="p.id"
          class="product-card"
          @click="goDetail(p.id)"
        >
          <div class="product-img">
            <img :src="p.images?.split(',')[0] || defaultImg" />
          </div>
          <div class="product-info">
            <h3 class="product-title">{{ p.title }}</h3>
            <div class="product-bottom">
              <span class="price">{{ p.price }}</span>
              <span class="want">{{ Math.floor(Math.random() * 80 + 5) }}想要</span>
            </div>
          </div>
        </div>
      </div>

      <div class="products-col">
        <div
          v-for="p in rightProducts"
          :key="p.id"
          class="product-card"
          @click="goDetail(p.id)"
        >
          <div class="product-img">
            <img :src="p.images?.split(',')[0] || defaultImg" />
          </div>
          <div class="product-info">
            <h3 class="product-title">{{ p.title }}</h3>
            <div class="product-bottom">
              <span class="price">{{ p.price }}</span>
              <span class="want">{{ Math.floor(Math.random() * 80 + 5) }}想要</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productApi } from '../api'

const router = useRouter()
const defaultImg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjY2NjIiBmb250LXNpemU9IjUwIj7wn5mPC90ZXh0Pjwvc3ZnPg=='

const categories = ['推荐', '电动车', '头盔', '骑手服', '餐箱', '手机', '更多']
const icons = [
  { name: '发闲置', icon: '📦' },
  { name: '电动车', icon: '🛵' },
  { name: '头盔', icon: '⛑️' },
  { name: '骑手服', icon: '👕' },
  { name: '餐箱', icon: '📦' },
  { name: '更多', icon: '⋯' },
]

const selectedCat = ref(0)
const products = ref([])

const leftProducts = computed(() => products.value.filter((_, i) => i % 2 === 0))
const rightProducts = computed(() => products.value.filter((_, i) => i % 2 === 1))

const loadProducts = async () => {
  try {
    const res = await productApi.getList({ limit: 20 })
    products.value = res.data
  } catch (e) {}
}

const focusSearch = () => {
  console.log('搜索')
}

const goPublish = () => {
  router.push('/publish')
}

const goDetail = (id) => {
  router.push(`/product/${id}`)
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--bg-gray);
  padding-bottom: 80px;
}

/* 搜索栏 */
.search-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  padding: 10px 12px;
  border-bottom: 3px solid var(--border-dark);
  animation: slideDown 0.4s ease-out;
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

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-gray);
  border-radius: 20px;
  padding: 10px 16px;
  border: 3px solid var(--border-dark);
  cursor: pointer;
  transition: all 0.2s;
}

.search-bar:active {
  transform: scale(0.98);
  box-shadow: inset 2px 2px 0px rgba(0, 0, 0, 0.1);
}

.search-icon {
  font-size: 15px;
  opacity: 0.6;
  transition: transform 0.3s;
}

.search-bar:active .search-icon {
  transform: scale(1.2);
}

.search-placeholder {
  flex: 1;
  font-size: 14px;
  color: var(--text-light);
  font-weight: 700;
}

.camera-icon {
  font-size: 20px;
  transition: transform 0.3s;
}

.search-bar:active .camera-icon {
  transform: scale(1.15);
}

/* 分类栏 */
.category-bar {
  display: flex;
  gap: 20px;
  padding: 14px 16px;
  background: white;
  overflow-x: auto;
  border-bottom: 2px solid #eee;
}

.category-bar::-webkit-scrollbar {
  display: none;
}

.cat-item {
  flex-shrink: 0;
  font-size: 14px;
  color: var(--text-light);
  padding-bottom: 6px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s;
  position: relative;
}

.cat-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: var(--primary);
  transition: all 0.3s;
  transform: translateX(-50%);
}

.cat-item.active {
  color: var(--primary);
  font-weight: 900;
}

.cat-item.active::after {
  width: 100%;
}

/* 功能图标 */
.icon-bar {
  display: flex;
  padding: 16px 0;
  background: white;
  margin-bottom: 12px;
  border-bottom: 3px solid var(--border-dark);
}

.icon-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.icon-item:active {
  transform: scale(0.9);
}

.icon-img {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 3px solid var(--border-dark);
  box-shadow: 2px 2px 0px var(--border-dark);
  transition: all 0.2s;
}

.icon-item:active .icon-img {
  box-shadow: 0px 0px 0px var(--border-dark);
  transform: translate(2px, 2px);
}

.icon-text {
  font-size: 12px;
  color: var(--text-dark);
  font-weight: 800;
}

/* 商品瀑布流 */
.products {
  display: flex;
  gap: 10px;
  padding: 0 10px;
}

.products-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid var(--border-dark);
  box-shadow: 3px 3px 0px var(--border-dark);
  transition: all 0.2s;
  animation: fadeInUp 0.5s ease-out both;
}

.product-card:nth-child(1) { animation-delay: 0.1s; }
.product-card:nth-child(2) { animation-delay: 0.15s; }
.product-card:nth-child(3) { animation-delay: 0.2s; }
.product-card:nth-child(4) { animation-delay: 0.25s; }
.product-card:nth-child(5) { animation-delay: 0.3s; }

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

.product-card:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px 0px var(--border-dark);
}

.product-img {
  width: 100%;
  padding-top: 100%;
  position: relative;
  background: var(--bg-gray);
  border-bottom: 2px solid var(--border-dark);
  overflow: hidden;
}

.product-img img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:active .product-img img {
  transform: scale(1.1);
}

.product-info {
  padding: 12px;
}

.product-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--text-dark);
  margin: 0 0 10px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-bottom {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.price {
  font-size: 18px;
  font-weight: 900;
  color: var(--primary);
  transition: transform 0.2s;
}

.product-card:active .price {
  transform: scale(1.1);
}

.price::before {
  content: '¥';
  font-size: 12px;
  font-weight: 700;
}

.want {
  font-size: 10px;
  color: var(--text-light);
  font-weight: 700;
  padding: 4px 8px;
  background: var(--bg-gray);
  border-radius: 10px;
  border: 1px solid var(--border-dark);
}
</style>
