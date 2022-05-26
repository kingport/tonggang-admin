/*
 * @Author: your name
 * @Date: 2020-12-18 09:46:41
 * @LastEditTime: 2020-12-21 09:26:44
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\capacity\intended-drivers-list\service.js
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
 * @description: 获取意向司机列表
 * @param {*} params
 * @return {*}
 */
export function intentionDriverList(params = {}) {
  const url = '/saasbench/v1/driver/intentionDriverList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
