/*
 * @Author: your name
 * @Date: 2021-04-01 11:28:10
 * @LastEditTime: 2021-04-02 11:18:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /saas-tonggang/src/pages/capacity/add-car/service.js
 */
import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 新增车辆
 * @param {object} params 参数
 * @return {*}
 */
export function addDriverCar(params = {}) {
  const url = '/saasbench/v1/car/add/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 车辆详情
 * @param {object} params 参数
 * @return {*}
 */
export function detailDriver(params = {}) {
  const url = '/saasbench/v1/car/detail/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 编辑车辆信息
 * @param {object} params 参数
 * @return {*}
 */
export function driverCarUpdate(params = {}) {
  const url = '/saasbench/v1/car/update/index';
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

// 身份识别
export function driverDistinguish(params = {}) {
  const url = '/saasbench/v1/driver/distinguish/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 审核车辆
 * @param {object} params 参数
 * @return {*}
 */
export function auditDriver(params = {}) {
  const url = '/saasbench/v1/car/audit/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
