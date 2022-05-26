/*
 * @Author: your name
 * @Date: 2020-12-30 15:45:19
 * @LastEditTime: 2021-01-04 16:10:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\capacity\full-time-driver\service.js
 */

import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 获取公司列表
 * @param {*} params
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
 * @description: 修改司机工作类型：兼职、全职
 * @param {array} driver_id 司机id
 * @param {string} work_type 1:兼职; 2:全职
 * @return {*}
 */
export function updateDriverWorkType(params = {}) {
  const url = '/saasbench/v1/driver/updateDriverWorkType/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取全职/兼职司机列表
 * @param {string}  work_type 司机类型 全职2 兼职1
 * @return {*}
 */
export function fullTimeDriverList(params = {}) {
  const url = '/saasbench/v1/driver/fullTimeDriverList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
