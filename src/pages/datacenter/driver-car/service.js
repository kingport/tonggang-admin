/*
 * @Author: your name
 * @Date: 2021-01-14 10:56:58
 * @LastEditTime: 2021-04-02 18:17:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\riskcontrol\fly-order\service.js
 */
import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 取消订单判责列表
 * @param {object} params 参数
 * @return {*}
 */
export function cancelOrderJudgeList(params = {}) {
  const url = '/saasbench/v1/order/getCancelOrderJudgeList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 客服改判
 * @param {object} params 参数
 * @return {*}
 */
export function cancelOrderJudge(params = {}) {
  const url = '/saasbench/v1/order/cancelOrderJudge/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}







/**
 * @description: 司机基础数据
 * @param {object} params 参数
 * @return {*}
 */
 export function driverBase(params = {}) {
  const url = '/saasbench/v1/data/driverBase/index';
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


/**
 * @description: 获取司机做单数据
 * @param {object} params 参数
 * @return {*}
 */
 export function driverDayOrderStatistics(params = {}) {
  const url = '/saasbench/v1/data/driverDayOrderStatistics/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}


