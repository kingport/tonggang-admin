/*
 * @Author: your name
 * @Date: 2020-12-21 13:51:44
 * @LastEditTime: 2021-02-02 15:34:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\order\customer-tool\service.js
 */

import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 获取订单列表
 * @param {object} params 参数
 * @param {string} params.user_role 角色（司机 乘客）
 * @param {string} params.phone 手机号
 * @param {string} params.start_time 开始时间
 * @param {string} params.end_time 结束时间
 * @param {string} params.caller_name 角色（司机 乘客）
 * @param {string} params.last_order_id 角色（司机 乘客）
 * @param {string} params.page_no 角色（司机 乘客）
 * @param {string} params.page_size 角色（司机 乘客）
 * @return {*}
 */
export function getHistoryOrderByCellRole(params = {}) {
  const url = '/saasbench/v1/order/getHistoryOrderByCellRole/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取发票列表
 * @param {object} params 参数
 * @return {*}
 */
export function invoiceList(params = {}) {
  const url = '/saasbench/v1/service/access/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
