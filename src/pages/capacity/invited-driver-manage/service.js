/*
 * @Author: your name
 * @Date: 2020-11-04 09:56:26
 * @LastEditTime: 2020-12-21 09:56:56
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\capacity\invited-driver-manage\service.js
 */
import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 邀请人列表
 * @param {object} params
 * @return {*}
 */
export function companyList(params = {}) {
  const url = '/saasbench/v1/inviter/inviterDriverList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取租赁公司列表
 * @param {object} params
 * @return {*}
 */
export function companyListAll(params = {}) {
  const url = '/saasbench/v1/driver/companyList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
