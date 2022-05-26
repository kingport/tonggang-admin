/*
 * @Author: your name
 * @Date: 2021-04-15 11:42:20
 * @LastEditTime: 2021-04-15 15:45:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /saas-tonggang/src/pages/configuration/city-user-auth/service.js
 */

import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 获取城市权限列表
 * @param {*}
 * @return {*}
 */
export function areaList(params = {}) {
  const url = '/saasbench/v1/area/areaList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 查看配置用户列表
 * @param {*}
 * @return {*}
 */
export function areaUserList(params = {}) {
  const url = '/saasbench/v1/area/areaUserList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 用户列表
 * @param {*}
 * @return {*}
 */
export function userList(params = {}) {
  const url = '/saasbench/v1/area/userList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description:添加用户
 * @param {*}
 * @return {*}
 */
export function addUser(params = {}) {
  const url = '/saasbench/v1/area/addUser/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description:  删除用户
 * @param {*}
 * @return {*}
 */
export function removeUser(params = {}) {
  const url = '/saasbench/v1/area/removeUser/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取租赁公司列表
 * @param {object} params 参数
 * @return {*}
 */
export function companyList(params = {}) {
  const url = '/saasbench/v1/driver/companyList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
















