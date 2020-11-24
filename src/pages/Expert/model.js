import { addOrUpdateExpect, getExpectListOrSearch, removeExpectById } from '@/services/expect';
import { setImgUrlList } from '@/utils/utils';

export default {
  namespace: 'expert',
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
      const response = yield call(getExpectListOrSearch, payload);

      const tableData = response.data.map((item, index) => {
        item.imgs = setImgUrlList(item.imgs);
        item.detailedclass = item.key1 && JSON.parse(item.key1).detailedclass || '';
        // item.honorUrl = setImgUrlList(item.honorUrl);
        return item;
      });

      const { total } = response;
      yield put({ type: 'save', payload: { tableData, total, pageNow: pageNow } });
    },

    * addOrUpdate({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(addOrUpdateExpect, values);
      console.log('response', response);
      if (!response.success) {// 失败, 调用失败的回调函数
        failedCall(response.msg);
        return;
      }
      successCall(response.msg);
    },

    * remove({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(removeExpectById, values);
      const { msg } = response;
      if (!response.success) {// 失败, 调用失败的回调函数
        failedCall(msg);
        return;
      }
      successCall(msg);
    },

    /*    * changeStatus({ values, successCall, failedCall }, { call, put }) {
          const response = yield call(changeEnteriseStatus, values);
          if (!response.success) {// 失败, 调用失败的回调函数
            failedCall(response.msg);
            return;
          }
          successCall(response.msg);
        },*/
  },
};
