const newsApi = 'https://gcapp.wiimedia.top';  // 资讯接口
const config = {
  // reqhost: 'http://192.168.2.107:8025',
  reqhost: 'https://gaocheng.wiimedia.top',

  // reqNews: 'http://192.168.2.69:9010',
  reqNews: newsApi, // 资讯信息
  reqExpect: newsApi, // 专家信息
};

const processEnv = { // 环境配置
  NODE_ENV: 'product',
  BASE_URL: config.reqhost,
};

export {
  processEnv,
};

export const AppId = { AppId: 134 };

export default config;

