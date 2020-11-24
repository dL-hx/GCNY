import { clearAllKeys, getUserId, isAdmin, setUserInfo } from '@/utils/authority';
import { reloadAuthorized, setAuthorized } from '@/utils/Authorized';
import { logIn, logOut, updatePwd } from '@/services/login';
import router from 'umi/router';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    isAdmin: undefined,
    userId: undefined,
  },

  effects: {
    * login({ payload: { values, failedCall, successCall } }, { call, put, select }) {
      const data = yield call(logIn, values);

      if (!data.result) {
        failedCall(data.msg);
        return;
      }

      yield put({
        type: 'changeLoginStatus',
        payload: { params: data.other },
      });

      reloadAuthorized();

      successCall(data.msg);

      router.push('/');
    },

    * updatePwd({ payload: { values, callback } }, { call }) {
      const data = yield call(updatePwd, { values });
      callback(data.result, data.msg);
    },

    * logout(_, { put, call }) {
      yield call(logOut);
      clearAllKeys();
      setAuthorized('guest');

      reloadAuthorized();
      router.push('/login/login');
    },
  },

  reducers: {
    account(state, { payload }) {
      return {
        ...state,
        isAdmin: isAdmin(),
        userId: getUserId(),
      };
    },

    changeLoginStatus(state, { payload }) {
      const { params } = payload;
      const { userID, userName, adminType } = params;

      function getAuth() { // 1 : admin,  !1: 'user'
        return adminType === 1 ? 'admin' : 'user';
      }

      const auth = getAuth();

      setAuthorized(auth);
      setUserInfo(userName, userID);

      return {
        ...state,
      };
    },

  },
};
