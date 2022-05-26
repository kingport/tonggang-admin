import http from '@/utils/http';
import qs from 'qs';
// 获取区域活动配置
export function getActivityArea(params = {}) {
  const url = '/saasbench/v1/coupon/getActivityArea/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 设置区域活动配置 新增城市配置
export function setActivityArea(params = {}) {
  const url = '/saasbench/v1/coupon/setActivityArea/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
