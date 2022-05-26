/*
 * @Author: your name
 * @Date: 2020-12-23 13:46:25
 * @LastEditTime: 2021-02-19 10:59:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\order\advancepay-list\service.js
 */

import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 获取垫付列表
 * @param {*} params
 * @return {*}
 */
export function advanceList(params = {}) {
  const url = '/saasbench/v1/order/advanceList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 垫付驳回
 * @param {*} params
 * @return {*}
 */
export function advancereject(params = {}) {
  const url = '/saasbench/v1/order/advanceReject/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 垫付
 * @param {*} params
 * @return {*}
 */
export function advancecommit(params = {}) {
  const url = '/saasbench/v1/order/advanceCommit/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取处理人列表
 * @param {*} params
 * @return {*}
 */
export function usersList(params = {}) {
  const url = '/saasbench/v1/order/getUsers/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 备注订单
 * @param {*} params
 * @return {*}
 */
export function saveRemark(params = {}) {
  const url = '/saasbench/v1/order/saveRemark/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 批量指定处理用户
 * @param {*} params
 * @return {*}
 */
export function batchSetSpecificUser(params = {}) {
  const url = '/saasbench/v1/order/batchSetSpecificUser/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 操作日志
 * @param {*} params
 * @return {*}
 */
export function advancepayLogs(params = {}) {
  const url = '/saasbench/v1/order/logs/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
