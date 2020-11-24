import { getUserList } from '@/services/users';
import { setImgUrlList } from '@/utils/utils';
import { ExpertDefaultImg } from '@/utils/constants';

export default {
  namespace: 'users',
  state: {
    tableData: [],
    total: 0, // 页面数量
    pageNow: 1, // 当前的页码
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    * fetch({ payload }, { call, put, select }) {
      const { pageNow  } = payload;
      const response = yield call(getUserList, payload);

      const getImgStr = (imgUrlElement) => { // 计算ImgUrlStr
        if (!imgUrlElement) {
          return ExpertDefaultImg
        }
        return (imgUrlElement.indexOf('http://') === -1 ? 'http://' : '') + imgUrlElement;
      };

      const tableData = response.data.map((item, index) => {
        item.headimgurl = getImgStr(item.headimgurl)
        item.detailedclass = item.key1 && JSON.parse(item.key1).detailedclass || '';
        return item;
      });

      const { total } = response;
      yield put({ type: 'save', payload: { tableData, total, pageNow: pageNow } });
    },
  },
};
