import { getArticleList, changeArticleStatus } from '@/services/article';

export default {
  namespace: 'article',
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
      const { pageNow :current,...rest} = payload;

      const response = yield call(getArticleList, {...rest, current });
      const tableData = response.data;

      const { total } = response;
      yield put({ type: 'save', payload: { tableData, total, pageNow: current} });
    },


    * changeStatus({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(changeArticleStatus, values);
      const msg = response.msg;
      if (!response.result) {// 失败, 调用失败的回调函数
        failedCall(msg);
        return;
      }
      successCall(msg);
    },
  },
};
