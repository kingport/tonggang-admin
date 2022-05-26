/*
 * @Author: your name
 * @Date: 2021-01-06 16:45:51
 * @LastEditTime: 2021-01-12 13:05:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\configuration\city-price\service.js
 */
import http from '@/utils/http';
import qs from 'qs';
/**
 * @description: 获取计价配置列表
 * @param {object} params 参数
 * @return {*}
 */
export function cityPriceList(params = {}) {
  const url = '/saasbench/v1/price/list/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取计价配置详情
 * @param {object} params 参数
 * @return {*}
 */
export function cityPriceDetail(params = {}) {
  const url = '/saasbench/v1/price/get/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 创建计价
 * @param {object} params 参数
 * @return {*}
 */
export function cityPriceAdd(params = {}) {
  // 创建计价
  return http.post({
    url: '/saasbench/v1/price/create/index',
    params,
  });
}

/**
 * @description: 编辑提交
 * @param {object} params 参数
 * @return {*}
 */
export function cityPriceEdit(params = {}) {
  return http.post({
    url: '/saasbench/v1/price/update/index',
    params,
  });
}

/**
 * @description: 审核计价配置
 * @param {object} params 参数
 * @return {*}
 */
export function cityPriceDisable(params = {}) {
  // 审核计价配置
  return http.post({
    url: '/saasbench/v1/price/review/index',
    params: qs.stringify(params),
  });
}

