/*
 * @Author: your name
 * @Date: 2021-01-14 10:56:58
 * @LastEditTime: 2021-02-01 14:26:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\riskcontrol\fly-order\service.js
 */
import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 获取飞单列表
 * @param {object} params 参数
 * @return {*}
 */
export function flyOrderList(params = {}) {
  const url = '/saasbench/v1/order/flyOrderList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 处理飞单
 * @param {object} params 参数
 * @return {*}
 */
export function handleFlyOrder(params = {}) {
  const url = '/saasbench/v1/order/handleFlyOrder/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
