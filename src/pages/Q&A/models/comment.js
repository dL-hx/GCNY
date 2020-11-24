import {
  changeAuditForComment,
  commentTypeIdConfig as ct,
  getCommentList,
  removeCommentById,
} from '@/services/Q&A/comment';
import { isNULL } from '@/utils/utils';
import { ExpertDefaultImg } from '@/utils/constants';

export default {
  namespace: 'comment',
  state: {
    askList: [],
    listData: [],
    total: 0, // 页面数量
    pageNow: 1, // 当前的页码

    selectedAllKeys: [], // 全选的 keys
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    * fetch({ payload }, { call, put, select, all }) {
      const { pageNow } = payload;

      // const [askListResponse, response] = yield all([
      //   call(getCommentList, { ...payload, ct: ct.ask }),
      //   call(getCommentList, { ...payload, ct: ct.reply }),
      // ]);

      const response = yield call(getCommentList, { ...payload, ct: ct.reply });

      const { total, data } = response;

      const cleanData = !isNULL(data) ? data : [];

      const listData = cleanData.map((item) => {
        const { headimgurl, name, content, ...rest } = item;

        return {
          headimgurl: headimgurl && `http://${headimgurl}` || ExpertDefaultImg,
          content: JSON.parse(content),
          ...rest,
        };
      });

      const selectedAllKeys = cleanData.map((item) => (item.commentid));

      yield put({ type: 'save', payload: { listData, total, pageNow: pageNow, selectedAllKeys } });
    },

    * remove({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(removeCommentById, values);
      const msg = response.msg;
      if (!response.success) {// 失败, 调用失败的回调函数
        failedCall(msg);
        return;
      }
      successCall(msg);
    },

    * changeStatus({ values, successCall, failedCall }, { call, put }) {
      const response = yield call(changeAuditForComment, values);
      const msg = response.msg;
      if (!response.success) {// 失败, 调用失败的回调函数
        failedCall(msg);
        return;
      }
      successCall(msg);
    },
  },
};
