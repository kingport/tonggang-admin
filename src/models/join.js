// 添加司机模块
// import { queryCurrent, queryFakeList } from './service';

const Model = {
    namespace: 'join',
    state: {
      // 类型 编辑 查看 新建
      joinType: '',
      // 身份信息
      identitiesData: null,
      // 驾驶证信息
      drivingData: null,
      // 车辆信息
      carInformationData: null,
      // 人证信息
      personInformationData: null,
      // 车证信息
      carLicenseData: null,
    },
    effects: {
      // 保存类型
      *saveJoinType({ payload }, { put }) {
        yield put({
          type: 'merge',
          payload,
        });
      },
      // 保存身份信息
      *saveIdentitiesData({ payload }, { put }) {
        yield put({
          type: 'merge',
          payload,
        });
      },
      // 保存驾驶证信息
      *saveDrivingData({ payload }, { put }) {
        yield put({
          type: 'merge',
          payload,
        });
      },
      // 保存车辆信息
      *saveCarInformationData({ payload }, { put }) {
        yield put({
          type: 'merge',
          payload,
        });
      },
      // 人证信息
      *savePersonInformationData({ payload }, { put }) {
        yield put({
          type: 'merge',
          payload,
        });
      },
      // 车证信息
      *saveCarLicenseData({ payload }, { put }) {
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
  