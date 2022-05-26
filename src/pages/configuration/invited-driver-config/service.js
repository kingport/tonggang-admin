import http from '@/utils/http';
import qs from 'qs';

// 司机邀请入口列表
export function invitationEntranceList(params = {}) {
  const url = '/saasbench/v1/inviter/invitationEntranceList/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 创建司机邀请入口配置
export function createInvitationEntrance(params = {}) {
  const url = '/saasbench/v1/inviter/createInvitationEntrance/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}

// 设置司机邀请入口配置
export function setInvitationEntranceStatus(params = {}) {
  const url = '/saasbench/v1/inviter/setInvitationEntranceStatus/index';
  return http.post({
    url,
    params: qs.stringify(params),
  });
}