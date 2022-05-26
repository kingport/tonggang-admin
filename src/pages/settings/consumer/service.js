
import http from '@/utils/http';
import qs from 'qs';

// 添加账号
export function createUser(params = {}) {
  const url = '/saasbench/v1/rbac/user/create';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取用户列表
export function getUserList(params = {}) {
  const url = '/saasbench/v1/rbac/user/list';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 修改密码
export function adminResetPassword(params = {}) {
  const url = '/saasbench/v1/rbac/user/adminResetPassword';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 封禁账号
export function switchStatus(params = {}) {
  const url = '/saasbench/v1/rbac/user/switchStatus';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取指定用户信息
export function getInfo(params = {}) {
  const url = '/saasbench/v1/rbac/user/getInfo';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 编辑用户
export function updateUser(params = {}) {
  const url = '/saasbench/v1/rbac/user/update';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取角色列表
export function roleList(params = {}) {
  const url = '/saasbench/v1/rbac/role/list';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取公司列表
export function companyList(params = {}) {
  const url = '/saasbench/v1/company/list/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取公司拥有权限
export function getCompanyListAuth(params = {}) {
  const url = '/saasbench/v1/rbac/user/companyList';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取角色列表
export function getUserRoleList(params = {}) {
  const url = '/saasbench/v1/rbac/user/rolelist';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取是否开启旗下公司所有权限
export function updateUserAuthority(params = {}) {
  const url = '/saasbench/v1/rbac/user/updateUserAuthority';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
