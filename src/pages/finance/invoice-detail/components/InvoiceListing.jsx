import React, { useState, useEffect } from 'react';
import { Descriptions, Table, Card } from 'antd';
import { dataMock2 } from '../mock/index';
const InvoiceListing = (props) => {
  const {} = props;
  const columns = [
    {
      title: '开票日期',
      dataIndex: 'applyId',
    },
    {
      title: '发票类型',
      dataIndex: 'invoiceTypeDesc',
    },
    {
      title: '发票内容',
      dataIndex: 'invoiceContent',
    },
    {
      title: '发票号码',
      dataIndex: 'invoiceNumber',
    },
    {
      title: '发票状态',
      dataIndex: 'invoiceStatusDesc',
    },
    {
      title: '金额',
      dataIndex: 'amount',
    },
  ];
  return (
    <>
      <Descriptions title="发票清单"></Descriptions>
      <Table size="small" dataSource={dataMock2.data.dataList} columns={columns} />
    </>
  );
};

export default InvoiceListing;
