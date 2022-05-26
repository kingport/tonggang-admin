/*
 * @Author: your name
 * @Date: 2020-12-21 15:58:30
 * @LastEditTime: 2021-02-22 17:31:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\order\order-detail\service.js
 */

import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 查询订单账单详情
 * @param {object} params 参数
 * @param {string} params.order_id 订单id
 * @return {*}
 */
export function billDetailInfo(params = {}) {
  const url = '/saasbench/v1/order/getBillDetail/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取订单信息
 * @param {object} params 参数
 * @param {string} params.order_id 订单id
 * @return {*}
 */
export function orderInfo(params = {}) {
  const url = '/saasbench/v1/order/getOrderInfo/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取订单轨迹
 * @param {object} params 参数
 * @return {*}
 */
export function orderTrack(params = {}) {
  const url = '/saasbench/v1/order/getOrderTrack/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 垫付申请记录
 * @param {object} params 参数
 * @return {*}
 */
export function advanceFlow(params = {}) {
  const url = '/saasbench/v1/order/advanceFlow/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 操作日志
 * @param {object} params 参数
 * @return {*}
 */
export function orderOperationLog(params = {}) {
  const url = '/saasbench/v1/order/getOrderOperationLog/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 退款信息
 * @param {object} params 参数
 * @return {*}
 */
export function refundInfo(params = {}) {
  const url = '/saasbench/v1/order/getRefundInfo/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 提交退款
 * @param {object} params 参数
 * @return {*}
 */
export function refundOrder(params = {}) {
  const url = '/saasbench/v1/order/refundOrder/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取关联虚拟号
 * @param {object} params 参数
 * @return {*}
 */
export function servicePhone(params = {}) {
  const url = '/saasbench/v1/service/getServicePhone/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 免单操作
 * @param {object} params 参数
 * @return {*}
 */
export function freeCharge(params = {}) {
  const url = '/saasbench/v1/order/freeCharge/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 关单操作
 * @param {object} params 参数
 * @return {*}
 */
export function closeOrder(params = {}) {
  const url = '/saasbench/v1/order/closeOrder/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 改价
 * @param {object} params 参数
 * @return {*}
 */
export function toChangeBill(params = {}) { // 客服改价操作
  const url = '/saasbench/v1/order/changeBill/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 关联虚拟号
 * @param {object} params 参数
 * @return {*}
 */
export function createVirtualNum(params = {}) { // 生成虚拟号
  const url = '/saasbench/v1/order/getPassengerPhone/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 判责给司机
 * @param {object} params 参数
 * @return {*}
 */
export function cancelOrderJudge(params = {}) {
  const url = '/saasbench/v1/order/addCancelOrderJudge/index';
  
  return http.post({
    url,
    params: qs.stringify(params),
  });
}