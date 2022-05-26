/*
 * @Author: your name
 * @Date: 2021-01-06 16:45:51
 * @LastEditTime: 2021-01-28 17:40:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\configuration\city-price\service.js
 */
import http from '@/utils/http';
import qs from 'qs';
/**
 * @description: 获取疫情打卡列表
 * @param {object} params 参数
 * @return {*}
 */
export function signList(params = {}) {
  const url = '/saasbench/v1/driver/signList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取承诺书
 * @param {object} params 参数
 * @return {*}
 */
export function underTaking(params = {}) {
  const url = '/saasbench/v1/driver/underTaking/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
