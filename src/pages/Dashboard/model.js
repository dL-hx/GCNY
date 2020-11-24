import { getChartData } from '@/services/dashboard';
import { monthTrend } from '@/utils/utils';

export default {
  namespace: 'dashboard',
  state: {
    userCountSet: {// 用户数量
      data: [], // 用户数据
      total: 0, // 用户总数
    },

    userVisitSet: {// 用户资讯访问量
      data: [],
      total: 0,
    },

    newsCountSet: {// 资讯数量
      data: {
        month: [],
        day: [],
      },
      total: 0,
    },

    expertSet: { // 专家类别饼图数据
      data: [],
      total: 0,
    },

    rankTable: [],
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    * fetch({ payload }, { call, put, select }) {
      const response = yield call(getChartData, payload);
      yield put({
        type: 'save',
        payload: {
          userCountSet: {// 用户数量
            data: response.yhsqs, // 用户数据
            total: response.yhs, // 用户总数
          },

          userVisitSet: {// 用户资讯访问量
            data: response.yhfwlqs,
            total: response.yhfwl,
          },

          newsCountSet: {// 资讯数量
            data: {
              month: monthTrend(response.zxslqs),
              day: response.zxslqs.map(v => ({
                x: v.x,
                // eslint-disable-next-line radix
                y: parseInt(v.y),
              })),
            },
            total: response.zxsl,
          },

          expertSet: { // 专家类别饼图数据
            data: response.zjlbbt.map(v => ({
              x: v.x,
              // eslint-disable-next-line radix
              y: parseInt(v.y),
            })),
            total: response.zjsltj,
          },

          rankTable: response.twlbpm,
        },
      });
    },

  },
};
