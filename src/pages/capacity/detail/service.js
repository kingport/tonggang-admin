/*
 * @Author: your name
 * @Date: 2020-09-01 10:43:40
 * @LastEditTime: 2020-12-21 09:19:10
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \SAAS\src\pages\capacity\detail\service.js
 */
import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 获取活动详细
 * @param {object} params 参数
 * @return {*}
 */
export function checkActivity(params = {}) {
  const url = '/saasbench/v1/coupon/getActivity/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 优惠券列表
 * @param {object} params 参数
 * @return {*}
 */
export function getCouponList(params = {}) {
  const url = '/saasbench/v1/coupon/getActivityCouponList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
