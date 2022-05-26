import axios from 'axios';
import _ from 'lodash';
import { notification } from 'antd';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
const io = axios.create({
  baseURL: '',
  timeout: 10 * 1000,
  withCredentials: false,
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded',
    // 'Content-Type': 'application/json; charset=utf-8',
  },
});

const handleResponse = (responseData) => {
  return responseData;
};

io.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

io.interceptors.response.use(
  (res) => {
    const { data } = res;
    if (data.errno === 0) {
      return handleResponse(data);
    } else if (data.errno === 11004) {
      window.location.href = `${window.location.origin}/#/user/login`;
    } else if (data.errno == 14029) {
      notification.error({
        message: `请求错误 ${data.errno}`,
        description: JSON.stringify(data.data),
      });
    } else {
      notification.error({
        message: `请求错误 ${data.errno}`,
        description: data.errmsg,
      });
    }
  },
  (err) => {
    const { response } = err;

    if (response && response.status) {
      const errorText = codeMessage[response.status] || response.statusText;
      const { status, url } = response;
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    } else if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }

    return response;
    // return Promise.reject(err);
  },
);

const httpSlient = {};
_.each(['get', 'post', 'put', 'delete'], (method) => {
  httpSlient[method] = (args) => {
    const { url, params } = args;
    return io[method](url, params)
      .then((data) => {
        // 11004 未登录，跳转登录
        // if (data.errno * 1 === 11004) {
        //   window.location.href = `${window.location.origin}/#/user/login`;
        // }
        return data;
      })
      .catch((err) => {
        // 业务逻辑 的错误，如 errorCode 不符合预期
        // 进行参数化，把业务的error放到跟data同级的参数里，而非异常
        if (_.isUndefined(err.responseData)) {
          throw err;
        }
        return { err };
      });
  };
});

export default httpSlient;
export { io };
