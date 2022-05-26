import http from '@/utils/http';
import qs from 'qs';

// 获取公司信息
export function detailCompany(params = {}) {
  const url = '/saasbench/v1/company/get/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}
