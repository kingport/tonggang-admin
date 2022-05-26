import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Table, Result, Descriptions, Divider } from 'antd';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { useSelector } from 'dva';
import { FINANCE_STATUS } from '@/utils/constant';
import InvoiceApply from './components/InvoiceApply';
import InvoiceMessage from './components/InvoiceMessage';
import InvoiceListing from './components/InvoiceListing';
import StrokeMessage from './components/StrokeMessage';
import RefundInvoice from './components/RefundInvoice';
const InvoiceDetail = () => {
  return (
    <PageContainer title="发票详情">
      <Card bordered={false}>
        <InvoiceApply />
        <Divider style={{ marginBottom: 32 }} />
        <InvoiceMessage />
        <Divider style={{ marginBottom: 32 }} />
        <InvoiceListing />
        <Divider style={{ marginBottom: 32 }} />
        <StrokeMessage />
        <Divider style={{ marginBottom: 32 }} />
        <RefundInvoice />
      </Card>
    </PageContainer>
  );
};

export default InvoiceDetail;
