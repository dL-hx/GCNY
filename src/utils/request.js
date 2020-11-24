import axios from 'axios';
import { processEnv } from '@/utils/config';
import router from 'umi/src/router';
import { message } from 'antd';
import { getRole } from '@/utils/authority';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const errData = error.response;
    if (errData) {
      const { status } = errData;
      if (status === 401) {
        router.push('/login/login');
        message.warn('登陆信息过期');
      }
    }

    return Promise.reject(error);  // 返回接口返回的错误信息
  });

// path:string 接口的路径
// data:obj 接口的传递的参数
// method: 'GET'| 'POST'
// API_ROOT?:string, 暴露接口, 用以不同接口的调用配置,当有其他人开发接口时候, 可以指定第四个参数, 替换默认的`baseURL` 的配置
export default function ajax(path, data = {}, method = 'GET', API_ROOT = processEnv.BASE_URL) {

  const axiosObj = {
    url: path,
    method,
    baseURL: API_ROOT,
    timeout: 50000,
    withCredentials: API_ROOT === processEnv.BASE_URL, // axios 默认不携带 Cookies
  };

  if (method === 'GET') {
    axiosObj.params = data;
  }

  if (method === 'POST') {
    axiosObj.data = data;
  }

  if (getRole()=='guest') { // 或者游客身份
    router.push('/login/login');
    message.warn('登陆信息过期');
  }

  return new Promise((resolve, reject) => {
    axios(axiosObj).then(response => {
      // console.log('response', response);
      if (response && response.status === 200) {
        const res = response.data;
        resolve(res);
      }
    }).catch(error => {
      // console.log(error);
      reject(error);
    });
  });
}

// axios 文档 :https://www.kancloud.cn/yunye/axios/234845
