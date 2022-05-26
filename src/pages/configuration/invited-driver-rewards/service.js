import http from '@/utils/http';
import qs from 'qs';

// 创建招募奖励活动
export function creatActiveConfig(params = {}) {
  const url = '/saasbench/v1/inviter/creatActiveConfig/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 招募奖励列表
export function activeConfigList(params = {}) {
  const url = '/saasbench/v1/inviter/activeConfigList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 查看招募奖励活动详情
export function activeConfigDetail(params = {}) {
  const url = '/saasbench/v1/inviter/getActiveConfig/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 审核招募奖励活动
export function auditActiveConfig(params = {}) {
  const url = '/saasbench/v1/inviter/auditActiveConfig/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 终止招募奖励活动
export function stopActiveConfig(params = {}) {
  const url = '/saasbench/v1/inviter/stopActiveConfig/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 编辑招募奖励活动
export function editActiveConfig(params = {}) {
  const url = '/saasbench/v1/inviter/editActiveConfig/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 备注招募奖励活动
export function remarkActiveConfig(params = {}) {
  const url = '/saasbench/v1/inviter/remarkActiveConfig/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取所有公司
export function selectCityAllComapny(params = {}) {
  const url = '/saasbench/v1/service/selectCityAllComapny/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取可选公司
export function selectCityValidComapny(params = {}) {
  const url = '/saasbench/v1/service/selectCityValidComapny/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}