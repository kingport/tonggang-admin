// import { queryCurrent, queryFakeList } from './service';

const Model = {
  namespace: 'companyNew',
  state: {
    // 基本信息
    basicData: {},
    // 资质信息
    qualificationData: {},
    // 银行卡信息
    bankCardData: {},
    // 签约信息
    signData: {},
  },
  effects: {
    // 保存基本信息
    *saveBasicData({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },
    // 保存资质信息
    *qualificationData({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },
    // 保存银行卡信息
    *bankCardData({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },
    // 保存签约信息
    *signData({ payload }, { put }) {
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
