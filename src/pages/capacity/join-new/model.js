// import { queryCurrent, queryFakeList } from './service';

const Model = {
  namespace: 'joinNew',
  state: {
    // 申请信息
    driverApply: null,
    // 身份信息
    driverIdcard: null,
    // 驾驶证
    driverLicense: null,
    // 车辆信息
    driverCar: null,
    // 行驶证
    driverDrivingLicense: null,
    // 人证
    driverOnlineLicense: null,
    // 车证
    driverOnlineDrivingLicense: null,
  },
  effects: {
    // 保存申请信息
    *saveDriverApply({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },
    // 身份信息
    *saveDriverIdcard({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },
    // 驾驶证
    *saveDriverLicense({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },
    // 车辆信息
    *saveDriverCar({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },
    // 行驶证
    *saveDriverDrivingLicense({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },
    // 人证
    *saveDriverOnlineLicense({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },
    // 车证
    *saveDriverOnlineDrivingLicense({ payload }, { put }) {
      yield put({
        type: 'merge',
        payload,
      });
    },
    *clearDriverInfo({ payload }, { put }) {
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
