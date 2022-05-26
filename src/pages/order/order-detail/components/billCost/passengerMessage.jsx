/* 乘客组件 */
import React from 'react';
import { Descriptions, Divider } from 'antd';

const { Item: DescriptionsItem } = Descriptions;

const PassengerMessage = (props) => {
  const getInvoice = (invoice) => {
    if (invoice === 0) {
      return '可开票';
    }
    if (invoice === 1) {
      return '已经开票';
    }
    if (invoice < 0) {
      return '不可开票';
    }
    return '不可开票';
  };

  const COUPON_TYPE = {
    1: '邀请赠券',
    2: '系统赠券',
    10: '注册赠券',
  };
  const { passenger_bill, coupon_info } = props;
  return (
    <>
      <Descriptions className="descriptions" title="乘客实际账单" size="small" column={4}>
        <DescriptionsItem label="基础费">{`${passenger_bill.start_price || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="时长费">{`${
          passenger_bill.normal_time_fee || 0
        }元`}</DescriptionsItem>
        <DescriptionsItem label="里程费">{`${passenger_bill.normal_fee || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="远途费">{`${passenger_bill.p_empty_fee || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="总价">{`${passenger_bill.total_fee || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="最低消费">{`${passenger_bill.limit_fee || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="最低消费补足费">{`${
          passenger_bill.limit_pay || 0
        }元`}</DescriptionsItem>
      </Descriptions>
      <Divider style={{ margin: '8px 0 16px' }} />
      <Descriptions className="descriptions" title="乘客支付信息" size="small" column={4}>
        <DescriptionsItem label="支付金额">{`${passenger_bill.cost || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="支付时间">{passenger_bill.pay_time || '--'}</DescriptionsItem>
        <DescriptionsItem label="支付状态">
          {passenger_bill.is_pay === '1' ? '已支付' : '未支付'}
        </DescriptionsItem>
        <DescriptionsItem label="支付渠道">{passenger_bill.channel_name || '--'}</DescriptionsItem>
        <DescriptionsItem label="预付金额">{`${passenger_bill.pre_cost || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="预付时间">{passenger_bill.pre_pay_time || '--'}</DescriptionsItem>
        <DescriptionsItem label="预付状态">
          {parseInt(passenger_bill.pre_pay_status, 10) > 0 ? '已预付' : '未预付'}
        </DescriptionsItem>
        <DescriptionsItem label="退款费用">{`${
          passenger_bill.refund_fee || 0
        }元`}</DescriptionsItem>
        <DescriptionsItem label="高速费">{`${
          passenger_bill.p_highway_fee || 0
        }元`}</DescriptionsItem>
        <DescriptionsItem label="停车费">{`${passenger_bill.p_park_fee || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="路桥费">{`${
          passenger_bill.p_bridge_fee || 0
        }元`}</DescriptionsItem>
        <DescriptionsItem label="优惠券">{`${
          passenger_bill.p_coupon_fee || 0
        }元`}</DescriptionsItem>
        <DescriptionsItem label="优惠券码">{`${coupon_info.coupon_code || '--'}`}</DescriptionsItem>
        <DescriptionsItem label="优惠券类型">{`${
          COUPON_TYPE[coupon_info.coupon_type] || '--'
        }`}</DescriptionsItem>
        <DescriptionsItem label="其他费">{`${passenger_bill.p_other_fee || 0}元`}</DescriptionsItem>
        <DescriptionsItem label="取消费">{`${
          passenger_bill.p_cancel_fee || 0
        }元`}</DescriptionsItem>
        <DescriptionsItem label="发票状态">{getInvoice(passenger_bill.invoice)}</DescriptionsItem>
      </Descriptions>
    </>
  );
};

export default PassengerMessage;
