import React, { useState, useEffect } from 'react';
import { Descriptions } from 'antd';
const InvoiceApply = (props) => {
  const {} = props;
  return (
    <div>
      <Descriptions title="开票申请" style={{ marginBottom: 32 }}>
        <Descriptions.Item label="发票主体">1000000000</Descriptions.Item>
        <Descriptions.Item label="发票类型">已取货</Descriptions.Item>
        <Descriptions.Item label="外部ID">1234123421</Descriptions.Item>
        <Descriptions.Item label="发票抬头">3214321432</Descriptions.Item>
        <Descriptions.Item label="购方纳税人识别号">3214321432</Descriptions.Item>
        <Descriptions.Item label="购方地址电话">3214321432</Descriptions.Item>
        <Descriptions.Item label="购方银行账号">3214321432</Descriptions.Item>
        <Descriptions.Item label="申请金额">3214321432</Descriptions.Item>
        <Descriptions.Item label="申请时间">3214321432</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default InvoiceApply;
