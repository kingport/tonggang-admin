/*
 * @Author: your name
 * @Date: 2021-01-06 16:45:51
 * @LastEditTime: 2021-04-13 11:17:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\configuration\city-price\service.js
 */
import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 获取活动列表
 * @param {object} params 参数
 * @return {*}
 */
export function proxyForwarder(params = {}) {
  const url = '/saasbench/v1/service/access/index';
  return http.post({
    url,
    params: params,
  });
}

/**
 * @description: 查看详情记录日志
 * @param {object} params 参数
 * @return {*}
 */
 export function addOpterationLog(params = {}) {
  const url = '/saasbench/v1/activity/addOpterationLog/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}



/**
 * @description: 发布活动
 * @param {object} params 参数
 * @return {*}
 */
 export function eventList(params = {}) {
  const url = '/saasbench/v1/service/access/index';
  return http.post({
    url,
    params: params,
  });
}




/**
 * @description: 奖励司机/
 * @param {object} params 参数
 * @return {*}
 */
export function accountBalanceIncrease(params = {}) {
  const url = '/saasbench/v1/account/balance/increase';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
/**
 * @description: /惩罚司机
 * @param {object} params 参数
 * @return {*}
 */
export function accountBalanceReduce(params = {}) {
  const url = '/saasbench/v1/account/balance/reduce';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
/**
 * @description: /查看司机退款明细
 * @param {object} params 参数
 * @return {*}
 */
export function accountShowTrans(params = {}) {
  const url = '/saasbench/v1/account/showTrans/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: /获取退款详情
 * @param {object} params 参数
 * @return {*}
 */
export function showTransDetail(params = {}) {
  return http.post({
    url: `/saasbench/v1/account/showTransDetail/index`,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取开城配置列表
 * @param {object} params 参数
 * @return {*}
 */
export function cityListConfig(params = {}) {
  const url = '/saasbench/v1/area/listConfig/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 新增城市
 * @param {object} params 参数
 * @return {*}
 */
export function toAddCity(params = {}) {
  return http.post({
    url: '/saasbench/v1/area/createConfig/index',
    params: qs.stringify(params),
  });
}

/**
 * @description: 关闭开启城市
 * @param {object} params 参数
 * @return {*}
 */
export function toOprCity(params = {}) {
  return http.post({
    url: '/saasbench/v1/area/updateConfig/index',
    params: qs.stringify(params),
  });
}
