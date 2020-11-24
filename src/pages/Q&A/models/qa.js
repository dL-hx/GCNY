import noMatchPic from '../../../assets/noMatchPic.jpg';
import { changeAuditForQA, getQAList, removeQAById } from '@/services/Q&A/q_a';
import { isNULL } from '@/utils/utils';

export default {
  namespace: 'qa',
  state: {
    tableData: [],
    total: 0, // 页面数量
    pageNow: 1, // 当前的页码
    searchValues: {},

    type: '',
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    * fetch({ payload }, { call, put, select }) {
      const { pageNow, type, likeinfo } = payload;

      const response = yield call(getQAList, payload);

      const { count, data } = response;

      const cleanData = !isNULL(data) ? data : [];

      const tableData = cleanData.map((item) => {
        const { img, SourceUrl } = item;
        item.img = img !== '[]' ? `http://${img.replace(/[\[\]]/g, '').split(',')[0]}` : noMatchPic;
        item.SourceUrl = SourceUrl !== '[]' ? `http://${SourceUrl.replace(/[\[\]]/g, '').split(',')[0]}` : '';
        return item;
      });

      const searchValues = { likeinfo }; // 保存搜索的字段
      yield put({ type: 'save', payload: { tableData, total: count, pageNow: pageNow, type, searchValues } });
    },

    * remove({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(removeQAById, values);
      const msg = response.msg;
      if (!response.success) {// 失败, 调用失败的回调函数
        failedCall(msg);
        return;
      }
      successCall(msg);
    },

    * changeStatus({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(changeAuditForQA, values);
      const msg = response.msg;
      if (!response.success) {// 失败, 调用失败的回调函数
        failedCall(msg);
        return;
      }
      successCall(msg);
    },
  },
};
