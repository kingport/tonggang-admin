/*
 * @Author: your name
 * @Date: 2020-11-04 09:56:26
 * @LastEditTime: 2021-01-14 11:44:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\capacity\join\service.js
 */
import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 获取列表
 * @param {object} params 参数
 * @return {*}
 */
export function driverList(params = {}) {
  const url = '/saasbench/v1/driver/list/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 导出司机列表
 * @param {object} params 参数
 * @return {*}
 */
export function driverExport(params = {}) {
  const url = '/saasbench/v1/driver/exportRequest/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 导出司机列表进度条
 * @param {object} params 参数
 * @return {*}
 */
export function driverExportStatus(params = {}) {
  const url = '/saasbench/v1/driver/exportStatus/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 下载
 * @param {object} params 参数
 * @return {*}
 */
export function exportDownload(params = {}) {
  const url = '/saasbench/v1/driver/exportDownload/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 封禁or解禁
 * @param {object} params 参数
 * @return {*}
 */
export function driverSetBan(params = {}) {
  const url = '/saasbench/v1/driver/setBanStatus/index';
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
 * @description: 可转移公司列表
 * @param {object} params 参数
 * @return {*}
 */
export function transferCompanyList(params = {}) {
  const url = '/saasbench/v1/driver/transferCompanyList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 转移公司
 * @param {object} params 参数
 * @return {*}
 */
export function transferCompany(params = {}) {
  const url = '/saasbench/v1/driver/transferCompany/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 冻结账号
 * @param {object} params 参数
 * @return {*}
 */
export function freezeAccount(params = {}) {
  const url = '/saasbench/v1/driver/freeze/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 导出司机列表
 * @param {object} params 参数
 * @return {*}
 */
export function exportDriver(params = {}) {
  const url = '/saasbench/v1/driver/export/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取司机日志
 * @param {object} params 参数
 * @return {*}
 */
export function driverLogs(params = {}) {
  const url = '/saasbench/v1/driver/logs/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 渠道列表
 * @param {object} params 参数
 * @return {*}
 */
export function driverChannels(params = {}) {
  const url = '/saasbench/v1/driver/channels/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 添加备注
 * @param {object} params 参数
 * @return {*}
 */
export function driverSaveRemark(params = {}) {
  const url = '/saasbench/v1/driver/saveRemark/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
