import { getAccountList, addOrUpdateAccount, removeAccountById,resetAccountPwdById } from '@/services/account';

export default {
  namespace: 'account',
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
      const { current } = payload;
      const response = yield call(getAccountList, payload);

      const isExpert = (id) => {
        if (!id) {
          return 0;
        }
        return 1;
      };

      const tableData = response.data.result.map((item, index) => {
        item.isExpert = isExpert(item.expertId);
        return item;
      });

      const { total } = response.data;
      yield put({ type: 'save', payload: { tableData, total, pageNow: current } });
    },

    * addOrUpdate({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(addOrUpdateAccount, values);
      if (!response.result) {// 失败, 调用失败的回调函数
        failedCall(response.msg);
        return;
      }
      successCall(response.msg);
    },

    * remove({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(removeAccountById, values);
      const { msg } = response;
      if (!response.result) {// 失败, 调用失败的回调函数
        failedCall(msg);
        return;
      }
      successCall(msg);
    },

    * reset({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(resetAccountPwdById, values);
      if (!response.result) {// 失败, 调用失败的回调函数
        failedCall(response.msg);
        return;
      }
      successCall(response.msg);
    }
  },
};
