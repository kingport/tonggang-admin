import React, { useState, useEffect } from 'react';
import { Descriptions, Table, Card } from 'antd';
import { dataMock3} from '../mock/index';
const StrokeMessage = (props) => {
  const {} = props;
  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderId',
    },
    {
      title: '类型',
      dataIndex: 'productType',
    },
    {
      title: '订单起始地点',
      dataIndex: 'startingName',
    },
    {
      title: '订单目的地',
      dataIndex: 'destName',
    },
    {
      title: '上车时间',
      dataIndex: 'beginChargeTime',
    },
    {
      title: '下车时间',
      dataIndex: 'finishTime',
    },
    {
      title: '里程',
      dataIndex: 'distance',
    },
    {
      title: '开票金额',
      dataIndex: 'payAmount',
    },
  ];
  return (
    <>
      <Descriptions title="行程信息"></Descriptions>
      <Table size="small" dataSource={dataMock3.data} columns={columns} />
    </>
  );
};

export default StrokeMessage;
