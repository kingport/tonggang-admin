/*
 * @Author: your name
 * @Date: 2021-01-06 16:45:51
 * @LastEditTime: 2021-01-13 10:50:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\configuration\city-price\service.js
 */
import http from '@/utils/http';
import qs from 'qs';
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
