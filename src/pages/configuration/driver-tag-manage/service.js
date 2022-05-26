/*
 * @Author: your name
 * @Date: 2021-01-14 10:56:58
 * @LastEditTime: 2021-02-25 16:55:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\riskcontrol\fly-order\service.js
 */
import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 取消管控司机列表
 * @param {object} params 参数
 * @return {*}
 */
export function cancelJudgeTypeDriverList(params = {}) {
  const url = '/saasbench/v1/driver/cancelJudgeTypeDriverList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 批量设置管控属性
 * @param {object} params 参数
 * @return {*}
 */
export function batchSetCancelJudgeType(params = {}) {
  const url = '/saasbench/v1/driver/batchSetCancelJudgeType/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
