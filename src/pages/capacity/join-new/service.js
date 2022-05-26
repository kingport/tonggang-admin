import http from '@/utils/http';
import qs from 'qs';

// 新增司机
export function addDriver(params = {}) {
  const url = '/saasbench/v1/driver/add/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取列表
export function driverList(params = {}) {
  const url = '/saasbench/v1/driver/list/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 查看司机详情
export function driverDetail(params = {}) {
  const url = '/saasbench/v1/driver/detail/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 编辑司机信息
export function driverEdit(params = {}) {
  const url = '/saasbench/v1/driver/edit/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 车系列表
export function driverSeriesList(params = {}) {
  const url = '/saasbench/v1/driver/seriesList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 身份识别
export function driverDistinguish(params = {}) {
  const url = '/saasbench/v1/driver/distinguish/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取租赁公司列表
export function companyList(params = {}) {
  const url = '/saasbench/v1/driver/companyList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 审核司机
export function auditDriver(params = {}) {
  const url = '/saasbench/v1/driver/audit/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}


// 审核记录
export function driverLogs(params = {}) {
  const url = '/saasbench/v1/driver/logs/index';
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


// 获取户籍选择城市列表
export function cityList(params = {}) {
  const url = '/saasbench/v1/service/cityList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 获取是否需要上传双证
export function driverConfig(params = {}) {
  const url = '/saasbench/v1/driver/licConfig/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 绑定车辆
export function driverBind(params = {}) {
  const url = '/saasbench/v1/driver/bind/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}