/* 乘客组件 */
import React from 'react';
import { Descriptions } from 'antd';

const { Item: DescriptionsItem } = Descriptions;

const DriverMessage = (props) => {
  const { driver_bill } = props;
  return (
    <>
      <Descriptions className="descriptions" title="司机账单" size="small" column={4}>
        <DescriptionsItem label="基础费">{`${driver_bill.start_price || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="时长费">{`${
          driver_bill.normal_time_fee || 0
        }元`}</DescriptionsItem>
        <DescriptionsItem label="里程费">{`${driver_bill.normal_fee || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="最低消费">{`${driver_bill.total_fee || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="最低消费补足费">{`${
          driver_bill.limit_pay || 0
        }元`}</DescriptionsItem>
        <DescriptionsItem label="高速费">{`${driver_bill.d_highway_fee || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="停车费">{`${driver_bill.d_park_fee || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="路桥费">{`${driver_bill.d_bridge_fee || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="其他费">{`${driver_bill.d_other_fee || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="净收入">{`${driver_bill.net_income || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="信息服务费">{`${
          driver_bill.info_fee > 0 ? `-${driver_bill.info_fee}` : 0
        }元`}</DescriptionsItem>
        <DescriptionsItem label="完单奖">{`${driver_bill.rewards_fee || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="取消费">{`${driver_bill.cancel_fee || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="总价">{`${driver_bill.total_fee || 0}元`}</DescriptionsItem>
      </Descriptions>
    </>
  );
};

export default DriverMessage;
