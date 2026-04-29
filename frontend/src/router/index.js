import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Publish from '../views/Publish.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Messages from '../views/Messages.vue'
import Profile from '../views/Profile.vue'
import MyProducts from '../views/MyProducts.vue'
import Chat from '../views/Chat.vue'
import Forum from '../views/Forum.vue'
import PostDetail from '../views/PostDetail.vue'
import CreatePost from '../views/CreatePost.vue'

const routes = [
  { path: '/', component: Forum },
  { path: '/login', component: Login },
  { path: '/market', component: Home },
  { path: '/publish', component: Publish, meta: { requiresAuth: true } },
  { path: '/product/:id', component: ProductDetail },
  { path: '/post/:id', component: PostDetail },
  { path: '/create-post', component: CreatePost, meta: { requiresAuth: true } },
  { path: '/messages', component: Messages, meta: { requiresAuth: true } },
  { path: '/chat/:userId', component: Chat, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/my-products', component: MyProducts, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
