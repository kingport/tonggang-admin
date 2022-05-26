import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Table, Result } from 'antd';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { useSelector } from 'dva';
import { FINANCE_STATUS } from '@/utils/constant';

// import { getHistoryOrderByCellRole, invoiceList } from './service';
import SearchForm from './components/SearchForm';

import { dataMock } from './mock/index';

const InvoiceManage = () => {
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  // console.log(userApiAuth, 'userApiAuth');
  const childrenRefSearch = useRef(null);

  const [dataSource, setDataSource] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(dataMock, 'dataMock');
    getInvoiceList();
  }, []);
  /**
   * @description: 获取发票列表
   * @param {*}
   * @return {*}
   */
  const getInvoiceList = async (params) => {
    // const res = await invoiceList(params);
    // if (res) {
    // }
    setDataSource(dataMock.data);
  };

  /**
   * @description: 查询分页
   * @param {string} current 查询当前页码
   * @return {*}
   */
  const changePage = async (current) => {
    const parasm = {
      page_no: current,
      ...orderSearchValue,
    };
    getOrderList(parasm);
  };

  // 页码配置项
  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource && dataSource.total}条`,
    total: dataSource && dataSource.total,
    pageSize: 20,
    current: dataSource && dataSource.pageNum * 1,
    onChange: (current) => changePage(current),
  };

  // 表格配置项
  const columns = [
    {
      title: '申请ID',
      dataIndex: 'applyId',
      align: 'center',
      key: 'applyId',
    },
    {
      title: '订单ID',
      dataIndex: 'orderId',
      key: 'orderId',
      align: 'center',
    },
    {
      title: '申请时间',
      dataIndex: 'applyTimeStr',
      key: 'applyTimeStr',
      align: 'center',
    },
    {
      title: '发票抬头',
      dataIndex: 'invoiceTitle',
      key: 'invoiceTitle',
      align: 'center',
    },
    {
      title: '发票号码',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      align: 'center',
    },
    {
      title: '申请开票金额',
      dataIndex: 'applyAmount',
      key: 'applyAmount',
      align: 'center',
    },
    {
      title: '申请状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        return <>{FINANCE_STATUS[status]}</>;
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 350,
      render: (record) => {
        return (
          <div>
            {
              <Button
                onClick={() => history.push(`/finance/invoice-detail?order_id=${record.orderId}`)}
                type="link"
              >
                查看
              </Button>
            }
            {record.status == 1 && (
              <Button
                onClick={() => history.push(`/order/order-detail?order_id=${record.order_id}`)}
                type="link"
              >
                冲红
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <PageContainer title="发票管理">
      <Card title={<SearchForm ref={childrenRefSearch} />}>
        <Table
          rowKey={(e) => e.orderId}
          bordered
          size="small"
          loading={loading}
          columns={columns}
          dataSource={dataSource && dataSource.dataList}
          pagination={paginationProps}
        />
      </Card>
    </PageContainer>
  );
};

export default InvoiceManage;
