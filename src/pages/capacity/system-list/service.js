
import http from '@/utils/http';
import qs from 'qs';

// 系统优惠券列表
export function getSystemCouponList(params = {}) {
  const url = '/saasbench/v1/coupon/getSystemCouponList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 创建系统优惠券
export function createSystemCoupon(params = {}) {
  const url = '/saasbench/v1/coupon/createSystemCoupon/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 系统优惠券详情
export function couponDetail(params = {}) {
  const url = '/saasbench/v1/coupon/getSystemCouponDetail/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}





