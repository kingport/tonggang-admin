import React, { forwardRef } from 'react';
import { history } from 'umi';
import { useSelector } from 'dva';
import { Button, Descriptions } from 'antd';

const DescriptionsDriver = (props, ref) => {
  const { detail, getDetail, getDriverInviterList } = props;

  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const userInfo = useSelector(({ global }) => global.userInfo);

  /**
   * @description: 查找城市名
   * @param {string} city 城市编码
   * @return {string} city_name 城市名
   */
  const getCityName = (city) => {
    let city_name = '';
    let district_name = '';
    if (city) {
      city_name =
        cityCountyList && cityCountyList.find((x) => x.city == city)
          ? cityCountyList && cityCountyList.find((x) => x.city == city).city_name
          : '--';
      return city_name + district_name;
    }
  };

  /**
   * @description: 跳转邀请者详情
   * @param {object} detail 城市编码
   * @return {*} 跳转
   */
  const goDriverDetail = (detail) => {
    history.push(`/capacity/invited-driver-detail/${detail.inviter_driver_id}`);
    getDetail(detail.inviter_driver_id);
    const params = {
      driver_id: detail.inviter_driver_id,
    };
    getDriverInviterList(params);
  };
  return (
    <Descriptions bordered>
      <Descriptions.Item label="司机ID">{detail && detail.driver_id}</Descriptions.Item>
      <Descriptions.Item label="账户状态">
        <span>{detail && detail.account_status_name}</span>
      </Descriptions.Item>
      <Descriptions.Item label="手机号码">
        <span>{detail && detail.cell}</span>
      </Descriptions.Item>
      <Descriptions.Item label="运营城市">
        {detail && getCityName(detail.area_id)}
      </Descriptions.Item>
      <Descriptions.Item label="司机姓名">{detail && detail.name}</Descriptions.Item>
      <Descriptions.Item label="邀请人">
        <span>{(detail && detail.inviter_driver_cell) || '--'}</span>
        {userInfo && userInfo.agent_type == 0 && detail && detail.inviter_driver_cell != '' && (
          <Button onClick={() => goDriverDetail(detail)} type="link">
            详情
          </Button>
        )}
      </Descriptions.Item>
      <Descriptions.Item label="所属公司" span={3}>
        {detail && detail.company_name}
      </Descriptions.Item>
      <Descriptions.Item label="注册时间" span={3}>
        {detail && detail._create_time}
      </Descriptions.Item>
      <Descriptions.Item label="累计邀请奖励" span={3}>
        {detail && detail.inviter_history_amount}元
      </Descriptions.Item>
    </Descriptions>
  );
};

export default forwardRef(DescriptionsDriver);
