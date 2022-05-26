
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

// 公司列表
export function companyList(params = {}) {
  const url = '/saasbench/v1/company/list/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 终止合作
export function terminationCompany(params = {}) {
  const url = '/saasbench/v1/company/termination/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 开启合作
export function openCompany(params = {}) {
  const url = '/saasbench/v1/company/open/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 删除公司
export function deleteCompany(params = {}) {
  const url = '/saasbench/v1/company/delete/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 转移公司列表
export function transferCompanyList(params = {}) {
  const url = '/saasbench/v1/company/canTransferCompanyList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}






