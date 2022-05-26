// import { queryCurrent, queryFakeList } from './service';

const Model = {
  namespace: 'ticketList',
  state: {
    // 基本信息
    editData: {},
  },
  effects: {
    // 保存编辑信息
    *saveEditData({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },
  reducers: {
    merge(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    queryList(state, action) {
      return { ...state, list: action.payload };
    },
  },
};
export default Model;
