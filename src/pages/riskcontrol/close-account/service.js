
import http from '@/utils/http';
import qs from 'qs';

// 获取取消配置列表
export function cancelRuleList(params = {}) {
  const url = '/saasbench/v1/price/cancelRuleList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 创建取消费规则
export function createCancelRule(params = {}) {
  const url = '/saasbench/v1/price/createCancelRule/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 编辑取消规则
export function editCancelRule(params = {}) {
  const url = '/saasbench/v1/price/editCancelRule/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取取消详情
export function getCancelRule(params = {}) {
  const url = '/saasbench/v1/price/getCancelRule/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 设置规则状态
export function setCancelRuleStatus(params = {}) {
  const url = '/saasbench/v1/price/setCancelRuleStatus/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

////////////////////////////////////////////////////////////////////////////////////////////
// 注销账户
export function deletePassportUid(params = {}) {
  const url = '/saasbench/v1/driver/deletePassportUid/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}