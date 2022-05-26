import http from '@/utils/http';
import qs from 'qs';
// 优惠券列表
export function getActivityList(params = {}) {
  const url = '/saasbench/v1/coupon/activityList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
// 添加优惠券
export function createActivity(params = {}) {
  const url = '/saasbench/v1/coupon/createActivity/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取编辑详情
export function editActivity(params = {}) {
  const url = '/saasbench/v1/coupon/getActivity/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 审核活动（优惠券）
export function auditActivity(params = {}) {
  const url = '/saasbench/v1/coupon/auditActivity/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 暂停活动
export function pauseActivity(params = {}) {
  const url = '/saasbench/v1/coupon/pauseActivity/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 继续活动
export function continueActivity(params = {}) {
  const url = '/saasbench/v1/coupon/continueActivity/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 终止活动
export function stopActivity(params = {}) {
  const url = '/saasbench/v1/coupon/stopActivity/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 编辑更新优惠券
export function updateActivity(params = {}) {
  const url = '/saasbench/v1/coupon/editActivity/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 添加备注
export function activityRemark(params = {}) {
  const url = '/saasbench/v1/coupon/activityRemark/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}



