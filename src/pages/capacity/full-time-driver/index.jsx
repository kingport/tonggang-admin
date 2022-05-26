import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, Table, Button, Popconfirm, Row, Col, Modal, message } from 'antd';
import { PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useSelector } from 'dva';
import _ from 'lodash';
import { PageContainer } from '@ant-design/pro-layout';
import OperationLogModal from '@/components/OperationLogModal';

import { updateDriverWorkType, fullTimeDriverList } from './service';
import { API_DRIVER_FULL_LIST, API_DRIVER_WORK } from './constant';
import SearchForm from './components/SearchForm';
import AddDriverModle from './components/AddDriverModle';

const FullTimeDriver = () => {
  const cityCountyList = useSelector(({ global }) => global.cityCountyList);
  const userApiAuth = useSelector(({ global }) => global.userApiAuth);
  const userInfo = useSelector(({ global }) => global.userInfo);

  const childrenRef = useRef(null);
  const childrenAddRef = useRef(null);

  const [dataSource, setDataSource] = useState({});
  const [selectRecord, setSelectRecord] = useState();

  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showOperationLogModal, setShowOperationLogModal] = useState(false);

  // 选中的兼职司机
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    if (userApiAuth && userApiAuth[API_DRIVER_FULL_LIST]) {
      getFullTimeDriverList();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [userInfo, userApiAuth]);

  /**
   * @description: 获取全职司机列表
   * @param {object} params 参数
   * @return {object} res
   */
  const getFullTimeDriverList = async (values = {}) => {
    const params = {
      work_type: 2,
      ...values,
    };
    setLoading(true);
    try {
      const res = await fullTimeDriverList(params);
      if (res && res.data) {
        setDataSource(res.data);
        setLoading(false);
      } else {
        setDataSource([]);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @description: 显示添加全职司机弹窗
   * @param {*}
   * @return {*}
   */
  const showAddDriverModle = () => {
    setShowAddDriver(true);
  };

  /**
   * @description: 确认设置全职司机
   * @param {*}
   * @return {*}
   */
  const handleRemarkOk = async () => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setButtonLoading(true);
    const params = {
      driver_ids: JSON.stringify(selectedRowKeys),
      work_type: 2,
    };
    const res = await updateDriverWorkType(params);
    if (res) {
      message.success('操作成功');
      setShowAddDriver(false);
      getFullTimeDriverList();
      childrenAddRef.current.updataPartTimeDriverList();
    }
    setButtonLoading(false);
  };

  /**
   * @description: 选择兼职司机
   * @param {*}
   * @return {*}
   */
  const onSelectChange = useCallback((selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  }, []);

  /**
   * @description: 设置为兼职司机
   * @param {*}
   * @return {*}
   */
  const confirm = async (record) => {
    const params = {
      driver_ids: JSON.stringify([record.driver_id]),
      work_type: 1,
    };
    const res = await updateDriverWorkType(params);
    if (res) {
      message.success('操作成功');
      // TODO 刷新列表
      getFullTimeDriverList();
    }
  };

  /**
   * @description: 显示操作日志
   * @param {*} record
   * @return {*}
   */
  const showOperationLog = (record) => {
    // console.log(record);
    setShowOperationLogModal(true);
    setSelectRecord(record);
  };

  /**
   * @description: 分页查询列表
   * @param {string} current 当前页码
   * @return {object} res
   */
  const changePage = async (current) => {
    const values = await childrenRef.current.validateFields();
    const params = {
      page_index: current,
      ...values,
    };
    getFullTimeDriverList(params);
  };
  // 页脚配置项
  const paginationProps = {
    showQuickJumper: false,
    showTotal: () => `共${dataSource.totalCount}条`,
    total: dataSource.totalCount,
    current: dataSource.pageIndex * 1,
    pageSize: 20,
    pageSizeOptions: [20],
    onChange: (current) => changePage(current),
  };

  // 表格列配置项
  const columns = [
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '司机手机号',
      dataIndex: 'cell',
      key: 'cell',
      align: 'center',
    },
    {
      title: '城市',
      dataIndex: 'area_id',
      key: 'area_id',
      align: 'center',
      render: (city_code) => {
        let city_name = '';
        if (cityCountyList) {
          city_name = cityCountyList.find((x) => x.city == city_code)
            ? cityCountyList.find((x) => x.city == city_code).city_name
            : '无该城市ID';
        }
        return <span>{city_name || '--'}</span>;
      },
    },
    {
      title: '所属公司',
      dataIndex: 'join_company_name',
      key: 'join_company_name',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (record) => {
        return (
          <div>
            <Popconfirm
              title="确定设置该司机为兼职吗？"
              onConfirm={() => confirm(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link">设为兼职</Button>
            </Popconfirm>
            <Button onClick={() => showOperationLog(record)} type="link">
              操作日志
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <PageContainer title="全职司机列表">
      <Card title={<SearchForm ref={childrenRef} getFullTimeDriverList={getFullTimeDriverList} />}>
        <Table
          title={() => (
            <Row justify="space-between">
              <Col span={8}>
                <UnorderedListOutlined />
                数据列表
              </Col>
              <Col
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
                span={8}
              >
                {userApiAuth && userApiAuth[API_DRIVER_WORK] && (
                  <Button onClick={showAddDriverModle} icon={<PlusOutlined />} type="primary">
                    新增全职司机
                  </Button>
                )}
              </Col>
            </Row>
          )}
          rowKey={(e) => e.cell}
          bordered
          size="small"
          scroll={{x: 'max-content'}}
          loading={loading}
          columns={columns}
          dataSource={dataSource.info || []}
          pagination={paginationProps}
        />
      </Card>
      <Modal
        maskClosable
        width={1000}
        title="新增全职司机"
        okText="确定"
        cancelText="取消"
        visible={showAddDriver}
        onOk={handleRemarkOk}
        onCancel={() => setShowAddDriver(false)}
      >
        <AddDriverModle
          selectedRowKeys={selectedRowKeys}
          clearAll={() => setSelectedRowKeys([])}
          onSelectChange={onSelectChange}
          ref={childrenAddRef}
          buttonLoading={buttonLoading}
        />
      </Modal>
      <Modal
        title="操作日志"
        visible={showOperationLogModal}
        destroyOnClose
        onCancel={() => setShowOperationLogModal(false)}
        footer={null}
        width={544}
        className="orderModal"
        // bodyStyle={{ padding: '0 24px 24px 32px' }}
      >
        <OperationLogModal
          selectRecord={selectRecord}
          id={selectRecord && selectRecord.driver_id}
          type={17}
          addColumns={[
            {
              title: '操作结果',
              dataIndex: 'op_status',
              key: 'op_status',
              width: 80,
              render: (text) => {
                return (
                  <>
                    <div>{text ? '成功' : '失败'}</div>
                  </>
                );
              },
            },
          ]}
        />
      </Modal>
    </PageContainer>
  );
};

export default FullTimeDriver;
