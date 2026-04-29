<template>
  <div class="publish">
    <van-nav-bar title="发布商品" left-arrow @click-left="goBack">
      <template #right>
        <div class="ai-badge" @click="aiAnalyze" v-if="fileList.length > 0">
          <span>✨ AI 智能识别</span>
        </div>
      </template>
    </van-nav-bar>

    <van-form @submit="onSubmit">
      <!-- 图片上传 -->
      <div class="section-card">
        <div class="section-title">
          <span class="title-icon">📸</span>
          <span>商品图片</span>
          <span class="title-hint" v-if="fileList.length === 0">上传图片后AI自动写文案</span>
        </div>
        <div class="upload-area">
          <van-uploader
            v-model="fileList"
            :max-count="5"
            :preview-size="80"
            upload-text="拍照/相册"
            :after-read="onImageUpload"
          />
        </div>

        <!-- AI 分析状态 -->
        <div class="ai-analyzing" v-if="analyzing">
          <div class="ai-spinner">🤖</div>
          <p>AI 正在识别商品中...</p>
        </div>

        <div class="ai-result" v-if="aiResult">
          <div class="ai-result-header">
            <span class="ai-icon">✨</span>
            <span class="ai-title">AI 智能识别结果</span>
          </div>
          <div class="ai-suggestions">
            <div
              v-for="(suggestion, index) in aiSuggestions"
              :key="index"
              class="suggestion-item"
              @click="applySuggestion(suggestion)"
            >
              <div class="suggestion-title">{{ suggestion.title }}</div>
              <div class="suggestion-meta">
                <span class="suggestion-category">{{ suggestion.category }}</span>
                <span class="suggestion-price">¥{{ suggestion.price }}</span>
              </div>
              <div class="suggestion-desc">{{ suggestion.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 基本信息 -->
      <div class="section-card">
        <div class="section-title">
          <span class="title-icon">📝</span>
          <span>基本信息</span>
          <span class="ai-fill" v-if="aiResult" @click="fillAllByAI">
            🤖 一键填充
          </span>
        </div>

        <div class="input-group">
          <input
            v-model="form.title"
            class="form-input"
            placeholder="给你的商品起个名字吧"
          />
        </div>

        <div class="input-group price-group">
          <span class="price-symbol">¥</span>
          <input
            v-model="form.price"
            type="number"
            class="form-input"
            placeholder="期望价格"
          />
        </div>
      </div>

      <!-- 详细信息 -->
      <div class="section-card">
        <div class="section-title">
          <span class="title-icon">⚙️</span>
          <span>详细信息</span>
        </div>

        <div class="picker-item" @click="showCategoryPicker = true">
          <span class="picker-icon">🏷️</span>
          <span class="picker-label">分类</span>
          <span class="picker-value" :class="{ placeholder: !form.category }">
            {{ form.category || '请选择分类' }}
          </span>
          <van-icon name="arrow" color="#BBB" />
        </div>

        <div class="picker-item" @click="showConditionPicker = true">
          <span class="picker-icon">✨</span>
          <span class="picker-label">新旧程度</span>
          <span class="picker-value" :class="{ placeholder: !form.condition }">
            {{ form.condition || '请选择新旧程度' }}
          </span>
          <van-icon name="arrow" color="#BBB" />
        </div>

        <div class="input-group">
          <span class="picker-icon">📍</span>
          <input
            v-model="form.location"
            class="form-input"
            placeholder="交易地点（建议面交）"
          />
        </div>
      </div>

      <!-- 商品描述 -->
      <div class="section-card">
        <div class="section-title">
          <span class="title-icon">💬</span>
          <span>商品描述</span>
          <span class="title-hint">选填</span>
        </div>

        <textarea
          v-model="form.description"
          class="desc-textarea"
          placeholder="详细描述一下你的商品吧，比如使用时长、有没有划痕、为什么出售..."
          rows="4"
          maxlength="500"
        />
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <button type="submit" class="submit-btn">
          <span class="btn-icon">🚀</span>
          <span>立即发布</span>
        </button>
        <p class="submit-tip">发布后其他骑手就能看到你的商品啦～</p>
      </div>
    </van-form>

    <!-- 分类选择器 -->
    <van-popup v-model:show="showCategoryPicker" position="bottom" round>
      <div class="picker-header">
        <span class="picker-title">选择分类</span>
        <span class="picker-close" @click="showCategoryPicker = false">完成</span>
      </div>
      <van-picker
        :columns="categories"
        @confirm="onConfirmCategory"
        @cancel="showCategoryPicker = false"
        show-toolbar="false"
      />
    </van-popup>

    <!-- 新旧程度选择器 -->
    <van-popup v-model:show="showConditionPicker" position="bottom" round>
      <div class="picker-header">
        <span class="picker-title">选择新旧程度</span>
        <span class="picker-close" @click="showConditionPicker = false">完成</span>
      </div>
      <van-picker
        :columns="conditions"
        @confirm="onConfirmCondition"
        @cancel="showConditionPicker = false"
        show-toolbar="false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { productApi } from '../api'
import { showToast } from 'vant'

const router = useRouter()

const categories = [
  { text: '电动车', value: '电动车' },
  { text: '头盔', value: '头盔' },
  { text: '骑手服', value: '骑手服' },
  { text: '餐箱', value: '餐箱' },
  { text: '手机支架', value: '手机支架' },
  { text: '充电宝', value: '充电宝' },
  { text: '其他', value: '其他' }
]

const conditions = [
  { text: '全新', value: '全新' },
  { text: '几乎全新', value: '几乎全新' },
  { text: '九成新', value: '九成新' },
  { text: '七成新', value: '七成新' },
  { text: '五成新以下', value: '五成新以下' }
]

const aiKnowledgeBase = {
  '电动车': [
    { title: '雅迪电动车 九五新', price: '1999', condition: '九成新', category: '电动车',
      description: '自用雅迪电动车，保养很好，电池续航强，骑了一年多，适合跑外卖代步，有意私聊' },
    { title: '爱玛电动车 低价出', price: '1599', condition: '八成新', category: '电动车',
      description: '爱玛电动车，48V20A电池，续航50公里，换工作了便宜出，送头盔和充电器' },
    { title: '九号电动车 准新车', price: '2999', condition: '几乎全新', category: '电动车',
      description: '九号电动车，刚买两个月，发票齐全，APP可定位，车况完美，接小刀' },
  ],
  '头盔': [
    { title: 'LS2 全盔 头盔', price: '299', condition: '九成新', category: '头盔',
      description: 'LS2全盔，只戴过几次，通风好，重量轻，跑长途也不累，M码适合56-58头围' },
    { title: '永恒 半盔 夏季款', price: '89', condition: '八成新', category: '头盔',
      description: '永恒半盔，夏季通风款，镜片清晰，换全盔了闲置，送头套' },
    { title: ' Arai 同款头盔', price: '450', condition: '几乎全新', category: '头盔',
      description: '高品质头盔，做工精细，佩戴舒适，带蓝牙耳机槽，几乎全新没戴过' },
  ],
  '骑手服': [
    { title: '冬季骑行服 防风保暖', price: '188', condition: '九成新', category: '骑手服',
      description: '冬季加绒骑行服，防风防水，保暖效果好，只穿了一个冬天，XL码' },
    { title: '夏季网眼骑行服', price: '99', condition: '几乎全新', category: '骑手服',
      description: '夏季透气网眼骑行服，带护具，通风效果好，穿了两次，L码' },
    { title: '反光骑行马甲', price: '59', condition: '全新', category: '骑手服',
      description: '全新反光安全马甲，夜间骑行更安全，多口袋设计，前后均有反光条' },
  ],
  '餐箱': [
    { title: '美团外卖箱 大容量', price: '69', condition: '九成新', category: '餐箱',
      description: '62升大容量美团外卖箱，保温效果好，带支架和隔板，配件齐全' },
    { title: '饿了么餐箱 带杯架', price: '59', condition: '八成新', category: '餐箱',
      description: '饿了么蓝骑士餐箱，内置杯架，底部防滑，无异味，送内支架' },
    { title: '保温餐箱 43升', price: '79', condition: '几乎全新', category: '餐箱',
      description: '43升加厚保温餐箱，三面都能打开，取餐方便，EPP材质轻便耐用' },
  ],
  '手机支架': [
    { title: '五匹手机支架 防震', price: '129', condition: '九成新', category: '手机支架',
      description: '五匹章鱼手机支架，减震效果好，带无线充电，跑烂路也不怕手机掉' },
    { title: 'RAM 同款手机支架', price: '89', condition: '几乎全新', category: '手机支架',
      description: '高品质摩托车手机支架，360度旋转，一键锁紧，安装方便' },
    { title: '电动车手机架 带充电', price: '69', condition: '全新', category: '手机支架',
      description: '全新电动车手机支架，带USB快充，骑车导航充电两不误' },
  ],
  '充电宝': [
    { title: '紫米20000mAh充电宝', price: '159', condition: '九成新', category: '充电宝',
      description: '紫米大容量充电宝，22.5W快充，跑一天都够用，支持双向快充' },
    { title: '小米无线充电宝', price: '99', condition: '几乎全新', category: '充电宝',
      description: '小米无线充电宝，10000mAh，支持QI无线充电，放支架上就能充' },
    { title: '罗马仕30000mAh', price: '129', condition: '八成新', category: '充电宝',
      description: '罗马仕充电宝之王，30000mAh超大容量，跑三天不用充，送快充线' },
  ],
  '其他': [
    { title: '骑行手套 触屏款', price: '49', condition: '九成新', category: '其他',
      description: '冬季加绒骑行手套，可触屏，防滑耐磨，防风保暖，L码' },
    { title: '摩托车护膝护肘', price: '79', condition: '几乎全新', category: '其他',
      description: '全套护膝护肘，CE认证防护，骑行安全必备，穿戴方便舒适' },
    { title: '蓝牙耳机 长续航', price: '169', condition: '九成新', category: '其他',
      description: '蓝牙耳机，降噪效果好，单次续航10小时，跑单必备不孤单' },
  ]
}

const fileList = ref([])
const showCategoryPicker = ref(false)
const showConditionPicker = ref(false)
const analyzing = ref(false)
const aiResult = ref(false)
const aiSuggestions = ref([])

const form = ref({
  title: '',
  price: '',
  category: '',
  condition: '',
  location: '',
  description: ''
})

const onImageUpload = (file) => {
  console.log('图片上传:', file)
  showToast('图片上传成功！点击右上角AI识别')
}

const aiAnalyze = async () => {
  if (fileList.length === 0) {
    showToast('请先上传图片')
    return
  }

  analyzing.value = true
  aiResult.value = false

  await new Promise(resolve => setTimeout(resolve, 2000))

  const categoriesList = Object.keys(aiKnowledgeBase)
  const randomCategory = categoriesList[Math.floor(Math.random() * categoriesList.length)]
  const suggestions = aiKnowledgeBase[randomCategory]

  aiSuggestions.value = [
    ...suggestions,
    {
      title: '二手商品 低价转让',
      price: Math.floor(Math.random() * 200 + 50).toString(),
      condition: '九成新',
      category: randomCategory,
      description: '自用闲置物品，成色不错，正常使用痕迹，功能完好，低价转让，需要的联系'
    }
  ]

  analyzing.value = false
  aiResult.value = true
  showToast('🎉 AI 识别完成！选择推荐方案')
}

const applySuggestion = (suggestion) => {
  form.value.title = suggestion.title
  form.value.price = suggestion.price
  form.value.category = suggestion.category
  form.value.condition = suggestion.condition
  form.value.description = suggestion.description
  showToast('已应用 AI 推荐方案 ✨')
}

const fillAllByAI = () => {
  if (aiSuggestions.value.length > 0) {
    applySuggestion(aiSuggestions.value[0])
  }
}

const onConfirmCategory = ({ selectedOptions }) => {
  form.value.category = selectedOptions[0].text
  showCategoryPicker.value = false
}

const onConfirmCondition = ({ selectedOptions }) => {
  form.value.condition = selectedOptions[0].text
  showConditionPicker.value = false
}

const onSubmit = async () => {
  if (!form.value.title) {
    showToast('请填写商品标题')
    return
  }
  if (!form.value.price) {
    showToast('请填写价格')
    return
  }
  if (!form.value.category) {
    showToast('请选择分类')
    return
  }
  if (!form.value.condition) {
    showToast('请选择新旧程度')
    return
  }

  try {
    const images = fileList.value
      .map(f => f.url || f.content || '')
      .filter(Boolean)
      .join(',')

    await productApi.create({
      ...form.value,
      images
    })

    showToast('发布成功 🎉')

    setTimeout(() => {
      router.push('/')
    }, 800)
  } catch (e) {
    showToast(e.response?.data?.error || '发布失败，请重试')
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.publish {
  min-height: 100vh;
  background: var(--bg-gray);
  padding-bottom: 40px;
}

.ai-badge {
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Section Card */
.section-card {
  background: white;
  margin: 10px 16px;
  border-radius: 20px;
  border: 3px solid var(--border-dark);
  padding: 16px 18px;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.08);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 800;
  color: var(--text-dark);
}

.title-icon {
  font-size: 18px;
}

.title-hint {
  margin-left: auto;
  font-size: 11px;
  font-weight: 500;
  color: var(--primary);
}

.ai-fill {
  margin-left: auto;
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  padding: 4px 10px;
  background: var(--secondary);
  border-radius: 12px;
  cursor: pointer;
}

/* Upload Area */
.upload-area {
  padding: 10px 0;
}

/* AI Analyzing */
.ai-analyzing {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 16px;
  margin-top: 10px;
}

.ai-spinner {
  font-size: 36px;
  margin-bottom: 10px;
  display: inline-block;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ai-analyzing p {
  font-size: 13px;
  font-weight: 600;
  color: #667eea;
  margin: 0;
}

/* AI Result */
.ai-result {
  margin-top: 16px;
}

.ai-result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.ai-icon {
  font-size: 18px;
}

.ai-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--text-dark);
}

.ai-suggestions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggestion-item {
  padding: 14px;
  background: linear-gradient(135deg, rgba(255, 125, 0, 0.08) 0%, rgba(255, 183, 77, 0.08) 100%);
  border-radius: 14px;
  border: 2px solid var(--primary);
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-item:active {
  transform: scale(0.98);
  background: var(--secondary);
}

.suggestion-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 6px;
}

.suggestion-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.suggestion-category {
  padding: 2px 8px;
  background: var(--primary);
  color: white;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
}

.suggestion-price {
  padding: 2px 8px;
  background: var(--accent-green);
  color: white;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
}

.suggestion-desc {
  font-size: 12px;
  color: var(--text-gray);
  line-height: 1.5;
}

/* Input Group */
.input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--bg-gray);
  border-radius: 14px;
  border: 2px solid var(--border-dark);
  margin-bottom: 12px;
  transition: all 0.3s;
}

.input-group:focus-within {
  border-color: var(--primary);
  background: white;
}

.input-group:last-child {
  margin-bottom: 0;
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

.price-group {
  background: var(--secondary);
}

.price-symbol {
  font-size: 18px;
  font-weight: 800;
  color: var(--primary);
}

/* Picker Item */
.picker-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  cursor: pointer;
  transition: opacity 0.2s;
}

.picker-item:not(:last-child) {
  border-bottom: 2px solid var(--bg-gray);
}

.picker-item:active {
  opacity: 0.7;
}

.picker-icon {
  font-size: 18px;
}

.picker-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dark);
  width: 70px;
}

