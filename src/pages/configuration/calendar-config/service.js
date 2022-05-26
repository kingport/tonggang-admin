/*
 * @Author: your name
 * @Date: 2021-01-06 16:45:51
 * @LastEditTime: 2021-01-12 15:36:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\configuration\city-price\service.js
 */
import http from '@/utils/http';
import qs from 'qs';
/**
 * @description: 设置日期
 * @param {object} params 参数
 * @return {*}
 */
export function toSetDate(params = {}) {
  return http.post({
    url: '/saasbench/v1/price/calendar/set',
    params,
  });
}

/**
 * @description: 获取日历信息
 * @param {object} params 参数
 * @return {*}
 */
export function getCalendarData(params) {
  const url = `/saasbench/v1/price/calendar/get?start=${params.start}&end=${params.end}`;
  return http.get({
    url,
  });
}
