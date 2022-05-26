import http from '@/utils/http';
import qs from 'qs';

/**
 * @description: 新增公司
 * @param {object} params 参数
 * @return {*}
 */
export function addCompany(params = {}) {
  const url = '/saasbench/v1/company/add/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 公司列表
 * @param {object} params 参数
 * @return {*}
 */
export function companyList(params = {}) {
  const url = '/saasbench/v1/company/list/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 终止合作
 * @param {object} params 参数
 * @return {*}
 */
export function terminationCompany(params = {}) {
  const url = '/saasbench/v1/company/termination/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 开启合作
 * @param {object} params 参数
 * @return {*}
 */
export function openCompany(params = {}) {
  const url = '/saasbench/v1/company/open/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 删除公司
 * @param {object} params 参数
 * @return {*}
 */
export function deleteCompany(params = {}) {
  const url = '/saasbench/v1/company/delete/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 司机详情
 * @param {object} params 参数
 * @return {*}
 */
export function driverDetail(params = {}) {
  const url = '/saasbench/v1/driver/bizInfo/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取邀请人的邀请详情列表
 * @param {object} params 参数
 * @return {*}
 */
export function driverInviterList(params = {}) {
  const url = '/saasbench/v1/inviter/driverInviterList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取邀请人发奖记录
 * @param {object} params 参数
 * @return {*}
 */
export function inviterIncomeList(params = {}) {
  const url = '/saasbench/v1/inviter/inviterIncomeList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取该司机打卡记录
 * @param {object} params 参数
 * @return {*}
 */
export function recognizeMaskList(params = {}) {
  const url = '/saasbench/v1/driver/recognizeMaskList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

/**
 * @description: 获取司机奖励记录
 * @param {object} params 参数
 * @return {*}
 */
export function inviteeIncomeList(params = {}) {
  const url = '/saasbench/v1/inviter/inviteeIncomeList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}