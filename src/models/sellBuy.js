import {
  getSellBuyList,
  addOrUpdateSellBuy,
} from '@/services/sellBuy';

import {
  changeArticleStatus as changeSellBuyStatus,
  removeArticleById as removeSellBuyById,
} from '@/services/article';

import { setImgUrlList } from '@/utils/utils';

export default {
  namespace: 'sellBuy',
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
      const response = yield call(getSellBuyList, payload);
      const tableData = response.data.map((item, index) => {
        const { imgUrl, ...rest } = item;
        return {
          ...rest,
          imgUrl: setImgUrlList(imgUrl),
        };
      });

      const { total } = response;
      yield put({ type: 'save', payload: { tableData, total, pageNow: current } });
    },

    * addOrUpdate({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(addOrUpdateSellBuy, values);
      if (!response.result) {
        // 失败, 调用失败的回调函数
        failedCall(response.msg);
        return;
      }
      successCall(response.msg);
    },

    * remove({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(removeSellBuyById, values);
      if (!response.result) {
        // 失败, 调用失败的回调函数
        failedCall(response.msg);
        return;
      }
      successCall(response.msg);
    },

    * changeStatus({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(changeSellBuyStatus, values);
      if (!response.result) {
        // 失败, 调用失败的回调函数
        failedCall(response.msg);
        return;
      }
      successCall(response.msg);
    },
  },
};
