/*
 * @Author: your name
 * @Date: 2021-01-14 10:56:58
 * @LastEditTime: 2021-04-02 16:15:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\riskcontrol\fly-order\service.js
 */
import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 司机车辆列表
 * @param {object} params 参数
 * @return {*}
 */
export function driverCatList(params = {}) {
  const url = '/saasbench/v1/car/carList/index';
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
 * @description: 审核日志
 * @param {object} params 参数
 * @return {*}
 */
 export function driverLogs(params = {}) {
  const url = '/saasbench/v1/car/logs/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}


/**
 * @description: 绑定司机
 * @param {object} params 参数
 * @return {*}
 */
 export function bindDriver(params = {}) {
  const url = '/saasbench/v1/driver/bind/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}