/*
 * @Author: your name
 * @Date: 2020-09-07 09:30:38
 * @LastEditTime: 2020-12-21 10:05:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\capacity\invited-passenger-list\service.js
 */
import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 手机号查询
 * @param {*} params
 * @return {*}
 */
export function getDriverBandding(params = {}) {
  const url = '/saasbench/v1/coupon/getDriverBandding/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 司机流水接口
 * @param {*} params
 * @return {*}
 */
export function getDriverFlow(params = {}) {
  const url = '/saasbench/v1/coupon/getDriverFlow/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
