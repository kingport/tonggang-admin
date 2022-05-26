import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button, Card, message, Table, Tag, Modal, Form, Input, Space } from 'antd';
import _ from 'lodash';
import { useSelector } from 'dva';
import { PageContainer } from '@ant-design/pro-layout';
import { API_CACEL_ORDER_LIST } from './constant';
import { driverDayOrderStatistics, driverBase } from './service';
import SearchForm from './components/SearchForm';

const DriverCar = () => {
  const childrenRefSearch = useRef(null);
  const childrenRefSearchOrder = useRef(null);

  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);

  const [dataSource, setDataSource] = useState({});
  const [dataSourceOrder, setDataSourceOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo.agent_type == 0) {
      getDriverBase();
      getDriverOrder();
    }
  }, []);

  /**
   * @description: 获取司机基础数据
   * @param {object} params 参数
   * @return {*}
   */
  const getDriverBase = async (param = {}) => {
    setLoading(true);
    const values = await childrenRefSearch.current.validateFields();
    const params = {
      ...param,
      ...values,
    };
    const res = await driverBase(params);
    if (res) {
      setDataSource(res.data);
    }
    setLoading(false);
  };

  /**
   * @description: 获取司机做单数据
   * @param {object} params 参数
   * @return {*}
   */
  const getDriverOrder = async (param = {}) => {
    setOrderLoading(true);
    const values = await childrenRefSearchOrder.current.validateFields();
    const params = {
      ...param,
      ...values,
    };
    const res = await driverDayOrderStatistics(params);
    if (res) {
      setDataSourceOrder(res.data);
    }
    setOrderLoading(false);
  };

  // 分页
  const changePage = async (current) => {
    const params = {
      page_index: current,
    };
    getDriverBase(params);
  };
  // 分页
  const changePageOrder = async (current) => {
    const params = {
      page_index: current,
    };
    getDriverOrder(params);
  };
  // 分页
  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.total}条`,
    total: dataSource.total,
    pageSize: 10,
    current: dataSource.page_index,
    onChange: (current) => changePage(current),
  };
  // 分页
  const paginationPropsOrder = {
    showQuickJumper: false,
    showTotal: () => `共${dataSourceOrder.total}条`,
    total: dataSourceOrder.total,
    pageSize: 10,
    current: dataSourceOrder.page_index,
    onChange: (current) => changePageOrder(current),
  };

  const columns = [
    {
      title: '注册日期',
      key: '_create_time',
      dataIndex: '_create_time',
      align: 'center',
    },
    {
      title: '所属城市',
      key: 'area_id',
      dataIndex: 'area_id',
      align: 'center',
      render: (code) => {
        let cityName = '';
        if (cityCountyList && cityCountyList.find((x) => x.city == code)) {
          cityName = cityCountyList.find((x) => x.city == code).city_name;
        }
        return <span>{cityName}</span>;
      },
    },
    {
      title: '姓名',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '司机ID',
      key: 'driver_id',
      dataIndex: 'driver_id',
      align: 'center',
    },
    {
      title: '手机',
      key: 'cell',
      dataIndex: 'cell',
      align: 'center',
    },
    {
      title: '车牌号',
      key: 'plate_no',
      dataIndex: 'plate_no',
      align: 'center',
    },
    {
      title: '所属公司',
      key: 'company_name',
      dataIndex: 'company_name',
      align: 'center',
    },
    {
      title: '激活日期',
      key: 'work_time',
      dataIndex: 'work_time',
      align: 'center',
      render: (work_time) => {
        return work_time.indexOf('1971') > -1 ? '' : <span>{work_time}</span>;
      },
    },
    {
      title: '首单完成日期',
      key: 'first_order_time',
      dataIndex: 'first_order_time',
      align: 'center',
    },
    {
      title: '最近完单日期',
      key: 'last_order_time',
      dataIndex: 'last_order_time',
      align: 'center',
    },
  ];
  const columnsOrder = [
    {
      title: '日期',
      key: 'date',
      dataIndex: 'date',
      align: 'center',
    },
    {
      title: '所属城市',
      key: 'area_id',
      dataIndex: 'area_id',
      align: 'center',
      render: (code) => {
        let cityName = '';
        if (cityCountyList && cityCountyList.find((x) => x.city == code)) {
          cityName = cityCountyList.find((x) => x.city == code).city_name;
        }
        return <span>{cityName}</span>;
      },
    },
    {
      title: '姓名',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '司机ID',
      key: 'driver_id',
      dataIndex: 'driver_id',
      align: 'center',
    },
    {
      title: '手机',
      key: 'cell',
      dataIndex: 'cell',
      align: 'center',
    },
    {
      title: '所属公司',
      key: 'company_name',
      dataIndex: 'company_name',
      align: 'center',
    },
    {
      title: '当日应答数',
      key: 'assigned_count',
      dataIndex: 'assigned_count',
      align: 'center',
    },
    {
      title: '当日完单数',
      key: 'finished_count',
      dataIndex: 'finished_count',
      align: 'center',
    },
    {
      title: '在线时长（小时）',
      key: 'online_time',
      dataIndex: 'online_time',
      align: 'center',
    },
    {
      title: '应收金额（包含未支付订单）',
      key: 'fee',
      dataIndex: 'fee',
      align: 'center',
    },
    {
      title: '司机取消数',
      key: 'd_cancelled_count',
      dataIndex: 'd_cancelled_count',
      align: 'center',
    },
    {
      title: '乘客取消数',
      key: 'p_cancelled_count',
      dataIndex: 'p_cancelled_count',
      align: 'center',
    },
  ];
  return (
    <PageContainer title="分城市完单日报">
      <Space style={{ width: '100%' }} direction="vertical">
        <Card
          title={useMemo(
            () => (
              <SearchForm type="BASE" ref={childrenRefSearch} getDriverBase={getDriverBase} />
            ),
            [],
          )}
        >
          <Table
            title={() => <Tag color="#108ee9">司机基础数据</Tag>}
            rowKey={(e) => e.driver_id}
            bordered
            size="small"
            scroll={{ x: 'max-content' }}
            loading={loading}
            columns={columns}
            dataSource={dataSource.info || []}
            pagination={paginationProps}
          />
        </Card>
        <Card
          title={useMemo(
            () => (
              <SearchForm
                type="ORDER"
                ref={childrenRefSearchOrder}
                getDriverBase={getDriverOrder}
              />
            ),
            [],
          )}
        >
          <Table
            title={() => <Tag color="#108ee9">司机做单数据</Tag>}
            rowKey={(e) => e.driver_id}
            bordered
            size="small"
            scroll={{ x: 'max-content' }}
            loading={orderLoading}
            columns={columnsOrder}
            dataSource={dataSourceOrder.list || []}
            pagination={paginationPropsOrder}
          />
        </Card>
      </Space>
    </PageContainer>
  );
};
export default DriverCar;
