import React, { useState, useEffect } from 'react';
import { Card, Table, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { getDriverFlow } from './service';
// import { getActivityList }from './service'
import SearchForm from './components/SearchForm';
import TableTitle from './components/TableTitle';
// import CardGrid from './components/CardGrid';

const Detail = (props) => {
  const { id } = props.match.params;

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    getDetail();
  }, []);

  /**
   * @description: 获取详情
   * @param {object} values 参数
   * @param {string} driver_id 司机id
   * @return {*}
   */
  const getDetail = async (values = {}) => {
    const params = {
      driver_id: id,
      ...values,
    };
    const res = await getDriverFlow(params);
    if (res) {
      setDataSource(res.data);
    }
  };

  /**
   * @description: 获取优惠券使用列表
   * @param {object}params 参数
   * @return {*}
   */
  const couponList = async (params) => {
    const res = await getCouponList(params);
    setDataSource(res.data);
  };

  /**
   * @description: 分页查询
   * @param {string} current 当前页码
   * @return {*}
   */
  const changePage = (current) => {
    const parasm = {
      page_no: current,
      activity_id: activityId,
    };
    couponList(parasm);
  };

  // 页码配置项
  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.total}条`,
    total: dataSource.total,
    pageSize: 10,
    current: dataSource.current,
    onChange: (current) => changePage(current),
  };

  // 表格配置项
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '订单号',
      align: 'center',
      render: (record) => {
        return <span>{record.order_id == 0 ? '转到余额' : record.order_id}</span>;
      },
    },
    {
      title: '被邀请者ID',
      align: 'center',
      render: (record) => {
        return <span>{record.passenger_id == 0 ? '--' : record.passenger_id}</span>;
      },
    },
    {
      title: '完单时间',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center',
    },
    {
      title: '邀请时间',
      dataIndex: 'band_time',
      key: 'band_time',
      align: 'center',
    },
    {
      title: '奖励（元）',
      dataIndex: 'fee',
      key: 'fee',
      align: 'center',
      render: (fee) => {
        return <span>{fee / 100}</span>;
      },
    },
  ];
  return (
    <PageContainer onBack={() => window.history.back()} title="优惠券明细">
      <Space style={{ width: '100%' }} direction="vertical">
        <Card title={<SearchForm getDetail={getDetail} />}>
          <Table
            title={() => <TableTitle />}
            rowKey={(e) => e.id}
            bordered
            size="small"
            columns={columns}
            dataSource={dataSource.list}
            pagination={paginationProps}
          />
        </Card>
      </Space>
    </PageContainer>
  );
};

export default Detail;