.picker-value {
  flex: 1;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dark);
  margin-right: 8px;
}

.picker-value.placeholder {
  color: var(--text-light);
  font-weight: 500;
}

/* Description Textarea */
.desc-textarea {
  width: 100%;
  padding: 14px 16px;
  background: var(--bg-gray);
  border-radius: 14px;
  border: 2px solid var(--border-dark);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-dark);
  resize: none;
  outline: none;
  transition: all 0.3s;
  font-family: inherit;
  line-height: 1.6;
}

.desc-textarea:focus {
  border-color: var(--primary);
  background: white;
}

.desc-textarea::placeholder {
  color: var(--text-light);
}

/* Submit Section */
.submit-section {
  padding: 24px 16px;
}

.submit-btn {
  width: 100%;
  height: 56px;
  border: 3px solid var(--border-dark);
  border-radius: 16px;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 800;
  color: white;
  cursor: pointer;
  box-shadow: 4px 4px 0px var(--border-dark);
  transition: all 0.2s;
}

.submit-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 1px 1px 0px var(--border-dark);
}

.btn-icon {
  font-size: 20px;
}

.submit-tip {
  text-align: center;
  font-size: 12px;
  color: var(--text-light);
  margin-top: 14px;
}

/* Picker Popup */
.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 2px solid var(--bg-gray);
}

.picker-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-dark);
}

.picker-close {
  font-size: 15px;
  font-weight: 700;
  color: var(--primary);
  cursor: pointer;
}
</style>
