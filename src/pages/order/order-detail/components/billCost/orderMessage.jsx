/* 订单详情组件 */
import React from 'react';
import { Descriptions, Divider } from 'antd';

const { Item: DescriptionsItem } = Descriptions;

const OrderMessage = (props) => {
  const { order_detail, pre_map_type, begun_map_type } = props;
  return (
    <>
      <Descriptions className="descriptions" title="预估信息" size="small" column={4}>
        <DescriptionsItem label="预估里程">{`${
          order_detail.start_dest_distance || 0
        }公里`}</DescriptionsItem>
        <DescriptionsItem label="预估时长">{`${
          order_detail.estimate_time || 0
        }分钟`}</DescriptionsItem>
        <DescriptionsItem label="预估价格">{`${
          order_detail.pre_total_fee || 0
        }元`}</DescriptionsItem>
        <DescriptionsItem label="预估地图">{`${
          pre_map_type == '0' ? '腾讯地图' : '滴滴地图'
        }`}</DescriptionsItem>
      </Descriptions>
      <Divider style={{ margin: '8px 0 16px' }} />
      <Descriptions className="descriptions" title="行程信息" size="small" column={4}>
        <DescriptionsItem label="开始计费地图">{`${
          begun_map_type == '0' ? '腾讯地图' : '滴滴地图'
        }`}</DescriptionsItem>
        <DescriptionsItem label="实际里程">{`${
          order_detail.total_distance || 0
        }公里`}</DescriptionsItem>
        <DescriptionsItem label="实际时长">{`${
          order_detail.total_time || 0
        }分钟`}</DescriptionsItem>
        <DescriptionsItem label="开始时间">{order_detail.begun_time || '--'}</DescriptionsItem>
        <DescriptionsItem label="结束时间">{order_detail.finished_time || '--'}</DescriptionsItem>
      </Descriptions>
    </>
  );
};

export default OrderMessage;
