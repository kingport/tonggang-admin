import http from '@/utils/http';
import qs from 'qs';

// 登录账号 邮箱号 手机号
export function fakeAccountLogin(params = {}) {
  const url = '/saasbench/v1/rbac/user/login';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 手机登录 获取验证码
export function getFakeCaptcha(params = {}) {
  const url = '/saasbench/v1/rbac/user/phoneLoginVerify';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 手机验证码登录
export function phoneVerifyLogin(params = {}) {
  const url = '/saasbench/v1/rbac/user/phoneVerifyLogin';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 修改密码 获取邮箱验证码
export function mailVerify(params = {}) {
  const url = '/saasbench/v1/rbac/user/mailVerify';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 修改密码 获取手机验证码
export function phoneChangePasswordVerify(params = {}) {
  const url = '/saasbench/v1/rbac/user/phoneChangePasswordVerify';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 确定修改密码 登录
export function chengePassword(params = {}) {
  const url = '/saasbench/v1/rbac/user/chengePassword';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取所有的城市列表
export function getCityList(params = {}) {
  const url = '/saasbench/v1/service/city/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取用户可选的城市列表
export function getUserCityList(params = {}) {
  const url = '/saasbench/v1/company/selectCity/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取用户个人信息
export function getUserInfo(params = {}) {
  const url = '/saasbench/v1/service/baseInfo/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取日志
export function getOrderOperationLog(params = {}) {
  const url = '/saasbench/v1/order/getOrderOperationLog/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 退出登录
export function fakeAccountLogout(params = {}) {
  const url = '/saasbench/v1/rbac/user/logout';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}