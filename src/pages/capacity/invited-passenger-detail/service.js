/*
 * @Author: your name
 * @Date: 2020-09-07 09:42:17
 * @LastEditTime: 2020-12-21 10:01:56
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\capacity\invited-passenger-detail\service.js
 */
import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 获取司机明细
 * @param {object} params
 * @return {*}
 */
export function getDriverFlow(params = {}) {
  const url = '/saasbench/v1/coupon/getDriverFlow/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
