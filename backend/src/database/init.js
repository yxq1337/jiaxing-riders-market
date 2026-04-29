const db = require('./db');
const bcrypt = require('bcryptjs');

const initData = () => {
  const posts = db.get('posts').value();
  const users = db.get('users').value();

  if (!posts || posts.length === 0) {
    const samplePosts = [
      {
        id: 1,
        user_id: 1,
        title: '🚨 中环南路与越秀路交叉口严重堵车！建议绕行',
        content: '刚才路过，三车追尾，整个路口堵死了。从西往东方向完全动不了，建议大家走由拳路绕行！交警已经在现场处理了，估计还要半小时才能通。',
        section: '路况播报',
        images: '',
        location: '经开区',
        likes: 234,
        replies_count: 89,
        stars: 67,
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        user_id: 2,
        title: '⚠️ 广益路万达门口查头盔，大家注意！',
        content: '刚被拦下来查头盔，幸好戴着！看到好几个兄弟被罚款了，50块没了。万达门口从上午10点查到现在，路过的注意点！',
        section: '路况播报',
        images: '',
        location: '南湖区',
        likes: 156,
        replies_count: 42,
        stars: 28,
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        user_id: 3,
        title: '🛵 出个9成新的雅迪电动车，刚买3个月',
        content: '换工作不跑外卖了，出个雅迪DE8，续航80公里，去年12月买的，原价4299，现在2800出，可小刀。有需要的私信我看车，在嘉善城区。',
        section: '二手交易',
        images: '',
        location: '嘉善县',
        likes: 45,
        replies_count: 23,
        stars: 12,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        user_id: 4,
        title: '💼 饿了么招骑手，单价6块起，提供车住',
        content: '站点直招，全职兼职都可以。全职保底6000，超过800单每单7块。提供电动车和住宿，新人还有1000块新人奖。有意的直接评论区留联系方式！',
        section: '求职招聘',
        images: '',
        location: '南湖区',
        likes: 78,
        replies_count: 56,
        stars: 34,
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 5,
        user_id: 5,
        title: '🤝 有没有兄弟在平湖站跑的？那边单量怎么样？',
        content: '准备从秀洲区转到平湖去跑，听说那边单多但没人跑，有没有在那边的兄弟说一下真实情况？单价怎么样？有没有超重单？',
        section: '互帮互助',
        images: '',
        location: '秀洲区',
        likes: 23,
        replies_count: 18,
        stars: 5,
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 6,
        user_id: 1,
        title: '今天跑了58单，收入348，还行吧',
        content: '周一单量确实少，周六日都能跑80多单。今天午高峰爆了一下，下午基本在挂树。有没有在海宁的兄弟？那边单价好像比我们这边高一块？',
        section: '闲聊灌水',
        images: '',
        location: '海宁市',
        likes: 89,
        replies_count: 67,
        stars: 23,
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];

    db.set('posts', samplePosts).write();

    if (!users || users.length === 0) {
      // 所有示例用户密码都是 123456，已加密
      const hashedPassword = bcrypt.hashSync('123456', 8);

      db.set('users', [
        {
          id: 1,
          phone: '138****8888',
          password: hashedPassword,
          nickname: '老骑友王哥',
          credit_score: 100,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          phone: '139****9999',
          password: hashedPassword,
          nickname: '风一样的男子',
          credit_score: 98,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          phone: '137****7777',
          password: hashedPassword,
          nickname: '嘉善小阿弟',
          credit_score: 95,
          created_at: new Date().toISOString()
        },
        {
          id: 4,
          phone: '136****6666',
          password: hashedPassword,
          nickname: '南湖站长',
          credit_score: 100,
          created_at: new Date().toISOString()
        },
        {
          id: 5,
          phone: '135****5555',
          password: hashedPassword,
          nickname: '秀洲跑腿王',
          credit_score: 92,
          created_at: new Date().toISOString()
        },
      ]).write();
    }

    console.log('✅ 示例数据初始化完成！');
  } else {
    console.log('ℹ️  数据库已有数据，跳过初始化');
  }
};

initData();
