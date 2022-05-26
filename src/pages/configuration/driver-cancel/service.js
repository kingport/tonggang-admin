/*
 * @Author: your name
 * @Date: 2021-03-30 11:44:21
 * @LastEditTime: 2021-03-31 09:35:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /saas-tonggang/src/pages/configuration/driver-cancel/service.js
 */

import http from '@/utils/http';
import qs from 'qs';

// 取消次数列表
export function cancelCountList(params = {}) {
  const url = '/saasbench/v1/order/cancelCountList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
// 修改/创建取消次数
export function setCancelCount(params = {}) {
  const url = '/saasbench/v1/order/setCancelCount/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
// 关闭城市取消次数配置
export function deleteCancelCount(params = {}) {
  const url = '/saasbench/v1/order/deleteCancelCount/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
