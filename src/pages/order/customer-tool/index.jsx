import React, { useState, useRef } from 'react';
import { Button, Card, Table, Result } from 'antd';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { useSelector } from 'dva';

import { getHistoryOrderByCellRole } from './service';
import SearchForm from './components/SearchForm';
import { API_ORDER_INFO, API_ORDER_BILL, API_ORDER_TRACK } from './constant';

const CustomerTool = () => {
  const orderSearchValue = useSelector(({ global }) => global.orderSearchValue);
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  // console.log(userApiAuth, 'userApiAuth');
  const childrenRefSearch = useRef(null);

  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * @description: 获取订单列表
   * @param {object} params 参数
   * @return {*}
   */
  const getOrderList = async (params) => {
    setLoading(true);
    const res = await getHistoryOrderByCellRole(params);
    if (res) {
      const { data = [] } = res;
      setDataSource(data);
      setLoading(false);
    } else {
      setLoading(false);
    }
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
    showTotal: () => `共${dataSource && dataSource.count}条`,
    total: dataSource && dataSource.count,
    pageSize: 20,
    current: dataSource && dataSource.page_no * 1,
    onChange: (current) => changePage(current),
  };

  // 表格配置项
  const columns = [
    {
      title: '发单时间',
      dataIndex: 'create_time',
      align: 'center',
      key: 'create_time',
    },
    {
      title: '订单起始点',
      dataIndex: 'starting_name',
      key: 'starting_name',
      align: 'center',
    },
    {
      title: '订单目的地',
      dataIndex: 'dest_name',
      key: 'dest_name',
      align: 'center',
    },
    {
      title: '订单号',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
    },
    {
      title: '订单状态',
      dataIndex: 'order_status_name',
      key: 'order_status_name',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      width: 350,
      render: (record) => {
        return (
          <div>
            {userApiAuth &&
              userApiAuth[API_ORDER_INFO] &&
              userApiAuth[API_ORDER_BILL] &&
              userApiAuth[API_ORDER_TRACK] && (
                <Button
                  onClick={() => history.push(`/order/order-detail?order_id=${record.order_id}`)}
                  type="link"
                >
                  查看
                </Button>
              )}
          </div>
        );
      },
    },
  ];
  return (
    <PageContainer title="订单查询">
      <Card title={<SearchForm ref={childrenRefSearch} getOrderList={getOrderList} />}>
        {!dataSource && <Result title="请输入手机号进行查询" />}
        {dataSource && (
          <Table
            rowKey={(e) => e.order_id}
            bordered
            size="small"
            loading={loading}
            columns={columns}
            dataSource={dataSource.order_list}
            pagination={paginationProps}
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default CustomerTool;
