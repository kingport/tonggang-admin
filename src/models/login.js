import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin, phoneVerifyLogin, fakeAccountLogout } from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      // 账号密码登录
      let response = null;
      // 邮箱账号 手机账号登录
      if (payload.type === 'account' || payload.type === 'account-phone') {
        response = yield call(fakeAccountLogin, payload);
      } else if (payload.type === 'phone') {
        // 验证码登录
        response = yield call(phoneVerifyLogin, payload);
      }
      if (response) {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        }); // Login successfully
        if (response.errno === 0) {
          // 存入个人信息
          const userInfo = {
            name: response.data.name,
            is_disable: response.data.is_disable,
            email: response.data.email,
            id: response.data.id,
            phone: response.data.phone,
            avatar:
              'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          };
          window.localStorage.setItem('userInfo', JSON.stringify(userInfo));

          // 记住上次的页面路径
          // const urlParams = new URL(window.location.href);
          // const params = getPageQuery();
          // let { redirect } = params;

          // if (redirect) {
          //   const redirectUrlParams = new URL(redirect);

          //   if (redirectUrlParams.origin === urlParams.origin) {
          //     redirect = redirect.substr(urlParams.origin.length);

          //     if (redirect.match(/^\/.*#/)) {
          //       redirect = redirect.substr(redirect.indexOf('#') + 1);
          //     }
          //   } else {
          //     window.location.href = '/';
          //     return;
          //   }
          // }

          // history.replace(redirect || '/');
          // 统一跳转欢迎页
          window.location.href = `${window.location.origin}/#/welcome`;
        } else {
          message.error(response.errmsg);
        }
      }
    },
    *logout({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogout, payload);
      if (response) {
        // console.log(response, '退出登录');
        const { redirect } = getPageQuery();
        if (window.location.pathname !== '/user/login' && !redirect) {
          history.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          });
        }
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
