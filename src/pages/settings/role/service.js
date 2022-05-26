/*
 * @Author: your name
 * @Date: 2021-01-31 21:22:37
 * @LastEditTime: 2021-04-14 11:10:51
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /saas-tonggang/src/pages/settings/role/service.js
 */

import http from '@/utils/http';
import qs from 'qs';

// 获取角色列表
export function roleList(params = {}) {
  const url = '/saasbench/v1/rbac/role/list';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 新建角色
export function createRole(params = {}) {
  const url = '/saasbench/v1/rbac/role/create';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 更新角色
export function updateRole(params = {}) {
  const url = '/saasbench/v1/rbac/role/update';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取角色下的用户列表
export function roleUserList(params = {}) {
  const url = '/saasbench/v1/rbac/role/roleUserList';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取全部权限列表
export function getPermissionAll(params = {}) {
  const url = '/saasbench/v1/rbac/permission/select';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取该角色的权限列表
export function getInfo(params = {}) {
  const url = '/saasbench/v1/rbac/role/getInfo';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 删除角色下的账号
export function setRole(params = {}) {
  const url = '/saasbench/v1/rbac/user/setRole';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 更新角色权限
export function roleUpdate(params = {}) {
  const url = '/saasbench/v1/rbac/role/update';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 删除角色
export function roleDelete(params = {}) {
  const url = '/saasbench/v1/rbac/role/delete';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}





