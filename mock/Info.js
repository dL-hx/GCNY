import Mock from 'mockjs';

export default {
  // 'POST /api/forms': (req, res) => {
  //   res.send({ message: 'Ok' });
  // },
  // 'GET /api/tags': mockjs.mock({
  //   'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  // }),

  'GET /api/getNews': (req, res) => {
    res.send(Mock.mock({
      'data|35': [{
        'id|+1': 10,
        author: '山西省农牧信息中心',
        source: '农业农牧信息中心',
        articleabstract: '全省万名干部进村服务政策宣讲手册 ',
        publishdate: '2019-03-25T09:33:05Z',
        updatetime: '2019-03-25T09:33:05Z',
        createtime: '2019-03-25T09:33:05Z',
        'content|10': '@cparagraph',
        'title|1': [
          '山西省农牧信息中心',
          '农业农村问题100问',
          '农业农村政策汇编',
          '农民创新创业典型',
        ],
        'ispublish|0-1': 0,
        // 'value|1-100': 150,
        // 'type|0-2': 1,
      }],
      total: 35,
    }));
  },

  'GET /api/getVideoInfo': (req, res) => {
    res.send(Mock.mock({
      'data|35': [{
        'id|+1': 10,
        author: '山西省农牧信息中心',
        source: '农业农牧信息中心',

        keyWords:'["养牛","养羊","养猪"]',
        'link|1':[
          'http://218.26.228.11:8017/shipin/18梨树对外界环境条件的要求.mp4',
          'http://218.26.228.11:8017/shipin/17农民选购肥料注意事项.mp4',
        ],
        imgUrl:'["http://image.wiimedia.cn/TTimages/d334fa7b-1c7b-44b6-a2c6-b77f663991ec.jpg"]',

        articleabstract: '全省万名干部进村服务政策宣讲手册 ',
        publishdate: '2019-03-25T09:33:05Z',
        updatetime: '2019-03-25T09:33:05Z',
        createtime: '2019-03-25T09:33:05Z',
        'content|10': '@cparagraph',
        'title|1': [
          '梨树对外界环境条件的要求',
          '秋播白菜新品种及配套技术',
          '全混合日粮的优势及质量',
          '使用水溶性肥料时的注意事项',
        ],
        'ispublish|0-1': 0,
        // 'value|1-100': 150,
        // 'type|0-2': 1,
      }],
      total: 35,
    }));
  },

};
