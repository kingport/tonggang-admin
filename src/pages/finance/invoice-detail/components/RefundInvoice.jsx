import React, { useState, useEffect } from 'react';
import { Descriptions, Table, Card } from 'antd';
import { dataMock2 } from '../mock/index';
const RefundInvoice = (props) => {
  const {} = props;
  const columns = [
    {
      title: '冲红ID',
      dataIndex: 'applyId',
    },
    {
      title: '冲红时间',
      dataIndex: 'invoiceTypeDesc',
    },
    {
      title: '操作人',
      dataIndex: 'invoiceContent',
    },
  ];
  return (
    <>
      <Descriptions title="冲红记录"></Descriptions>
      <Table size="small" dataSource={dataMock2.data.dataList} columns={columns} />
    </>
  );
};

export default RefundInvoice;
