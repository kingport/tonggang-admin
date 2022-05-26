
import http from '@/utils/http';
import qs from 'qs';

// 新增公司
export function addCompany(params = {}) {
  const url = '/saasbench/v1/company/add/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取公司详情 查看or编辑
export function detailCompany(params = {}) {
  const url = '/saasbench/v1/company/get/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 编辑公司
export function updateCompany(params = {}) {
  const url = '/saasbench/v1/company/update/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

//获取新建公司可选城市
export function selectCity(params = {}) {
  const url = '/saasbench/v1/company/selectCity/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
