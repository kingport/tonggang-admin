import React, { useState, useEffect } from 'react';
import { Descriptions, Button } from 'antd';
const InvoiceMessage = (props) => {
  const {} = props;
  return (
    <div>
      <Descriptions title="收件信息" style={{ marginBottom: 32 }}>
        <Descriptions.Item label="收件邮箱">1000000000</Descriptions.Item>
        <Descriptions.Item label="联系电话">已取货</Descriptions.Item>
        <Descriptions.Item label="操作">
          <Button type="primary">重新发送邮箱</Button>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default InvoiceMessage;
