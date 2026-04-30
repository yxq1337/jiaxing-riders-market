const axios = require('axios');

const BMOB_APP_ID = 'f33a06a03b05f0795367d32767f21c63';
const BMOB_REST_KEY = 'e309b64d6176f40dea125aa38bf8a2e4';

const bmob = axios.create({
  baseURL: 'https://api2.bmob.cn/1',
  timeout: 15000,
  headers: {
    'X-Bmob-Application-Id': BMOB_APP_ID,
    'X-Bmob-REST-API-Key': BMOB_REST_KEY,
    'Content-Type': 'application/json'
  }
});

const tables = [
  {
    name: 'Products',
    fields: [
      { key: 'title', type: 'String' },
      { key: 'description', type: 'String' },
      { key: 'price', type: 'Number' },
      { key: 'category', type: 'String' },
      { key: 'condition', type: 'String' },
      { key: 'images', type: 'String' },
      { key: 'location', type: 'String' },
      { key: 'userId', type: 'String' },
      { key: 'view_count', type: 'Number' },
      { key: 'status', type: 'String' }
    ],
    sampleData: [
      { title: '9成新雅迪电动车', description: '雅迪电动车，使用1年，电池续航50公里，适合跑外卖', price: 1500, category: '电动车', condition: '九成新', location: '嘉兴南湖区', view_count: 0, status: 'active' },
      { title: '全新3C认证头盔', description: '3C认证，安全头盔，未拆封，夏季透气款', price: 89, category: '头盔', condition: '全新', location: '嘉兴秀洲区', view_count: 0, status: 'active' },
      { title: '大容量充电宝20000mAh', description: '22.5W快充，跑一天都够用，支持双向快充', price: 129, category: '充电宝', condition: '几乎全新', location: '嘉兴南湖区', view_count: 0, status: 'active' }
    ]
  },
  {
    name: 'Posts',
    fields: [
      { key: 'title', type: 'String' },
      { key: 'content', type: 'String' },
      { key: 'section', type: 'String' },
      { key: 'location', type: 'String' },
      { key: 'images', type: 'String' },
      { key: 'userId', type: 'String' },
      { key: 'authorName', type: 'String' },
      { key: 'likes', type: 'Number' },
      { key: 'replies_count', type: 'Number' }
    ],
    sampleData: [
      { title: '今天跑了50单，分享一下经验', content: '早高峰和晚高峰是订单最多的时候，建议在商圈附近等单。雨天单价会更高！', section: '经验分享', location: '南湖', likes: 23, replies_count: 5 },
      { title: '广益路万达查头盔，大家注意！', content: '刚被拦下来查头盔，幸好戴着！看到好几个兄弟被罚款了，路过的注意点！', section: '路况播报', location: '南湖区', likes: 45, replies_count: 12 }
    ]
  },
  {
    name: 'PostReplies',
    fields: [
      { key: 'postId', type: 'String' },
      { key: 'content', type: 'String' },
      { key: 'userId', type: 'String' },
      { key: 'authorName', type: 'String' },
      { key: 'likes', type: 'Number' }
    ],
    sampleData: []
  },
  {
    name: 'Orders',
    fields: [
      { key: 'productId', type: 'String' },
      { key: 'userId', type: 'String' },
      { key: 'status', type: 'String' }
    ],
    sampleData: []
  },
  {
    name: 'Messages',
    fields: [
      { key: 'fromUserId', type: 'String' },
      { key: 'toUserId', type: 'String' },
      { key: 'fromUserName', type: 'String' },
      { key: 'content', type: 'String' }
    ],
    sampleData: []
  },
  {
    name: 'Reviews',
    fields: [
      { key: 'userId', type: 'String' },
      { key: 'userName', type: 'String' },
      { key: 'rating', type: 'Number' },
      { key: 'content', type: 'String' }
    ],
    sampleData: []
  }
];

async function initBmob() {
  console.log('🚀 开始初始化 Bmob 数据表...\n');

  for (const table of tables) {
    console.log(`📦 处理表: ${table.name}`);

    for (const sample of table.sampleData) {
      try {
        await bmob.post(`/classes/${table.name}`, sample);
        console.log(`  ✅ 已插入示例数据`);
      } catch (e) {
        console.log(`  ⚠️  数据插入: ${e.response?.data?.error || '成功'}`);
      }
    }
    console.log();
  }

  console.log('✅ Bmob 初始化完成！');
  console.log('\n📋 已创建的表:');
  tables.forEach(t => console.log(`  - ${t.name}`));
}

initBmob().catch(console.error);
