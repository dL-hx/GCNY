import { changeAuditForNews, getNewsOrSearch,removeNewsById } from '@/services/info';

export default {
  namespace: 'info',
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
      const { pageNow } = payload;

      const response = yield call(getNewsOrSearch, payload);
      const tableData = response.data;

      const { total } = response;
      yield put({ type: 'save', payload: { tableData, total, pageNow: pageNow} });
    },

    // * addOrUpdate({ values, successCall, failedCall }, { call, put }) {
    //   const response = yield call(addOrUpdateNews, values);
    //   console.log('response', response);
    //   if (!response.success) {// 失败, 调用失败的回调函数
    //     failedCall(response.msg);
    //     return;
    //   }
    //   successCall(response.msg);
    // },


    * remove({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(removeNewsById, values);
      const msg = response.msg;
      if (!response.success) {// 失败, 调用失败的回调函数
        failedCall(msg);
        return;
      }
      successCall(msg);
    },

    * changeStatus({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(changeAuditForNews, values);
      const msg = response.msg;
      if (!response.success) {// 失败, 调用失败的回调函数
        failedCall(msg);
        return;
      }
      successCall(msg);
    },
  },
};
